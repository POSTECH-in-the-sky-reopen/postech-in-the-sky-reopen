import * as React from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import StarsIcon from '@mui/icons-material/Stars';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Friend } from "src/interfaces/Friend";
import Container from '@mui/material/Container';
import Profile from './profile';
import Typography from '@mui/material/Typography';

function ClassRanking() {

    let [open, setOpen] = React.useState(false);
    let [value, setValue] = React.useState('1');
    let [playerRanking, setPlayerRanking] = React.useState<Friend[] | undefined>(undefined)
    let [playerDamage, setPlayerDamage] = React.useState<number[] | undefined>(undefined)
    let [playerClass, setPlayerClass] = React.useState<number[] | undefined>(undefined)
    let [groupRanking, setGroupRanking] = React.useState<number[] | undefined>(undefined)
    let [groupDamage, setGroupDamage] = React.useState<number[] | undefined>(undefined)
    let groupRankingBoard = []
    let playerRankingBoard = []

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const handleOpen = () => {
        fetch("/api/siege/player-ranking", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setPlayerRanking(data.ranking)
            setPlayerClass(data.groups)
            setPlayerDamage(data.damages)
        })
        fetch("/api/siege/group-ranking", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setGroupRanking(data.group)
            setGroupDamage(data.damage)
        })
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setValue('1')
    }
    if (playerRanking !== undefined && playerDamage !== undefined && playerClass !== undefined) {
        for (let i = 0; i < playerRanking.length; i++) {
            playerRankingBoard.push(
                <Container
                    sx={{
                        width: "100%",
                        height: "15vh",
                        position: 'relative',
                        mb: '3%',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: 'auto',
                            position: 'absolute',
                            left: '-20%',
                        }}
                    >
                        <Profile
                            equipments={playerRanking[i].equipments}
                            width={80}
                            unit={'%'}
                        />
                    </Box>
                    <Stack
                        direction='column'
                        justifyContent="center"
                        alignItems="flex-start"
                        spacing={0.5}
                        sx={{
                            position: 'absolute',
                            right: '0%',
                            top: '25%',
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'black',
                                fontWeight: 'bold',
                            }}
                        >
                            {i + 1}등
                        </Typography>
                        <Typography
                            sx={{
                                color: 'black',
                            }}>
                            {playerClass[i]}분반
                        </Typography>
                        <Typography
                            sx={{
                                color: 'black',
                            }}>
                            {playerRanking[i].name}
                        </Typography>
                        <Typography
                            sx={{
                                color: 'black',
                            }}>
                            준 대미지: {playerDamage[i]}
                        </Typography>
                    </Stack>
                </Container>
            )
        }
    }

    if (groupRanking !== undefined && groupDamage !== undefined) {
        for (let i = 0; i < 3; i++) {
            if (groupDamage[i] !== 0) {
                groupRankingBoard.push(
                    <Box
                        sx={{
                            width: '100%',
                            height: 'auto',
                            color: 'black',
                        }}
                    >
                        {i + 1}등: {groupRanking[i]}분반
                    </Box>
                )
            }
            else {
                groupRankingBoard.push(
                    <Box
                        sx={{
                            width: '100%',
                            height: 'auto',
                            color: 'black',
                        }}
                    >
                        {i + 1}등: 없음
                    </Box>
                )
            }
        }
    }

    return (
        <div>
            <Button
                onClick={handleOpen}
                sx={{
                    color: 'white',
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                }}
            >
                <img
                    src="/static/UI 아이콘/점령전 랭킹.png"
                    style={{
                        width: '20%'
                    }}
                />
                <Typography
                    sx={{
                        color: 'white',
                        textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                        whiteSpace: 'nowrap',
                    }}
                >
                    랭킹
                </Typography>
            </Button>
            <Dialog
                fullScreen
                onClose={handleClose}
                open={open}
                fullWidth={true}
            >
                <DialogTitle>점령전 현황</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange}>
                                    <Tab label="분반 랭킹" value="1" />
                                    <Tab label="개인 랭킹" value="2" />
                                </TabList>
                            </Box>
                            <TabPanel value="1">
                                <Stack
                                    direction='column'
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                >
                                    {groupRankingBoard}
                                </Stack>
                            </TabPanel>
                            <TabPanel value="2">
                                <Stack
                                    direction='column'
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        position: 'relative'
                                    }}
                                >
                                    {playerRankingBoard}
                                </Stack>
                            </TabPanel>
                        </TabContext>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        sx={{
                            bgcolor: '#CCCCCC',
                            color: '#000000',
                        }}
                    >확인</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ClassRanking;
