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
import { EquipableItem } from 'src/entity/Item'

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
  const [winopen, setWinopen] = React.useState(false);
  const [loseopen, setLoseopen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  let [battleLog, setBattleLog] = React.useState<Log[] | undefined>(undefined)
  let [playermaxhp, setPlayermaxhp] = React.useState<number | undefined>(undefined)
  let [playerhp, setPlayerhp] = React.useState<number | undefined>(undefined)
  let [monstermaxhp, setMonstermaxhp] = React.useState<number | undefined>(undefined)
  let [monsterhp, setMonsterhp] = React.useState<number | undefined>(undefined)
  let [isPlayerWin, setIsPlayerWin] = React.useState<boolean | undefined>(undefined)
  let [player, setPlayer] = React.useState<string | undefined>(undefined)
  let [floor, setFloor] = React.useState<number | undefined>(undefined)
  let [bestFloor, setBestFloor] = React.useState<number | undefined>(undefined)
  let [presentFloor, setPresentFloor] = React.useState<number | undefined>(undefined)
  let [prevAnime, setPrevAnime] = React.useState('')
  let [monster, setMonster] = React.useState<string | undefined>(undefined)
  let [monsterName, setMonsterName] = React.useState<string | undefined>(undefined)

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setLogopen(true);
    setScroll(scrollType);
  };

  const handleClickClose = () => {
    setLogopen(false);
  };

  const handleWinOpen = () => {
    setWinopen(true);
  }

  const handleWinClose = () => {
    setWinopen(false);
    if (typeof window !== 'undefined') {
      let floordata = window.sessionStorage.getItem('floor')
      if (floordata !== null) {
        let floorNumber: number = +floordata
        sessionStorage.setItem('floor', `${floorNumber + 1}`)
      }
    }
  };

  const handleLoseOpen = () => {
    setLoseopen(true);
    sessionStorage.clear();
  }

  const handleLoseClose = () => {
    setLoseopen(false);
  };

  const scrollBottom = () => {
    let div = document.getElementById("id");
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

  React.useEffect(function () {
    fetch("/api/cloudtower/my-floor", { method: 'POST' }).then(async (response) => {
      const data = await response.json()
      setBestFloor(data.cloudTowerFloor)
    })
  }, [])

  function no_back() {
    if (typeof window !== undefined)
      window.history.forward();
  }
  React.useEffect(no_back, []);

  function no_reload() {
    if (sessionStorage.length === 0)
      location.href = '/cloud-tower'
  }
  React.useEffect(no_reload, []);

  React.useEffect(function () {
    if (typeof window !== 'undefined') {
      let name = window.sessionStorage.getItem('name')
      let rawdata = window.sessionStorage.getItem('data')
      let floordata = window.sessionStorage.getItem('floor')
      if (rawdata !== null && floordata !== null) {
        let floorNumber: number = +floordata
        let data = JSON.parse(rawdata)
        setBattleLog(data.data.floorInfos[floorNumber].eventLog)
        setIsPlayerWin(data.data.floorInfos[floorNumber].isPlayerWin)
        setFloor(data.data.floor)
        setPresentFloor(floorNumber + 1)
        if (data.data.floorInfos[floorNumber].eventLog !== undefined) {
          setMonstermaxhp(data.data.floorInfos[floorNumber].eventLog[0].MonsterStatus.hpmax)
          setPlayermaxhp(data.data.floorInfos[floorNumber].eventLog[0].PlayerStatus.hpmax)
          setMonsterhp(data.data.floorInfos[floorNumber].eventLog[0].MonsterStatus.hpmax)
          setPlayerhp(data.data.floorInfos[floorNumber].eventLog[0].PlayerStatus.hpmax)
        }
        if (name !== null) {
          if (data.data.playerEquipedInfo.enchantItemInfo !== undefined)
            setPlayer(data.data.playerEquipedInfo.enchantItemInfo.name + " " + name)
          else
            setPlayer(name)
        }
        if (data.data.floorInfos[floorNumber].monsterName !== undefined) {
          setMonsterName(data.data.floorInfos[floorNumber].monsterName)
          if (data.data.floorInfos[floorNumber].monsterEquipedInfo.enchantItemInfo !== undefined)
            setMonster(data.data.floorInfos[floorNumber].monsterEquipedInfo.enchantItemInfo.name + " " + data.data.floorInfos[floorNumber].monsterName)
          else
            setMonster(data.data.floorInfos[floorNumber].monsterName)
        }
      }
    }
  }, [])

  let printmessage = []
  let [logmessage, setLogmessage] = React.useState<React.ReactNode[]>([])
  let [logCheck, setLogCheck] = React.useState<React.ReactNode[]>([])
  let [resultmessage, setResultmessage] = React.useState<React.ReactNode[]>([])
  let printdialog = []
  let [turn, setTurn] = React.useState(1)

  printmessage.push(
    <Typography
      display="inline"
      sx={{
        my: 1,
      }}
    >
      {presentFloor !== undefined ? presentFloor : undefined}층의 주인,
    </Typography>
  )
  printmessage.push(
    <Typography
      display="inline"
      sx={{
        my: 1,
        color: 'red',
      }}
    >
      {' ' + monster}
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

  const clickBox = () => {
    if (battleLog !== undefined) {
      if (turn < battleLog.length) {
        let temporarylogmessage = []
        switch (battleLog[turn].LogType) {
          case "Attack":
            let attacker = battleLog[turn].IsPlayerAttack ? player : monster;
            let defender = battleLog[turn].IsPlayerAttack ? monster : player;
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
            let EffectOn = battleLog[turn].IsEffectOnPlayer ? player : monster;
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
                setMonsterhp(Math.max(battleLog[turn].DefenderStatus.hpmax, 0))
              }
              else {
                animateCSS('.monster', 'shakeX')
                setMonsterhp(Math.max(battleLog[turn].DefenderStatus.hpmax, 0))
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
        if (isPlayerWin) {
          temporarylogmessage.push(
            < Typography
              key='win1'
              display="inline"
              sx={{
                my: 1,
                color: 'red',
              }
              }
            >
              {monster}
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='win2'
              display="inline"
              sx={{
                my: 1,
              }
              }
            >
              이/가 쓰러졌다!
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='win3'
              sx={{
                my: 1,
              }
              }
            >
              {""}
            </Typography >
          )
        }
        else {
          temporarylogmessage.push(
            < Typography
              key='lose1'
              display='inline'
              sx={{
                my: 1,
                color: '#0000FF',
              }
              }
            >
              {player}
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='lose2'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='lose3'
              sx={{
                my: 1,
              }}
            >
              {""}
            </Typography >
          )
        }
        if (isPlayerWin !== undefined && isPlayerWin) {
          setMonsterhp(0)
        }
        else {
          setPlayerhp(0)
        }
        setLogmessage([...logmessage,
        <TextAnimation
          charInterval={30}
          onNextChar={scrollBottom}
        >
          {temporarylogmessage}
        </TextAnimation>])
        setLogCheck([...logCheck, temporarylogmessage])
      }
      else if (turn == battleLog[0].length + 1) {
        let temporaryresultmessage = []
        if (isPlayerWin) {
          temporaryresultmessage.push(
            <Typography
              key='win-result'
              display="inline"
              sx={{
                my: 1,
              }}
            >
              전투 결과,
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win-result1'
              display="inline"
              sx={{
                my: 1,
                color: 'red',
              }}
            >
              {" " + monster}
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win-result2'
              display="inline"
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win!'
              sx={{
                my: 1,
                fontWeight: 'bold',
              }}
            >
              승리!
            </Typography>
          )
        }
        else {
          temporaryresultmessage.push(
            <Typography
              key='lose-result1'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              전투 결과,
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose-result2'
              display='inline'
              sx={{
                my: 1,
                color: '#0000FF',
              }}
            >
              {" " + player}
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose-result3'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose!'
              sx={{
                my: 1,
                fontWeight: 'bold',
              }}
            >
              패배!
            </Typography>
          )
        }
        setResultmessage([...resultmessage,
        <TextAnimation
          charInterval={30}
          onNextChar={scrollBottom}
        >
          {temporaryresultmessage}
        </TextAnimation>])
      }
      else {
        if (isPlayerWin) {
          handleWinOpen()
        }
        else {
          handleLoseOpen()
        }
      }
    }
    setTurn(turn + 1);
  }


  if (isPlayerWin !== undefined && isPlayerWin) {
    printdialog.push(
      <Dialog
        key='fatigue1'
        fullWidth={true}
        open={winopen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">{presentFloor !== undefined ? presentFloor : undefined}층 승리</DialogTitle>
        <DialogContent>
          <Typography
            align="center"
            display="inline"
            sx={{
              color: 'red',
            }}
          >
            {monster}
          </Typography>
          <Typography
            align="center"
            display="inline"
            sx={{
              color: '#000000',
            }}
          >
            을/를 무찔렀다!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickOpen('paper')}
            sx={{
              bgcolor: '#CCCCCC',
              color: '#000000',
              width: 0.5,
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
              {logCheck}
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
          <Button
            onClick={handleWinClose}
            sx={{
              width: 0.5,
              bgcolor: '#CCCCCC',
              color: '#000000',
            }}
            href='/cloud-tower-battle'
          >다음층으로 이동</Button>
        </DialogActions>
      </Dialog>
    )
  }
  else {
    printdialog.push(
      <Dialog
        key='fatigue2'
        fullWidth={true}
        open={loseopen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">패배</DialogTitle>
        <DialogContent>
          <Typography
            display="inline"
            align="center"
            sx={{
              mb: 2,
              color: 'red',
            }}
          >
            {monster}
          </Typography>
          <Typography
            display="inline"
            align="center"
            sx={{
              mb: 2,
              color: 'black',
            }}
          >
            에 의해 쓰러졌다.
          </Typography>
          <Typography
            align="center"
            sx={{
              mb: 2,
            }}
          >
            {""}
          </Typography>
          <Typography
            align="center"
          >
            이번 기록: {floor}층
          </Typography>
          <Typography
            align="center"
          >
            최고 기록: {bestFloor}층
          </Typography>
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
              {logCheck}
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
          <Button
            onClick={handleLoseClose}
            sx={{
              width: 0.5,
              bgcolor: '#CCCCCC',
              color: '#000000',
            }}
            href={"/cloud-tower"}
          >입구로 돌아가기</Button>
        </DialogActions>
      </Dialog>
    )
  }

  React.useEffect(function () {
    animateCSS_start('.monster', 'fadeInDown')
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Container
          sx={{
            backgroundImage: 'url("/static/바벨탑.png")',
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
                src={monster !== undefined ? "/static/몬스터/" + monsterName + ".png" : undefined}
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
                  value={(monsterhp !== undefined ? monsterhp : 100) / (monstermaxhp !== undefined ? monstermaxhp : 100) * 100}
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
                  {monsterhp !== undefined ? monsterhp : monstermaxhp} / {monstermaxhp}
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