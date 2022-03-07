import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextAnimation from "react-animate-text";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import { Log } from 'src/interfaces/Log'
import { Cell } from 'src/entity/Cell'
import Box from '@mui/material/Box';
import 'animate.css';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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

export default function Supply() {

  let [cell, setCell] = React.useState<Cell | undefined>(undefined)
  let [nextLog, setNextLog] = React.useState(false)
  const [itemopen, setItemopen] = React.useState(false);
  let [moneyReceived, setMoneyReceived] = React.useState<number | undefined>(undefined)

  function click_animate_heartBeat() {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = 'animate__heartBeat';
      const node = typeof document ? document.querySelector('.callout') : undefined;
      node !== undefined && node !== null ? node.classList.add('animate__animated', animationName) : undefined;

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node !== null && node !== undefined ? node.classList.remove('animate__animated', animationName) : undefined;
        resolve('Animation ended');
      }

      node !== null && node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  function click_animate_flip() {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = 'animate__flip';
      const node = typeof document ? document.querySelector('.callout') : undefined;
      node !== undefined && node !== null ? node.classList.add('animate__animated', animationName) : undefined;

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node !== null && node !== undefined ? node.classList.remove('animate__animated', animationName) : undefined;
        resolve('Animation ended');
      }

      node !== null && node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  const startAnimation = () => {
    const title = typeof document ? document.querySelector('.callout') : undefined

    const titleAnimation = 'zoomInDown'

    title !== null && title !== undefined ? title.classList.add('animate__animated', `animate__${titleAnimation}`) : null

    function handleAnimationEnd(event: any) {
      event.stopPropagation();
      title !== null && title !== undefined ? title.classList.remove('animate__animated', `animate__${titleAnimation}`) : undefined;
    }

    title?.addEventListener('animationend', handleAnimationEnd, { once: true })
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

  React.useEffect(startAnimation, [])

  let [player, setPlayer] = React.useState<string | undefined>(undefined)

  const scrollBottom = () => {
    let div = document.getElementById("id");
    div ? div.scrollTop = div.scrollHeight : null;
  };

  let logmessage = []
  let eventmessage = []
  let [log, setLog] = React.useState<Log[][] | undefined>(undefined)

  React.useEffect(function () {
    if (typeof window !== 'undefined') {
      let name = window.sessionStorage.getItem('name')
      if (name !== null)
        setPlayer(name)
      let rawdata = window.sessionStorage.getItem('data')
      if (rawdata !== null) {
        let data = JSON.parse(rawdata)
        setLog(data.data.eventLog)
        setMoneyReceived(data.data.moneyReceived)
      }
    }
  }, [])

  React.useEffect(function () {
    fetch("/api/player/location/current", {method: 'POST'}).then(async (response) => {
      const data = await response.json()
      setCell(data.cell)
    })
  }, [])

  if (log !== undefined) {
    logmessage.push(
      <Typography
        key='sunbemessage'
        sx={{
          my: 1,
        }}
      >
        {log[0][0].name} 선배님의 메시지 입니다!
      </Typography>
    )

    logmessage.push(
      <Typography
        key='message'
        sx={{
          my: 1,
        }}
      >
        {log[0][0].EffectMessage}
      </Typography>
    )
  }

  for (let i = 0; log !== undefined && i < log[1].length; i++) {
    eventmessage.push(
      <Typography
        key={'message' + i}
        sx={{
          my: 1,
        }}
      >
        {log[1][i].EffectMessage}
      </Typography>
    )
  }

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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container
            sx={{
              height: 1,
              width: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              p: 0,
            }}
          >
            <img
              className="callout"
              src={log !== undefined ? '/static/NPC/' + log[0][0].name + '.png' : ""}
              onClick={click_animate_heartBeat}
              style={{
                width: "200%",
                height: "auto",
                objectFit: "cover",
                position: 'absolute',
                top: '0%',
                left: '-50%',
              }}
            />
            <Container
              id="id"
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
                <Box
                  id='introduce'
                >
                  {logmessage}
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                    sx={{
                      position: 'relative',
                      bottom: 0,
                    }}
                  >
                    <Button
                      onClick={function () {
                        const div = document.getElementById('introduce');
                        const event = document.getElementById('event');

                        div?.remove();
                        event !== null ? event.style.display = 'block' : "";
                      }}
                      sx={{
                        color: '#000000',
                      }}
                    >
                      다음
                    </Button>
                  </Stack>
                </Box>
                <Box
                  id='event'
                  display='none'
                  sx={{
                    width: 1,
                    position: 'relative',
                  }}
                >
                  {eventmessage}
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                    spacing={2}
                    sx={{
                      position: 'relative',
                      bottom: 0,
                    }}
                  >
                    {
                      moneyReceived !== undefined && moneyReceived > 0 ?
                        <Button
                          onClick={function () {
                            sessionStorage.clear();
                            setItemopen(true)
                          }}
                          sx={{
                            color: '#000000',
                          }}
                        >
                          다음
                        </Button> :
                        <Button
                          onClick={function () {
                            sessionStorage.clear();
                          }}
                          sx={{
                            color: '#000000',
                          }}
                          href='/adventure'
                        >
                          다음
                        </Button>
                    }
                  </Stack>
                </Box>
              </TextAnimation>
              <Dialog
                key='item-drop'
                open={itemopen}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
              >
                <DialogTitle id="scroll-dialog-title">보급</DialogTitle>
                <DialogContent>
                  <DialogContentText
                    id="scroll-dialog-description"
                  >
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='flex-start'
                      spacing={0}
                    >
                      <img
                        src='/static/UI 아이콘/코인.png'
                        style={{
                          width: '1rem',
                          objectFit: "cover",
                        }}
                      />
                      <Typography
                        align="center"
                      >
                        {moneyReceived}골드 획득!
                      </Typography>
                    </Stack>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={function () {
                      setItemopen(false)
                    }}
                    sx={{
                      width: 0.5,
                      bgcolor: '#CCCCCC',
                      color: '#000000',
                    }}
                    href="adventure"
                  >확인</Button>
                </DialogActions>
              </Dialog>
            </Container>
          </Container>
        </Container>
      </React.Fragment>
    </ThemeProvider >
  );
}