import type { NextPage } from 'next'
import React from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import { Graph } from "react-d3-graph";
import { Cell } from 'src/entity/Cell'
import { mapData } from 'src/util/Map';


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

const Home: NextPage = () => {

    const data = mapData

    let [height, setHeight] = React.useState<number>(1000)
    let [width, setWidth] = React.useState<number>(1000)
    const mapConfig = {
        height: height,
        width: width,
        node: {
            color: "lightgray",
            size: 120,
            fontSize: 8,
            labelPosition: "bottom" as const,
            fontColor: "white",
        },
        staticGraph: true,
        freezeAllDragEvents: true,
    }

    let [siegeCell, setSiegeCell] = React.useState<Cell[] | undefined>(undefined)
    let [teleportableTo, setTeleportableTo] = React.useState<Cell[] | undefined>(undefined)
    let [visitableCell, setVisitableCell] = React.useState<Cell[] | undefined>(undefined)

    let [loc, setLoc] = React.useState<Cell | undefined>(undefined)
    let [lv, setLv] = React.useState<number | undefined>(undefined)

    React.useEffect(function () {
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
        fetch("/api/player/location/current", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setLoc(data.cell)
        })
        fetch("/api/map/get-teleportable-cells", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setTeleportableTo(data.cells)
        })
        fetch("/api/map/get-visitable-cells", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setVisitableCell(data.cells)
        })
        fetch("/api/map/get-siege-cells", { method: 'POST' }).then(async (response) => {
            const data = await response.json()
            setSiegeCell(data.cells)
        })
    }, [])

    React.useEffect(function () {
        let scale = [
            0.00225 * window.innerWidth,
            0.002583 * window.innerWidth,
            0.002639 * window.innerWidth,
            0.002556 * window.innerWidth,
            0.002056 * window.innerWidth,
        ]
        let translate = [
            [
                (-0.0656) * window.innerWidth,
                (0.1679) * window.innerHeight,
            ],
            [
                (-0.1434) * window.innerWidth,
                (0.0965) * window.innerHeight,
            ],
            [
                (-0.1722) * window.innerWidth,
                (0.1775) * window.innerHeight,
            ],
            [
                (-0.0678) * window.innerWidth,
                (0.1224) * window.innerHeight,
            ],
            [
                (0.0028) * window.innerWidth,
                (0.1975) * window.innerHeight,
            ],
        ]
        let idx = (lv !== undefined) ? lv - 1 : 0
        let element = document.getElementById(`graph-${lv}-graph-container-zoomable`)
        element?.setAttribute(
            'transform',
            `translate(${translate[idx][0]}, ${translate[idx][1]}) scale(${scale[idx]})`
        )
    }, [lv])

    React.useEffect(function () {
        if (loc === undefined
            || visitableCell === undefined
            || teleportableTo === undefined
            || siegeCell === undefined
        ) {
            return;
        }
        let _lv = lv ? lv : loc.region.level
        for (let region = 0; region < 5; region++) {
            for (let cell = 0; cell < data[region].nodes.length; cell++) {
                if (data[region].nodes[cell].id === loc.name) {
                    data[region].nodes[cell] = Object.assign(data[region].nodes[cell], { color: 'red' })
                    continue
                }
                let idx = visitableCell.findIndex(node => data[region].nodes[cell].id === node.name)
                if (idx !== -1) {
                    let color = 'lightgreen'
                    idx = teleportableTo.findIndex(node => data[region].nodes[cell].id === node.name)
                    if (idx !== -1) {
                        color = 'lightblue'
                    }
                    idx = siegeCell.findIndex(node => data[region].nodes[cell].id === node.name)
                    if (idx !== -1) {
                        color = 'blue'
                    }
                    data[region].nodes[cell] = Object.assign(data[region].nodes[cell], { color: color })
                }
            }
        }
        setLv(_lv)
    }, [lv, loc, visitableCell, teleportableTo, siegeCell])

    function region_print() {
        let width = ['110%', '106%', '126%', '110%', '140%']
        let top = ['18%', '18%', '18%', '18%', '25%']
        let left = ['-5%', '-3%', '-13%', '-5%', '-20%',]
        if (lv === undefined) {
            return ''
        } else {
            return (
                <img
                    src={`/static/지도/맵${lv}.png`}
                    style={{
                        width: width[lv - 1],
                        objectFit: 'cover',
                        position: 'absolute',
                        top: top[lv - 1],
                        left: left[lv - 1],
                    }}
                />
            )
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                sx={{
                    backgroundImage: 'url("/static/지도/배경.png")',
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
                {region_print()}
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
                            history.back()
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
                        맵 (지역{lv})
                    </Typography>
                </Container>
                <Stack
                    direction="column"
                    spacing={0.5}
                    sx={{
                        width: '100%',
                        position: 'absolute',
                        top: '5%',
                        left: '2%',
                    }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={0.5}
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: 'red',
                                width: '1rem',
                                height: '1rem',
                            }}
                        />
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                color: 'white',
                            }}
                        >
                            현재 위치
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={0.5}
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: 'lightblue',
                                width: '1rem',
                                height: '1rem',
                            }}
                        />
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                color: 'white',
                            }}
                        >
                            텔레포트 가능한 셀
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={0.5}
                        sx={{
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                bgcolor: 'blue',
                                width: '1rem',
                                height: '1rem',
                            }}
                        />
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                color: 'white',
                            }}
                        >
                            점령전 셀
                        </Typography>
                    </Stack>
                </Stack>
                <Typography
                    id='map'
                    sx={{
                        textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                        position: 'absolute',
                    }}
                >
                    <Graph
                        id={`graph-${lv}`}
                        data={data[lv ? lv - 1 : 0]}
                        config={mapConfig}
                    />
                </Typography>
                {
                    lv !== undefined && lv >= 2 ?
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            spacing={0}
                            sx={{
                                width: '30%',
                                position: 'absolute',
                                top: '50%',
                                translate: 'transition(0,-50%)',
                                left: '0%',
                            }}
                        >
                            <IconButton
                                sx={{
                                    color: '#ffffff',
                                }}
                                onClick={() => {
                                    if (lv !== undefined)
                                        setLv(lv - 1)
                                }}
                            >
                                <ArrowBackSharpIcon />
                            </IconButton>
                            <Typography
                                align='center'
                                sx={{
                                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                    color: 'white',
                                }}
                            >
                                지역 {lv !== undefined ? lv - 1 : ""}
                            </Typography>
                        </Stack> :
                        <IconButton
                            disabled
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                translate: 'transition(0,-50%)',
                                left: '0%',
                            }}
                        >
                            <ArrowBackSharpIcon />
                        </IconButton>
                }
                {
                    lv !== undefined && lv <= 4 ?
                        <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="flex-end"
                            spacing={0}
                            sx={{
                                width: '30%',
                                position: 'absolute',
                                top: '50%',
                                translate: 'transition(0,-50%)',
                                right: '0%',
                            }}
                        >
                            <IconButton
                                sx={{
                                    color: '#ffffff',
                                }}
                                onClick={() => {
                                    if (lv !== undefined)
                                        setLv(lv + 1)
                                }}
                            >
                                <ArrowForwardSharpIcon />
                            </IconButton>
                            <Typography
                                align='center'
                                sx={{
                                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                                    color: 'white',
                                }}
                            >
                                지역 {lv !== undefined ? lv + 1 : ""}
                            </Typography>
                        </Stack> :
                        <IconButton
                            disabled
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                translate: 'transition(0,-50%)',
                                right: '0%',
                            }}
                        >
                            <ArrowForwardSharpIcon />
                        </IconButton>
                }
            </Container>
        </ThemeProvider >
    )
}

export default Home