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

    const data1 = {
        nodes: [
            { id: "78계단 3", x: 250, y: 460, },
            { id: "지곡연못 2", x: 100, y: 390 },
            { id: "지곡연못 3", x: 150, y: 410, },
            { id: "78계단 2", x: 250, y: 410 },
            { id: "대학원아파트 2", x: 350, y: 410, },
            { id: "대학원아파트 3", x: 400, y: 390, },
            { id: "지곡연못 1", x: 100, y: 340 },
            { id: "78계단 1", x: 250, y: 360 },
            { id: "대학원아파트 1", x: 350, y: 360 },
            { id: "지곡회관 3", x: 100, y: 290 },
            { id: "지곡회관 2", x: 150, y: 310, },
            { id: "지곡회관 1", x: 200, y: 290 },
            { id: "해동78타워 5", x: 250, y: 310, },
            { id: "교수아파트 1", x: 300, y: 290 },
            { id: "교수아파트 2", x: 350, y: 310 },
            { id: "교수아파트 3", x: 400, y: 290 },
            { id: "해동78타워 4", x: 250, y: 260 },
            { id: "해동78타워 3", x: 250, y: 210, },
            { id: "RC 20동 1", x: 300, y: 190 },
            { id: "RC 20동 2", x: 350, y: 210, },
            { id: "RC 20동 3", x: 400, y: 190 },
            { id: "해동78타워 2", x: 250, y: 160 },
            { id: "해동78타워 1", x: 250, y: 110, },
            { id: "RC 21동 3", x: 300, y: 90 },
            { id: "RC 21동 2", x: 350, y: 110, },
            { id: "RC 21동 1", x: 400, y: 90, },
        ],
        links: [
            { source: "78계단 3", target: "78계단 2" },
            { source: "지곡연못 2", target: "지곡연못 3" },
            { source: "지곡연못 2", target: "지곡연못 1" },
            { source: "지곡연못 3", target: "지곡연못 2" },
            { source: "78계단 2", target: "78계단 3" },
            { source: "78계단 2", target: "78계단 1" },
            { source: "대학원아파트 2", target: "대학원아파트 3" },
            { source: "대학원아파트 2", target: "대학원아파트 1" },
            { source: "대학원아파트 3", target: "대학원아파트 2" },
            { source: "지곡연못 1", target: "지곡연못 2" },
            { source: "지곡연못 1", target: "지곡회관 3" },
            { source: "78계단 1", target: "78계단 2" },
            { source: "78계단 1", target: "해동78타워 5" },
            { source: "대학원아파트 1", target: "대학원아파트 2" },
            { source: "대학원아파트 1", target: "교수아파트 2" },
            { source: "지곡회관 3", target: "지곡회관 2" },
            { source: "지곡회관 3", target: "지곡연못 1" },
            { source: "지곡회관 2", target: "지곡회관 1" },
            { source: "지곡회관 2", target: "지곡회관 3" },
            { source: "지곡회관 1", target: "해동78타워 5" },
            { source: "지곡회관 1", target: "지곡회관 2" },
            { source: "해동78타워 5", target: "교수아파트 1" },
            { source: "해동78타워 5", target: "지곡회관 1" },
            { source: "해동78타워 5", target: "78계단 1" },
            { source: "해동78타워 5", target: "해동78타워 4" },
            { source: "교수아파트 1", target: "교수아파트 2" },
            { source: "교수아파트 1", target: "해동78타워 5" },
            { source: "교수아파트 2", target: "교수아파트 3" },
            { source: "교수아파트 2", target: "교수아파트 1" },
            { source: "교수아파트 2", target: "대학원아파트 1" },
            { source: "교수아파트 3", target: "교수아파트 2" },
            { source: "해동78타워 4", target: "해동78타워 5" },
            { source: "해동78타워 4", target: "해동78타워 3" },
            { source: "해동78타워 3", target: "RC 20동 1" },
            { source: "해동78타워 3", target: "해동78타워 4" },
            { source: "해동78타워 3", target: "해동78타워 2" },
            { source: "RC 20동 1", target: "RC 20동 2" },
            { source: "RC 20동 1", target: "해동78타워 3" },
            { source: "RC 20동 2", target: "RC 20동 3" },
            { source: "RC 20동 2", target: "RC 20동 1" },
            { source: "RC 20동 3", target: "RC 20동 2" },
            { source: "해동78타워 2", target: "해동78타워 3" },
            { source: "해동78타워 2", target: "해동78타워 1" },
            { source: "해동78타워 1", target: "RC 21동 3" },
            { source: "해동78타워 1", target: "해동78타워 2" },
            { source: "RC 21동 3", target: "RC 21동 2" },
            { source: "RC 21동 3", target: "해동78타워 1" },
            { source: "RC 21동 2", target: "RC 21동 1" },
            { source: "RC 21동 2", target: "RC 21동 3" },
            { source: "RC 21동 1", target: "RC 21동 2" },
        ],
    };

    const data2 = {
        nodes: [
            { id: "철강대학원 3", x: 900, y: 440, },
            { id: "체인지업그라운드 3", x: 600, y: 390, },
            { id: "체인지업그라운드 2", x: 650, y: 410, },
            { id: "생명공학연구센터 2", x: 750, y: 410 },
            { id: "생명공학연구센터 3", x: 800, y: 390, },
            { id: "철강대학원 2", x: 900, y: 390, },
            { id: "체인지업그라운드 1", x: 650, y: 360 },
            { id: "생명공학연구센터 1", x: 750, y: 360 },
            { id: "철강대학원 1", x: 900, y: 340 },
            { id: "박태준학술정보관 3", x: 600, y: 290 },
            { id: "박태준학술정보관 2", x: 650, y: 310 },
            { id: "박태준학술정보관 1", x: 700, y: 290 },
            { id: "동문 1", x: 750, y: 310, },
            { id: "한국로봇융합연구원 1", x: 800, y: 290 },
            { id: "한국로봇융합연구원 2", x: 850, y: 310 },
            { id: "한국로봇융합연구원 3", x: 900, y: 290 },
            { id: "동문 2", x: 750, y: 260 },
            { id: "C5 2", x: 650, y: 210 },
            { id: "C5 1", x: 700, y: 190 },
            { id: "동문 3", x: 750, y: 210 },
            { id: "C5 3", x: 650, y: 160 },
            { id: "동문 4", x: 750, y: 160 },
            { id: "지곡연구동 3", x: 850, y: 160, },
            { id: "동문 5", x: 750, y: 110 },
            { id: "지곡연구동 1", x: 800, y: 90 },
            { id: "지곡연구동 2", x: 850, y: 110, },
        ],
        links: [
            { source: "철강대학원 3", target: "철강대학원 2" },
            { source: "체인지업그라운드 3", target: "체인지업그라운드 2" },
            { source: "체인지업그라운드 2", target: "체인지업그라운드 3" },
            { source: "체인지업그라운드 2", target: "체인지업그라운드 1" },
            { source: "생명공학연구센터 2", target: "생명공학연구센터 3" },
            { source: "생명공학연구센터 2", target: "생명공학연구센터 1" },
            { source: "생명공학연구센터 3", target: "생명공학연구센터 2" },
            { source: "철강대학원 2", target: "철강대학원 3" },
            { source: "철강대학원 2", target: "철강대학원 1" },
            { source: "체인지업그라운드 1", target: "체인지업그라운드 2" },
            { source: "체인지업그라운드 1", target: "박태준학술정보관 2" },
            { source: "생명공학연구센터 1", target: "생명공학연구센터 2" },
            { source: "생명공학연구센터 1", target: "동문 1" },
            { source: "철강대학원 1", target: "철강대학원 2" },
            { source: "철강대학원 1", target: "한국로봇융합연구원 3" },
            { source: "박태준학술정보관 3", target: "박태준학술정보관 2" },
            { source: "박태준학술정보관 2", target: "박태준학술정보관 1" },
            { source: "박태준학술정보관 2", target: "박태준학술정보관 3" },
            { source: "박태준학술정보관 2", target: "체인지업그라운드 1" },
            { source: "박태준학술정보관 1", target: "동문 1" },
            { source: "박태준학술정보관 1", target: "박태준학술정보관 2" },
            { source: "동문 1", target: "한국로봇융합연구원 1" },
            { source: "동문 1", target: "박태준학술정보관 1" },
            { source: "동문 1", target: "생명공학연구센터 1" },
            { source: "동문 1", target: "동문 2" },
            { source: "한국로봇융합연구원 1", target: "한국로봇융합연구원 2" },
            { source: "한국로봇융합연구원 1", target: "동문 1" },
            { source: "한국로봇융합연구원 2", target: "한국로봇융합연구원 3" },
            { source: "한국로봇융합연구원 2", target: "한국로봇융합연구원 1" },
            { source: "한국로봇융합연구원 3", target: "한국로봇융합연구원 2" },
            { source: "한국로봇융합연구원 3", target: "철강대학원 1" },
            { source: "동문 2", target: "동문 1" },
            { source: "동문 2", target: "동문 3" },
            { source: "C5 2", target: "C5 1" },
            { source: "C5 2", target: "C5 3" },
            { source: "C5 1", target: "동문 3" },
            { source: "C5 1", target: "C5 2" },
            { source: "동문 3", target: "C5 1" },
            { source: "동문 3", target: "동문 2" },
            { source: "동문 3", target: "동문 4" },
            { source: "C5 3", target: "C5 2" },
            { source: "동문 4", target: "동문 3" },
            { source: "동문 4", target: "동문 5" },
            { source: "지곡연구동 3", target: "지곡연구동 2" },
            { source: "동문 5", target: "지곡연구동 1" },
            { source: "동문 5", target: "동문 4" },
            { source: "지곡연구동 1", target: "지곡연구동 2" },
            { source: "지곡연구동 1", target: "동문 5" },
            { source: "지곡연구동 2", target: "지곡연구동 1" },
            { source: "지곡연구동 2", target: "지곡연구동 3" },
        ],
    };

    const data3 = {
        nodes: [
            { id: "수리과학관 1", x: 1100, y: 440 },
            { id: "수리과학관 2", x: 1150, y: 460, },
            { id: "제1공학관 2", x: 1350, y: 460, },
            { id: "제1공학관 1", x: 1400, y: 440 },
            { id: "대강당 2", x: 1100, y: 390, },
            { id: "무은재기념관 2", x: 1400, y: 390, },
            { id: "대강당 1", x: 1100, y: 340 },
            { id: "무은재기념관 1", x: 1400, y: 340 },
            { id: "제3공학관 2", x: 1100, y: 290 },
            { id: "제3공학관 1", x: 1150, y: 310 },
            { id: "제2공학관 1", x: 1350, y: 310 },
            { id: "제2공학관 2", x: 1400, y: 290 },
            { id: "제5공학관 2", x: 1150, y: 260 },
            { id: "제5공학관 1", x: 1200, y: 240 },
            { id: "학생회관 1", x: 1250, y: 260, },
            { id: "제4공학관 1", x: 1300, y: 240 },
            { id: "제4공학관 2", x: 1350, y: 260 },
            { id: "학생회관 2", x: 1250, y: 210 },
            { id: "학생회관 3", x: 1250, y: 160 },
            { id: "학생회관 4", x: 1250, y: 110 },
            { id: "국제관 1", x: 1300, y: 90 },
            { id: "국제관 2", x: 1350, y: 110, },
            { id: "국제관 3", x: 1400, y: 90 },
            { id: "대운동장 3", x: 1150, y: 60, },
            { id: "대운동장 2", x: 1200, y: 40, },
            { id: "대운동장 1", x: 1250, y: 60 },
        ],
        links: [
            { source: "수리과학관 1", target: "수리과학관 2" },
            { source: "수리과학관 1", target: "대강당 2" },
            { source: "수리과학관 2", target: "수리과학관 1" },
            { source: "제1공학관 2", target: "제1공학관 1" },
            { source: "제1공학관 1", target: "제1공학관 2" },
            { source: "제1공학관 1", target: "무은재기념관 2" },
            { source: "대강당 2", target: "수리과학관 1" },
            { source: "대강당 2", target: "대강당 1" },
            { source: "무은재기념관 2", target: "제1공학관 1" },
            { source: "무은재기념관 2", target: "무은재기념관 1" },
            { source: "대강당 1", target: "대강당 2" },
            { source: "대강당 1", target: "제3공학관 2" },
            { source: "무은재기념관 1", target: "무은재기념관 2" },
            { source: "무은재기념관 1", target: "제2공학관 2" },
            { source: "제3공학관 2", target: "제3공학관 1" },
            { source: "제3공학관 2", target: "대강당 1" },
            { source: "제3공학관 1", target: "제3공학관 2" },
            { source: "제3공학관 1", target: "제5공학관 2" },
            { source: "제2공학관 1", target: "제2공학관 2" },
            { source: "제2공학관 1", target: "제4공학관 2" },
            { source: "제2공학관 2", target: "제2공학관 1" },
            { source: "제2공학관 2", target: "무은재기념관 1" },
            { source: "제5공학관 2", target: "제5공학관 1" },
            { source: "제5공학관 2", target: "제3공학관 1" },
            { source: "제5공학관 1", target: "학생회관 1" },
            { source: "제5공학관 1", target: "제5공학관 2" },
            { source: "학생회관 1", target: "제4공학관 1" },
            { source: "학생회관 1", target: "제5공학관 1" },
            { source: "학생회관 1", target: "학생회관 2" },
            { source: "제4공학관 1", target: "제4공학관 2" },
            { source: "제4공학관 1", target: "학생회관 1" },
            { source: "제4공학관 2", target: "제4공학관 1" },
            { source: "제4공학관 2", target: "제2공학관 1" },
            { source: "학생회관 2", target: "학생회관 1" },
            { source: "학생회관 2", target: "학생회관 3" },
            { source: "학생회관 3", target: "학생회관 2" },
            { source: "학생회관 3", target: "학생회관 4" },
            { source: "학생회관 4", target: "국제관 1" },
            { source: "학생회관 4", target: "학생회관 3" },
            { source: "학생회관 4", target: "대운동장 1" },
            { source: "국제관 1", target: "국제관 2" },
            { source: "국제관 1", target: "학생회관 4" },
            { source: "국제관 2", target: "국제관 3" },
            { source: "국제관 2", target: "국제관 1" },
            { source: "국제관 3", target: "국제관 2" },
            { source: "대운동장 3", target: "대운동장 2" },
            { source: "대운동장 2", target: "대운동장 1" },
            { source: "대운동장 2", target: "대운동장 3" },
            { source: "대운동장 1", target: "대운동장 2" },
            { source: "대운동장 1", target: "학생회관 4" },
        ],
    };

    const data4 = {
        nodes: [
            { id: "RIST 4", x: 1700, y: 440 },
            { id: "RIST 3", x: 1750, y: 460, },
            { id: "RIST 5", x: 1800, y: 440, },
            { id: "노벨동산 4", x: 1550, y: 410, },
            { id: "노벨동산 2", x: 1650, y: 410 },
            { id: "RIST 2", x: 1750, y: 410 },
            { id: "노벨동산 3", x: 1550, y: 360, },
            { id: "노벨동산 1", x: 1650, y: 360 },
            { id: "RIST 1", x: 1750, y: 360 },
            { id: "대학본관 4", x: 1900, y: 340, },
            { id: "인공지능연구원 4", x: 1550, y: 310 },
            { id: "인공지능연구원 3", x: 1600, y: 290 },
            { id: "인공지능연구원 2", x: 1650, y: 310 },
            { id: "인공지능연구원 1", x: 1700, y: 290 },
            { id: "LG연구동 1", x: 1750, y: 310, },
            { id: "대학본관 1", x: 1800, y: 290 },
            { id: "대학본관 2", x: 1850, y: 310 },
            { id: "대학본관 3", x: 1900, y: 290, },
            { id: "LG연구동 2", x: 1750, y: 260 },
            { id: "LG연구동 4", x: 1700, y: 190 },
            { id: "LG연구동 3", x: 1750, y: 210 },
            { id: "LG연구동 5", x: 1800, y: 190 },
            { id: "환경공학동 1", x: 1750, y: 160 },
            { id: "환경공학동 3", x: 1700, y: 90 },
            { id: "환경공학동 2", x: 1750, y: 110, },
            { id: "환경공학동 4", x: 1800, y: 90, },
        ],
        links: [
            { source: "RIST 4", target: "RIST 3" },
            { source: "RIST 3", target: "RIST 5" },
            { source: "RIST 3", target: "RIST 4" },
            { source: "RIST 3", target: "RIST 2" },
            { source: "RIST 5", target: "RIST 3" },
            { source: "노벨동산 4", target: "노벨동산 3" },
            { source: "노벨동산 2", target: "노벨동산 1" },
            { source: "RIST 2", target: "RIST 3" },
            { source: "RIST 2", target: "RIST 1" },
            { source: "노벨동산 3", target: "노벨동산 4" },
            { source: "노벨동산 3", target: "인공지능연구원 4" },
            { source: "노벨동산 1", target: "노벨동산 2" },
            { source: "노벨동산 1", target: "인공지능연구원 2" },
            { source: "RIST 1", target: "RIST 2" },
            { source: "RIST 1", target: "LG연구동 1" },
            { source: "대학본관 4", target: "대학본관 3" },
            { source: "인공지능연구원 4", target: "인공지능연구원 3" },
            { source: "인공지능연구원 4", target: "노벨동산 3" },
            { source: "인공지능연구원 3", target: "인공지능연구원 2" },
            { source: "인공지능연구원 3", target: "인공지능연구원 4" },
            { source: "인공지능연구원 2", target: "인공지능연구원 1" },
            { source: "인공지능연구원 2", target: "인공지능연구원 3" },
            { source: "인공지능연구원 2", target: "노벨동산 1" },
            { source: "인공지능연구원 1", target: "LG연구동 1" },
            { source: "인공지능연구원 1", target: "인공지능연구원 2" },
            { source: "LG연구동 1", target: "대학본관 1" },
            { source: "LG연구동 1", target: "인공지능연구원 1" },
            { source: "LG연구동 1", target: "RIST 1" },
            { source: "LG연구동 1", target: "LG연구동 2" },
            { source: "대학본관 1", target: "대학본관 2" },
            { source: "대학본관 1", target: "LG연구동 1" },
            { source: "대학본관 2", target: "대학본관 3" },
            { source: "대학본관 2", target: "대학본관 1" },
            { source: "대학본관 3", target: "대학본관 2" },
            { source: "대학본관 3", target: "대학본관 4" },
            { source: "LG연구동 2", target: "LG연구동 1" },
            { source: "LG연구동 2", target: "LG연구동 3" },
            { source: "LG연구동 4", target: "LG연구동 3" },
            { source: "LG연구동 3", target: "LG연구동 5" },
            { source: "LG연구동 3", target: "LG연구동 4" },
            { source: "LG연구동 3", target: "LG연구동 2" },
            { source: "LG연구동 3", target: "환경공학동 1" },
            { source: "LG연구동 5", target: "LG연구동 3" },
            { source: "환경공학동 1", target: "LG연구동 3" },
            { source: "환경공학동 1", target: "환경공학동 2" },
            { source: "환경공학동 3", target: "환경공학동 2" },
            { source: "환경공학동 2", target: "환경공학동 4" },
            { source: "환경공학동 2", target: "환경공학동 3" },
            { source: "환경공학동 2", target: "환경공학동 1" },
            { source: "환경공학동 4", target: "환경공학동 2" },
        ],
    };

    const data5 = {
        nodes: [
            { id: "포스플렉스 1", x: 2250, y: 460 },
            { id: "포스플렉스 2", x: 2300, y: 440, },
            { id: "포스플렉스 3", x: 2350, y: 460, },
            { id: "테니스장 3", x: 2100, y: 390, },
            { id: "체육관 3", x: 2250, y: 410 },
            { id: "테니스장 1", x: 2050, y: 360 },
            { id: "테니스장 2", x: 2100, y: 340, },
            { id: "체육관 2", x: 2250, y: 360 },
            { id: "화학관 2", x: 2350, y: 360 },
            { id: "풋살구장 3", x: 2050, y: 310 },
            { id: "체육관 1", x: 2250, y: 310 },
            { id: "화학관 1", x: 2350, y: 310, },
            { id: "풋살구장 2", x: 2050, y: 260 },
            { id: "풋살구장 1", x: 2100, y: 240, },
            { id: "통나무집 2", x: 2150, y: 260 },
            { id: "통나무집 1", x: 2200, y: 240 },
            { id: "나노융합기술원 1", x: 2250, y: 260, },
            { id: "생명과학관 1", x: 2300, y: 240 },
            { id: "생명과학관 2", x: 2350, y: 260 },
            { id: "기계실험동 1", x: 2400, y: 240 },
            { id: "기계실험동 2", x: 2450, y: 260, },
            { id: "통나무집 3", x: 2150, y: 210 },
            { id: "나노융합기술원 2", x: 2250, y: 210 },
            { id: "나노융합기술원 3", x: 2250, y: 160 },
            { id: "나노융합기술원 4", x: 2250, y: 110, },
            { id: "포항가속기연구소", x: 2250, y: 60 },
        ],
        links: [
            { source: "포스플렉스 1", target: "포스플렉스 2" },
            { source: "포스플렉스 1", target: "체육관 3" },
            { source: "포스플렉스 2", target: "포스플렉스 3" },
            { source: "포스플렉스 2", target: "포스플렉스 1" },
            { source: "포스플렉스 3", target: "포스플렉스 2" },
            { source: "테니스장 3", target: "테니스장 2" },
            { source: "체육관 3", target: "포스플렉스 1" },
            { source: "체육관 3", target: "체육관 2" },
            { source: "테니스장 1", target: "테니스장 2" },
            { source: "테니스장 1", target: "풋살구장 3" },
            { source: "테니스장 2", target: "테니스장 1" },
            { source: "테니스장 2", target: "테니스장 3" },
            { source: "체육관 2", target: "체육관 3" },
            { source: "체육관 2", target: "체육관 1" },
            { source: "화학관 2", target: "화학관 1" },
            { source: "풋살구장 3", target: "테니스장 1" },
            { source: "풋살구장 3", target: "풋살구장 2" },
            { source: "체육관 1", target: "체육관 2" },
            { source: "체육관 1", target: "나노융합기술원 1" },
            { source: "화학관 1", target: "화학관 2" },
            { source: "화학관 1", target: "생명과학관 2" },
            { source: "풋살구장 2", target: "풋살구장 1" },
            { source: "풋살구장 2", target: "풋살구장 3" },
            { source: "풋살구장 1", target: "통나무집 2" },
            { source: "풋살구장 1", target: "풋살구장 2" },
            { source: "통나무집 2", target: "통나무집 1" },
            { source: "통나무집 2", target: "풋살구장 1" },
            { source: "통나무집 2", target: "통나무집 3" },
            { source: "통나무집 1", target: "나노융합기술원 1" },
            { source: "통나무집 1", target: "통나무집 2" },
            { source: "나노융합기술원 1", target: "생명과학관 1" },
            { source: "나노융합기술원 1", target: "통나무집 1" },
            { source: "나노융합기술원 1", target: "체육관 1" },
            { source: "나노융합기술원 1", target: "나노융합기술원 2" },
            { source: "생명과학관 1", target: "생명과학관 2" },
            { source: "생명과학관 1", target: "나노융합기술원 1" },
            { source: "생명과학관 2", target: "기계실험동 1" },
            { source: "생명과학관 2", target: "생명과학관 1" },
            { source: "생명과학관 2", target: "화학관 1" },
            { source: "기계실험동 1", target: "기계실험동 2" },
            { source: "기계실험동 1", target: "생명과학관 2" },
            { source: "기계실험동 2", target: "기계실험동 1" },
            { source: "통나무집 3", target: "통나무집 2" },
            { source: "나노융합기술원 2", target: "나노융합기술원 1" },
            { source: "나노융합기술원 2", target: "나노융합기술원 3" },
            { source: "나노융합기술원 3", target: "나노융합기술원 2" },
            { source: "나노융합기술원 3", target: "나노융합기술원 4" },
            { source: "나노융합기술원 4", target: "나노융합기술원 3" },
            { source: "나노융합기술원 4", target: "포항가속기연구소" },
            { source: "포항가속기연구소", target: "나노융합기술원 4" },
        ],
    };

    let [height, setHeight] = React.useState<number | undefined>(undefined)
    let [width, setWidth] = React.useState<number | undefined>(undefined)
    let [scale1, setScale1] = React.useState<number | undefined>(undefined)
    let [scale2, setScale2] = React.useState<number | undefined>(undefined)
    let [scale3, setScale3] = React.useState<number | undefined>(undefined)
    let [scale4, setScale4] = React.useState<number | undefined>(undefined)
    let [scale5, setScale5] = React.useState<number | undefined>(undefined)
    let [siegeCell, setSiegeCell] = React.useState<Cell[] | undefined>(undefined)
    let [teleportableTo, setTeleportableTo] = React.useState<Cell[] | undefined>(undefined)
    let [visitableCell, setVisitableCell] = React.useState<Cell[] | undefined>(undefined)

    React.useEffect(function () {
        setHeight(window.innerHeight)
        setWidth(window.innerWidth)
        setScale1(0.00225 * window.innerWidth)
        setScale2(0.002583 * window.innerWidth)
        setScale3(0.002639 * window.innerWidth)
        setScale4(0.002556 * window.innerWidth)
        setScale5(0.002056 * window.innerWidth)
    }, [])


    const myConfig = {
        height: height !== undefined ? height : 1000,
        width: width !== undefined ? width : 1000,
        node: {
            color: "lightgray",
            size: 120,
            fontSize: 8,
            labelPosition: "bottom" as const,
            fontColor: "white",
        },
        staticGraph: true,
        freezeAllDragEvents: true,
    };

    let [cell, setCell] = React.useState<Cell | undefined>(undefined)
    let [lv, setLv] = React.useState<number | undefined>(undefined)

    React.useEffect(function () {
        fetch("/api/player/location/current", {method: 'POST'}).then(async (response) => {
            const data = await response.json()
            setCell(data.cell)
            setLv(data.cell.region.level)
        })
    }, [])

    React.useEffect(function () {
        fetch("/api/map/get-teleportable-cells", {method: 'POST'}).then(async (response) => {
            const data = await response.json()
            setTeleportableTo(data.cells)
        })
    }, [])

    React.useEffect(function () {
        fetch("/api/map/get-visitable-cells", {method: 'POST'}).then(async (response) => {
            const data = await response.json()
            setVisitableCell(data.cells)
        })
    }, [])

    React.useEffect(function () {
        fetch("/api/map/get-siege-cells", {method: 'POST'}).then(async (response) => {
            const data = await response.json()
            setSiegeCell(data.cells)
        })
    }, [])

    React.useEffect(function () {
        if (lv === 1) {
            let element = document.getElementById('graph-id-graph-container-zoomable')
            element?.setAttribute('transform', `translate(${(-0.0656) * (width !== undefined ? width : 1000)}, ${(0.1679) * (height !== undefined ? height : 1000)}) scale(${scale1})`)            
        }
        else if (lv === 2) {
            let element = document.getElementById('graph-id-graph-container-zoomable')
            element?.setAttribute('transform', `translate(${(-0.1434) * (width !== undefined ? width : 1000)}, ${(0.0965) * (height !== undefined ? height : 1000)}) scale(${scale2})`)            
        }
        else if (lv === 3) {
            let element = document.getElementById('graph-id-graph-container-zoomable')
            element?.setAttribute('transform', `translate(${(-0.1722) * (width !== undefined ? width : 1000)}, ${(0.1775) * (height !== undefined ? height : 1000)}) scale(${scale3})`)            
        }
        else if (lv === 4) {
            let element = document.getElementById('graph-id-graph-container-zoomable')
            element?.setAttribute('transform', `translate(${(-0.0678) * (width !== undefined ? width : 1000)}, ${(0.1224) * (height !== undefined ? height : 1000)}) scale(${scale4})`)            
        }
        else {
            let element = document.getElementById('graph-id-graph-container-zoomable')
            element?.setAttribute('transform', `translate(${(0.0028) * (width !== undefined ? width : 1000)}, ${(0.1975) * (height !== undefined ? height : 1000)}) scale(${scale5})`)            
        }
    }, [lv])

    function region_print() {
        if (lv === 1) {
            return (
                <img
                    src={`/static/지도/맵1.png`}
                    style={{
                        width: '110%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '18%',
                        left: '-5%',
                    }}
                />
            )
        }
        else if (lv === 2) {
            return (
                <img
                    src={`/static/지도/맵2.png`}
                    style={{
                        width: '106%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '18%',
                        left: '-3%',
                    }}
                />
            )
        }
        else if (lv === 3) {
            return (
                <img
                    src={`/static/지도/맵3.png`}
                    style={{
                        width: '126%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '18%',
                        left: '-13%',
                    }}
                />
            )
        }
        else if (lv === 4) {
            return (
                <img
                    src={`/static/지도/맵4.png`}
                    style={{
                        width: '110%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '18%',
                        left: '-5%',
                    }}
                />
            )
        }
        else {
            return (
                <img
                    src={`/static/지도/맵5.png`}
                    style={{
                        width: '140%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '25%',
                        left: '-20%',
                    }}
                />
            )
        }
    }

    for (let i = 0; i < data1.nodes.length; i++) {
        if (cell !== undefined) {
            if (visitableCell !== undefined) {
                for (let k = 0; k < visitableCell.length; k++) {
                    if (visitableCell[k].name === data1.nodes[i].id) {
                        data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'lightgreen' })
                        for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
                            if (data1.nodes[i].id === teleportableTo[j].name) {
                                data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'lightblue' })
                            }
                        }
                        for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
                            if (data1.nodes[i].id === siegeCell[j].name) {
                                data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'blue' })
                            }
                        }
                        if (data1.nodes[i].id === cell.name) {
                            data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'red' })
                        }
                    }
                }
            }
        }
    }
    for (let i = 0; i < data2.nodes.length; i++) {
        if (cell !== undefined) {
            if (visitableCell !== undefined) {
                for (let k = 0; k < visitableCell.length; k++) {
                    if (visitableCell[k].name === data2.nodes[i].id) {
                        data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'lightgreen' })
                        for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
                            if (data2.nodes[i].id === teleportableTo[j].name) {
                                data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'lightblue' })
                            }
                        }
                        for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
                            if (data2.nodes[i].id === siegeCell[j].name) {
                                data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'blue' })
                            }
                        }
                        if (data2.nodes[i].id === cell.name) {
                            data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'red' })
                        }
                    }
                }
            }
        }
        data2.nodes[i] = Object.assign(data2.nodes[i], { x: data2.nodes[i].x - 500 })
    }
    for (let i = 0; i < data3.nodes.length; i++) {
        if (cell !== undefined) {
            if (visitableCell !== undefined) {
                for (let k = 0; k < visitableCell.length; k++) {
                    if (visitableCell[k].name === data3.nodes[i].id) {
                        data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'lightgreen' })
                        for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
                            if (data3.nodes[i].id === teleportableTo[j].name) {
                                data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'lightblue' })
                            }
                        }
                        for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
                            if (data3.nodes[i].id === siegeCell[j].name) {
                                data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'blue' })
                            }
                        }
                        if (data3.nodes[i].id === cell.name) {
                            data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'red' })
                        }
                    }
                }
            }
        }
        data3.nodes[i] = Object.assign(data3.nodes[i], { x: data3.nodes[i].x - 1000 })
    }
    for (let i = 0; i < data4.nodes.length; i++) {
        if (cell !== undefined) {
            if (visitableCell !== undefined) {
                for (let k = 0; k < visitableCell.length; k++) {
                    if (visitableCell[k].name === data4.nodes[i].id) {
                        data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'lightgreen' })
                        for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
                            if (data4.nodes[i].id === teleportableTo[j].name) {
                                data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'lightblue' })
                            }
                        }
                        for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
                            if (data4.nodes[i].id === siegeCell[j].name) {
                                data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'blue' })
                            }
                        }
                        if (data4.nodes[i].id === cell.name) {
                            data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'red' })
                        }
                    }
                }
            }
        }
        data4.nodes[i] = Object.assign(data4.nodes[i], { x: data4.nodes[i].x - 1500 })
    }
    for (let i = 0; i < data5.nodes.length; i++) {
        if (cell !== undefined) {
            if (visitableCell !== undefined) {
                for (let k = 0; k < visitableCell.length; k++) {
                    if (visitableCell[k].name === data5.nodes[i].id) {
                        data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'lightgreen' })
                        for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
                            if (data5.nodes[i].id === teleportableTo[j].name) {
                                data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'lightblue' })
                            }
                        }
                        for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
                            if (data5.nodes[i].id === siegeCell[j].name) {
                                data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'blue' })
                            }
                        }
                        if (data5.nodes[i].id === cell.name) {
                            data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'red' })
                        }
                    }
                }
            }
        }
        data5.nodes[i] = Object.assign(data5.nodes[i], { x: data5.nodes[i].x - 2000 })
    }

    function map_print() {
        if (lv === 1) {
            return (
                <Graph
                    id="graph-id" // id is mandatory
                    data={data1}
                    config={myConfig}
                />
            )
        }
        else if (lv === 2) {
            return (
                <Graph
                    id="graph-id" // id is mandatory
                    data={data2}
                    config={myConfig}
                />
            )
        }
        else if (lv === 3) {
            return (
                <Graph
                    id="graph-id" // id is mandatory
                    data={data3}
                    config={myConfig}
                />
            )
        }
        else if (lv === 4) {
            return (
                <Graph
                    id="graph-id" // id is mandatory
                    data={data4}
                    config={myConfig}
                />
            )
        }
        else {
            return (
                <Graph
                    id="graph-id" // id is mandatory
                    data={data5}
                    config={myConfig}
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
                    {map_print()}
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