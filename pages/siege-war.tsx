import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextAnimation from "react-animate-text";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Log } from 'src/interfaces/Log'
import { Item } from 'src/entity/Item'
import { ItemType } from 'src/enums/ItemType';
import 'animate.css';
import { Cell } from 'src/entity/Cell'
import { BossMonsterInfo } from 'src/entity/MonsterInfo'

const theme = createTheme({
    typography: {
        fontFamily: 'MaplestoryLight',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'MaplestoryLight';
          src: url("/static/fonts/MaplestoryLight.ttf") format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
        },
    },
})

export default function Battle() {

    const [logopen, setLogopen] = React.useState(false);
    const [itemopen, setItemopen] = React.useState(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    let [battleLog, setBattleLog] = React.useState<Log[] | undefined>(undefined)
    let [playermaxhp, setPlayermaxhp] = React.useState<number | undefined>(undefined)
    let [playerhp, setPlayerhp] = React.useState<number | undefined>(undefined)
    let [start, setStart] = React.useState<boolean | undefined>(false)
    let [player, setPlayer] = React.useState<string | undefined>(undefined)
    let [cell, setCell] = React.useState<Cell | undefined>(undefined)
    let [damage, setDamage] = React.useState<number | undefined>(undefined)
    let [fatigueIncreased, setFatigueIncreased] = React.useState<number | undefined>(undefined)
    let [bossMonsterInfo, setBossMonsterInfo] = React.useState<BossMonsterInfo | undefined>(undefined)
    let [brokenItems, setBrokenItems] = React.useState<Item[] | undefined>(undefined)
    let [prevAnime, setPrevAnime] = React.useState('')

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setLogopen(true);
        setScroll(scrollType);
    };

    const handleClickClose = () => {
        setLogopen(false);
    };

    const handleOpen = () => {
        setItemopen(true);
        sessionStorage.clear();
    }

    const handleClose = () => {
        setItemopen(false);
    };

    const scrollBottom = () => {
        var div = document.getElementById("id");
        div ? div.scrollTop = div.scrollHeight : null;
    };

    function animateCSS_start(element: any, animation: any, prefix: string = 'animate__') {
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof document ? document.querySelector(element) : undefined;
            const box = typeof document ? document.querySelector('.box') : undefined
            node.classList.add(`${prefix}animated`, animationName, `${prefix}slow`);

            // When the animation ends, we clean the classes and resolve the Promise
            function handleAnimationEnd(event: any) {
                event.stopPropagation();
                node.classList.remove(`${prefix}animated`, animationName, `${prefix}slow`);
                resolve('Animation ended');
            }

            setPrevAnime(animationName)

            node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
            box !== undefined && box !== null ? box.addEventListener('click', handleAnimationEnd, { once: true }) : undefined;
        });
    }

    function animateCSS(element: any, animation: any, prefix: string = 'animate__') {
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof document ? document.querySelector(element) : undefined;
            node.classList.remove(`${prefix}animated`, prevAnime);            
            node.classList.add(`${prefix}animated`, animationName);

            // When the animation ends, we clean the classes and resolve the Promise
            function handleAnimationEnd(event: any) {
                event.stopPropagation();
                node.classList.remove(`${prefix}animated`, animationName);
                resolve('Animation ended');
            }

            setPrevAnime(animationName)

            node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
        });
    }

    function no_back() {
        if (typeof window !== undefined)
            window.history.forward();
    }
    React.useEffect(no_back, []);

    function no_reload() {
        if (sessionStorage.length === 0)
            location.href = '/adventure'
    }
    React.useEffect(no_reload, []);

    React.useEffect(function () {
        if (typeof window !== 'undefined') {
            let name = window.sessionStorage.getItem('name')
            let rawdata = window.sessionStorage.getItem('data')
            if (rawdata !== null) {
                let data = JSON.parse(rawdata)
                setBossMonsterInfo(data.data.bossMonsterInfo)
                setBattleLog(data.data.eventLog)
                setDamage(data.data.damage)
                setBrokenItems(data.data.brokenItems)
                setFatigueIncreased(data.data.fatigueIncreased)
                if (data.data.eventLog !== undefined) {
                    setPlayermaxhp(data.data.eventLog[0].PlayerStatus.hpmax)
                    setPlayerhp(data.data.eventLog[0].PlayerStatus.hpmax)
                }
                if (name !== null) {
                    if (data.data.playerEquipedInfo.enchantItemInfo !== undefined)
                        setPlayer(data.data.playerEquipedInfo.enchantItemInfo.name + " " + name)
                    else
                        setPlayer(name)
                }
            }
        }
    }, [])

    React.useEffect(function () {
        fetch("/api/player/location/current", {method: 'POST'}).then(async (response) => {
            const data = await response.json()
            setCell(data.cell)
        })
    }, [])

    let printmessage = []
    let [logmessage, setLogmessage] = React.useState<React.ReactNode[]>([])
    let [logCheck, setLogCheck] = React.useState<React.ReactNode[]>([])
    let brokenitemlog = []
    let printdialog = []
    let [turn, setTurn] = React.useState(1)

    printmessage.push(
        <Typography
            display="inline"
            sx={{
                my: 1,
                color: 'red',
            }}
        >
            {bossMonsterInfo?.name}
        </Typography>
    )
    printmessage.push(
        <Typography
            display="inline"
            sx={{
                my: 1,
            }}
        >
            이/가 나타났다!
        </Typography>
    )
    printmessage.push(
        <Typography
            key='greeting'
            sx={{
                my: 1,
            }}
        >
            {""}
        </Typography>
    )

    if (brokenItems !== undefined) {
        if (brokenItems.length !== 0) {
            for (let i = 0; i < brokenItems.length; i++) {
                switch (brokenItems[i].itemType) {
                    case ItemType.WEAPON:
                        brokenitemlog.push(
                            <Box
                                sx={{
                                    width: 1,
                                }}
                            >
                                <Stack
                                    direction='column'
                                    alignItems='center'
                                    justifyContent='center'
                                    spacing={1}
                                    sx={{
                                        width: '100%',
                                    }}
                                >
                                    <img
                                        src={"/static/무기 아이콘/" + brokenItems[i].itemInfo.name + ".png"}
                                        style={{
                                            border: "solid",
                                            borderColor: "#000000",
                                            borderRadius: "2rem",
                                            backgroundColor: "rgba(192,192,192, 0.6)",
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            display: "inline",
                                            filter: 'brightness(0.5)',
                                        }}
                                    />
                                    <Typography
                                        align="center"
                                        sx={{
                                            color: 'red',
                                        }}
                                    >
                                        {brokenItems[i].itemInfo.name}이/가 부서졌다!
                                    </Typography>
                                </Stack>
                            </Box>
                        )
                        break
                    case ItemType.ACCESSORY:
                        brokenitemlog.push(
                            <Box
                                sx={{
                                    width: 1,
                                }}
                            >
                                <Stack
                                    direction='column'
                                    justifyContent='center'
                                    alignItems='center'
                                    spacing={1}
                                >
                                    <img
                                        src={"/static/장신구/" + brokenItems[i].itemInfo.name + ".png"}
                                        style={{
                                            border: "solid",
                                            borderColor: "#000000",
                                            borderRadius: "2rem",
                                            backgroundColor: "rgba(192,192,192, 0.6)",
                                            width: "100%",
                                            height: "auto",
                                            objectFit: "cover",
                                            display: "inline",
                                            filter: 'brightness(0.5)',
                                        }}
                                    />
                                    <Typography
                                        align="center"
                                        sx={{
                                            color: 'red',
                                            width: '100%',
                                        }}
                                    >
                                        {brokenItems[i].itemInfo.name}이/가 부서졌다!
                                    </Typography>
                                </Stack>
                            </Box>
                        )
                        break
                }
            }
        }
        else {
            brokenitemlog.push(
                <Typography
                    align="center"
                >
                    착용한 아이템의 내구도가 99 감소하였다!
                </Typography>
            )
        }
    }

    const clickBox = () => {
        if (battleLog !== undefined) {
            if (turn < battleLog.length) {
                let temporarylogmessage = []
                switch (battleLog[turn].LogType) {
                    case "Attack":
                        let attacker = battleLog[turn].IsPlayerAttack ? player : bossMonsterInfo?.name;
                        let defender = battleLog[turn].IsPlayerAttack ? bossMonsterInfo?.name : player;
                        if (battleLog[turn].IsPlayerAttack) {
                            if (battleLog[turn].IsDodge) {
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                            color: '#0000FF',
                                        }}
                                    >
                                        {attacker}
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        의 공격! 하지만
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                            color: 'red',
                                        }}
                                    >
                                        {" " + defender}
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        은/는 피했다!
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        {""}
                                    </Typography>
                                )
                            }
                            else {
                                if (battleLog[turn].IsCritical) {
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: '#0000FF',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {attacker}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            의 치명타 공격!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {defender}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            의 체력이 {battleLog[turn].Damage}만큼 감소했다!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                }
                                else {
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: '#0000FF',
                                            }}
                                        >
                                            {attacker}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            의 공격!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: 'red',
                                            }}
                                        >
                                            {defender}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            의 체력이 {battleLog[turn].Damage}만큼 감소했다!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                }
                                temporarylogmessage.push(
                                    <Typography
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        {battleLog[turn].EffectMessage}
                                    </Typography>
                                )
                            }
                        }
                        else {
                            if (battleLog[turn].IsDodge) {
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                            color: 'red',
                                        }}
                                    >
                                        {attacker}
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        의 공격! 하지만
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                            color: '#0000FF',
                                        }}
                                    >
                                        {" " + defender}
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        display="inline"
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        은/는 피했다!
                                    </Typography>
                                )
                                temporarylogmessage.push(
                                    <Typography
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        {""}
                                    </Typography>
                                )
                            }
                            else {
                                if (battleLog[turn].IsCritical) {
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: 'red',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {attacker}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            의 치명타 공격!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: '#0000FF',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {defender}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            의 체력이 {battleLog[turn].Damage}만큼 감소했다!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                }
                                else {
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: 'red',
                                            }}
                                        >
                                            {attacker}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            의 공격!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                                color: '#0000FF',
                                            }}
                                        >
                                            {defender}
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            display="inline"
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            의 체력이 {battleLog[turn].Damage}만큼 감소했다!
                                        </Typography>
                                    )
                                    temporarylogmessage.push(
                                        <Typography
                                            sx={{
                                                my: 1,
                                            }}
                                        >
                                            {""}
                                        </Typography>
                                    )
                                }
                                temporarylogmessage.push(
                                    <Typography
                                        sx={{
                                            my: 1,
                                        }}
                                    >
                                        {battleLog[turn].EffectMessage}
                                    </Typography>
                                )
                            }
                        }
                        break
                    case "Effect":
                        let EffectOn = battleLog[turn].IsEffectOnPlayer ? player : bossMonsterInfo?.name;
                        if (battleLog[turn].IsEffectOnPlayer) {
                            temporarylogmessage.push(
                                <Typography
                                    display="inline"
                                    sx={{
                                        my: 1,
                                        color: '#0000FF',
                                    }}
                                >
                                    {EffectOn}
                                </Typography>
                            )
                            temporarylogmessage.push(
                                <Typography
                                    display="inline"
                                    sx={{
                                        my: 1,
                                    }}
                                >
                                    이/가 {battleLog[turn].EffectMessage}
                                </Typography>
                            )
                            temporarylogmessage.push(
                                <Typography
                                    sx={{
                                        my: 1,
                                    }}
                                >
                                    {""}
                                </Typography>
                            )
                        }
                        else {
                            temporarylogmessage.push(
                                <Typography
                                    display="inline"
                                    sx={{
                                        my: 1,
                                        color: 'red',
                                    }}
                                >
                                    {EffectOn}
                                </Typography>
                            )
                            temporarylogmessage.push(
                                <Typography
                                    display="inline"
                                    sx={{
                                        my: 1,
                                    }}
                                >
                                    이/가 {battleLog[turn].EffectMessage}
                                </Typography>
                            )
                            temporarylogmessage.push(
                                <Typography
                                    sx={{
                                        my: 1,
                                    }}
                                >
                                    {""}
                                </Typography>
                            )
                        }
                        break
                }
                if (battleLog[turn].LogType === "Effect") {
                    if (!(battleLog[turn].IsEffectOnPlayer))
                        animateCSS('.monster', 'shakeY')
                }
                else {
                    if (battleLog[turn].IsPlayerAttack) {
                        if (battleLog[turn].IsDodge) {
                            animateCSS('.monster', 'flip')
                        }
                        else {
                            if (battleLog[turn].IsCritical) {
                                animateCSS('.monster', 'wobble')
                            }
                            else {
                                animateCSS('.monster', 'shakeX')
                            }
                        }
                    }
                    else {
                        if (battleLog[turn].IsDodge) {
                            animateCSS('.monster', 'tada')
                        }
                        else {
                            if (battleLog[turn].IsCritical) {
                                animateCSS('.monster', 'heartBeat')
                                setPlayerhp(Math.max(battleLog[turn].DefenderStatus.hpmax, 0))
                            }
                            else {
                                animateCSS('.monster', 'tada')
                                setPlayerhp(Math.max(battleLog[turn].DefenderStatus.hpmax, 0))
                            }
                        }
                    }
                }
                setLogCheck([...logCheck, temporarylogmessage])
                setLogmessage([...logmessage,

                <TextAnimation
                    charInterval={30}
                    onNextChar={scrollBottom}
                >
                    {temporarylogmessage}
                </TextAnimation>])
            }
            else if (turn == battleLog.length) {
                let temporarylogmessage = []
                temporarylogmessage.push(
                    <Typography
                        key='lose'
                        display='inline'
                        sx={{
                            my: 1,
                            color: 'red',
                        }}
                    >
                        {player}
                    </Typography>
                )
                temporarylogmessage.push(
                    <Typography
                        key='lose'
                        display='inline'
                        sx={{
                            my: 1,
                        }}
                    >
                        이/가 쓰러졌다!
                    </Typography>
                )
                temporarylogmessage.push(
                    <Typography
                        key='lose'
                        sx={{
                            my: 1,
                        }}
                    >
                        {""}
                    </Typography>
                )
                setPlayerhp(0)
                setLogmessage([...logmessage,
                <TextAnimation
                    charInterval={30}
                    onNextChar={scrollBottom}
                >
                    {temporarylogmessage}
                </TextAnimation>])
                setLogCheck([...logCheck, temporarylogmessage])
            }
            else{
                handleOpen()
            }
        }
        setTurn(turn + 1);
    }


    printdialog.push(
        <Dialog
            key='item-drop'
            open={itemopen}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogContent>
                <DialogContentText
                    id="scroll-dialog-description"
                >
                    <Stack
                        direction='row'
                        alignItems='flex-start'
                        justifyContent='center'
                        spacing={1}
                    >
                        {brokenitemlog}
                    </Stack>
                    <Typography
                        align="center"
                        sx={{
                            mt: 2,
                            fontSize: 16,
                        }}
                    >
                        {bossMonsterInfo !== undefined ? bossMonsterInfo.name : ""}에게 {damage}만큼 피해를 주었다!
                    </Typography>
                    <Typography
                        align="center"
                        sx={{
                            color: 'red',
                            mt: 2,
                            fontSize: 14,
                        }}
                    >
                        피로도가 {fatigueIncreased} 증가했다!
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClickOpen('paper')}
                    sx={{
                        width: 0.5,
                        bgcolor: '#CCCCCC',
                        color: '#000000',
                    }}

                >전투 로그 보기</Button>
                <Dialog
                    open={logopen}
                    onClose={handleClickClose}
                    scroll={scroll}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                >
                    <DialogTitle id="scroll-dialog-title">전투 로그</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText
                            id="scroll-dialog-description"
                            tabIndex={-1}
                        >
                            {logCheck}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClickClose}
                            sx={{
                                width: 1,
                                bgcolor: '#CCCCCC',
                                color: '#000000',
                            }}
                        >확인</Button>
                    </DialogActions>
                </Dialog>
                {
                    brokenItems!==undefined && brokenItems.length?
                    <Button
                        onClick={handleClose}
                        sx={{
                            width: 0.5,
                            bgcolor: '#CCCCCC',
                            color: '#000000',
                        }}
                        href="/myinfo"
                    >확인</Button>:
                    <Button
                        onClick={handleClose}
                        sx={{
                            width: 0.5,
                            bgcolor: '#CCCCCC',
                            color: '#000000',
                        }}
                        href="adventure"
                    >확인</Button>
                }
            </DialogActions>
        </Dialog>
    )

    React.useEffect(function () {
        animateCSS_start('.monster', 'fadeInDown')
    }, [])

    let mycell = cell !== undefined ? "/static/배경/" + cell.name + ".jpg" : undefined

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <CssBaseline />
                <Container
                    sx={{
                        backgroundImage: `url("${mycell}")`,
                        height: '100vh',
                        width: 'auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        p: 0,
                        overflow: "hidden",
                        position: 'relative',
                    }}
                >
                    <Container
                        sx={{
                            height: 1,
                            width: 'auto',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            p: 0,
                        }}
                    >
                        <Box
                            sx={{
                                width: "150%",
                                height: "auto",
                                position: 'absolute',
                                top: '-5%',
                                left: '50%',
                                transform: 'translate(-50%,0)',
                            }}
                        >
                            <img
                                className="monster"
                                src={bossMonsterInfo !== undefined ? "/static/몬스터/" + bossMonsterInfo.name + ".png" : undefined}
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                        <Box sx={{
                            width: '80%',
                            position: 'absolute',
                            top: '5%',
                            left: '50%',
                            transform: 'translate(-50%,0)',
                        }}>
                            <Box sx={{ width: '100%', justifyContent: 'center', mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    color="inherit"
                                    sx={{
                                        width: '100%',
                                        color: '#FF3333',
                                        bgcolor: '#E0E0E0',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%', justifyContent: 'center', mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    color="inherit"
                                    sx={{
                                        width: '100%',
                                        color: '#FF3333',
                                        bgcolor: '#E0E0E0',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%', justifyContent: 'center', mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    color="inherit"
                                    sx={{
                                        width: '100%',
                                        color: '#FF3333',
                                        bgcolor: '#E0E0E0',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%', justifyContent: 'center', mt: 1 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    color="inherit"
                                    sx={{
                                        width: '100%',
                                        color: '#FF3333',
                                        bgcolor: '#E0E0E0',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2" color="text.secondary" align="center"
                                    sx={{
                                        color: 'white',
                                        textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                    }}>
                                    ??? / ???
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            width: '100%',
                            position: 'absolute',
                            bottom: '35%'
                        }}>
                            <Box sx={{ width: '100%' }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(playerhp !== undefined ? playerhp : 100) / (playermaxhp !== undefined ? playermaxhp : 100) * 100}
                                    color="inherit"
                                    sx={{
                                        width: '80%',
                                        color: '#FF3333',
                                        bgcolor: '#E0E0E0',
                                        position: 'absolute',
                                        left: '50%',
                                        transform: 'translate(-50%,0)',
                                    }}
                                />
                            </Box>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2" color="text.secondary" align="center"
                                    sx={{
                                        color: 'white',
                                        textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                    }}>
                                    {playerhp !== undefined ? playerhp : playermaxhp} / {playermaxhp}
                                </Typography>
                            </Box>
                        </Box>

                        <Container
                            id="id"
                            className='box'
                            onClick={clickBox}
                            sx={{
                                width: 1,
                                height: 0.3,
                                border: 1,
                                borderRadius: 4,
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                overflow: 'scroll',
                                position: 'absolute',
                                bottom: '0%',
                            }}
                        >
                            <TextAnimation
                                charInterval={30}
                                onNextChar={scrollBottom}
                            >
                                {printmessage}
                            </TextAnimation>
                            {logmessage}
                            {printdialog}
                        </Container>
                    </Container>
                </Container>
            </React.Fragment>
        </ThemeProvider >
    );
}