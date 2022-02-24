import type { NextPage } from 'next'
import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import 'animate.css';
import { EquipedInformation } from 'src/interfaces/EquipedInformation'
import { Log } from 'src/interfaces/Log'
import { Friend } from "src/interfaces/Friend";

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

interface CloudTowerFriend extends Friend {
    floor: number
    group: number
}

const Home: NextPage = () => {


    let [bestFloor, setBestFloor] = React.useState<number | undefined>(undefined)
    let [ranking, setRanking] = React.useState<CloudTowerFriend[] | undefined>(undefined)
    let rank = []
    let name = []
    let floor = []
    let group = []

    function greeting() {
        var randNum = Math.floor(Math.random() * (240)) + 1
        if (randNum > 200) {
            return (
                "몇 층까지 올라갈 수 있을까?"
            )
        }
        else if (randNum > 160) {
            return (
                "구름탑을 올라가던 도중 나가면 저장되지 않을 수 있으니 주의하세요!"
            )
        }
        else if (randNum > 120) {
            return (
                "자신의 강함을 증명하세요!"
            )
        }
        else if (randNum > 80) {
            return (
                "구름탑에 오신 여러분 환영합니다!"
            )
        }
        else if (randNum > 40) {
            return (
                "여기 구름탑에서는 장비의 내구도가 감소되지 않아요!"
            )
        }
        else {
            return (
                "열심히 플레이 해줘서 감사해요!!"
            )
        }
    }

    function animateCSS_1(element: any, animation: any, prefix: string = 'animate__') {
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof document ? document.querySelector(element) : undefined;
            node.classList.add(`${prefix}animated`, animationName, `${prefix}slower`, `${prefix}delay-2s`, `${prefix}lose`);
        });
    }
    function animateCSS_2(element: any, animation: any, prefix: string = 'animate__') {
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof document ? document.querySelector(element) : undefined;
            node.classList.add(`${prefix}animated`, animationName, `${prefix}slower`, `${prefix}delay-1s`, `${prefix}lose`);
        });
    }
    function animateCSS_3(element: any, animation: any, prefix: string = 'animate__') {
        // We create a Promise and return it
        new Promise((resolve, reject) => {
            const animationName = `${prefix}${animation}`;
            const node = typeof document ? document.querySelector(element) : undefined;
            node.classList.add(`${prefix}animated`, animationName, `${prefix}slower`, `${prefix}delay-3s`, `${prefix}lose`);
        });
    }

    React.useEffect(function () {
        animateCSS_1('.cloud1', 'fadeOutRight')
        animateCSS_2('.cloud2', 'fadeOutLeft')
        animateCSS_3('.cloud3', 'fadeOutLeft')
        animateCSS_1('.cloud4', 'fadeOutRight')
        animateCSS_1('.cloud5', 'fadeOutRight')
        animateCSS_2('.cloud6', 'fadeOutLeft')
        animateCSS_3('.cloud7', 'fadeOutLeft')
        animateCSS_3('.cloud8', 'fadeOutLeft')
    }, [])

    React.useEffect(function () {
        fetch("/api/player/name", { method: 'POST' }).then(async (response) => {
            const data = await response.json();
            sessionStorage.setItem('name', data.name)
        });
    }, [])

    React.useEffect(function () {
        fetch("/api/cloudtower/my-floor", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setBestFloor(data.cloudTowerFloor)
        })
    }, [])

    React.useEffect(function () {
        fetch("/api/cloudtower/ranking", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setRanking(data.ranking)
        })
    }, [])

    if (ranking !== undefined) {
        for (let i = 0; i < ranking.length; i++) {
            rank.push(
                <Typography
                key = {"rank"+i}
                >
                    {i + 1}
                </Typography>
            )
            name.push(
                <Typography
                key = {"name"+i}>
                    {ranking[i].name}
                </Typography>
            )
            group.push(
                <Typography
                key = {"group"+i}>
                    {ranking[i].group}
                </Typography>
            )
            floor.push(
                <Typography
                key = {"floor"+i}>
                    {ranking[i].floor}층
                </Typography>
            )
        }
    }

    return (
        <ThemeProvider theme={theme}>
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
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container
                    sx={{
                        height: "5%",
                        width: 1,
                        backgroundColor: "#dcedf8",
                        p: 0,
                    }}>
                    <IconButton
                        sx={{
                            color: '#000000',
                            height: '5%',
                            width: 'auto',
                            position: 'absolute',
                            p: 1,
                        }}
                        onClick={() => {
                            location.href = "/main"
                        }}
                    >
                        <ArrowBackSharpIcon />
                    </IconButton>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            p: 1,
                        }}
                        fontSize="100%"
                    >
                        구름탑 입구
                    </Typography>
                </Container>
                <img src="/static/NPC/제작자 이지은.png"
                    style={{
                        width: "180%",
                        objectFit: "cover",
                        position: "absolute",
                        top: '22%',
                        left: "-10%",
                    }} />
                <Box
                    sx={{
                        top: '10%',
                        padding: '5%',
                        position: 'absolute',
                        right: '50%',
                        transform: 'translate(50%, 0)',
                        width: '90%',
                        height: '15%',
                        background: 'white',
                        borderRadius: '10px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '0',
                            left: '80%',
                            width: '0',
                            height: '0',
                            border: '22px solid transparent',
                            borderTopColor: 'white',
                            borderBottom: '0',
                            borderRight: '0',
                            marginLeft: '-11px',
                            marginBottom: '-22px',
                        }} />
                    <Typography>
                        {greeting()}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        top: '30%',
                        position: 'absolute',
                        right: '45%',
                        width: '50%',
                        height: '45%',
                        background: '#F9FFFF',
                        border: 'double #32a1ce',
                        borderRadius: '10px',
                        p: 0,
                        overflow: 'hidden',
                    }}>
                    <Typography
                        align='center'
                        sx={{
                            width: '100%',
                            height: '8%',
                            mt: '5%',
                            mb: '10%',
                        }}
                    >
                        명예의 전당
                    </Typography>
                    <img src="/static/월계수.png"
                        style={{
                            width: "90%",
                            left: '50%',
                            transform: 'translate(-50%, 0)',
                            top: '-1.5%',
                            objectFit: "cover",
                            position: "absolute",
                        }} />
                    <Box
                        sx={{
                            width: '100%',
                            height: '85%',
                            p: 0,
                            overflow: 'scroll',
                        }}>
                        <Stack
                            direction="row"
                            justifyContent="space-around"
                            alignItems="center"
                            sx={{
                                width: 1,
                            }}
                        >
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={3}
                            >
                                <Typography>
                                    등수
                                </Typography>
                                {rank}
                            </Stack>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={3}
                            >
                                <Typography>
                                    이름
                                </Typography>
                                {name}
                            </Stack>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={3}
                            >
                                <Typography>
                                    분반
                                </Typography>
                                {group}
                            </Stack>
                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                spacing={3}
                            >
                                <Typography>
                                    기록
                                </Typography>
                                {floor}
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '12%',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        borderRadius: 2,
                        bgcolor: '#dce4f9',
                        p: '5%',
                    }}
                >
                    <Typography
                        align='center'
                    >
                        내 최고기록: {bestFloor}층
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    fullWidth={true}
                    onClick={function () {
                        fetch("/api/cloudtower/challenge", { method: 'POST' }).then(async (response) => {
                            const data = await response.json()
                            if (response.status >= 400)
                              throw new Error(data.message)

                            sessionStorage.setItem('data', JSON.stringify({ data: data }))
                            sessionStorage.setItem('floor', '0')
                            location.href = "/cloud-tower-battle"
                        }).catch(err => {
                            console.log(err.message)
                            alert(err.message)
                          })
                    }}
                    sx={{
                        fontSize: 20,
                        height: "10%",
                        width: 1,
                        position: 'absolute',
                        bottom: '0%',
                        bgcolor: '#bdb6f1',
                        color: '#000000',
                        p: 0,
                    }}>
                    입장하기
                </Button>

                <img src="/static/UI/구름1.png"
                    className='cloud1'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "8%",
                        left: "-10%",
                    }} />
                <img src="/static/UI/구름1.png"
                    className='cloud4'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "-30%",
                        left: "-10%",
                    }} />
                <img src="/static/UI/구름1.png"
                    className='cloud5'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "40%",
                        left: "-10%",
                    }} />
                <img src="/static/UI/구름2.png"
                    className='cloud2'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "50%",
                        right: "-10%",
                    }} />
                <img src="/static/UI/구름2.png"
                    className='cloud6'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "20%",
                        right: "-10%",
                    }} />
                <img src="/static/UI/구름3.png"
                    className='cloud3'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "-10%",
                        right: "-20%",
                    }} />
                <img src="/static/UI/구름3.png"
                    className='cloud7'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "-30%",
                        right: "-20%",
                    }} />
                <img src="/static/UI/구름3.png"
                    className='cloud8'
                    style={{
                        width: "200%",
                        objectFit: "cover",
                        position: "absolute",
                        bottom: "-50%",
                        right: "-20%",
                    }} />
            </Container>
        </ThemeProvider >
    )
}

export default Home