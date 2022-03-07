import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { OnChangeFunc } from 'src/components/type-misc'
import InputCheckValid from 'src/components/InputCheckValid'
import SubmitCheckValid from 'src/components/SubmitCheckValid'

const theme = createTheme();

export function isValidNanoid(str: string) {
  if (str.length !== 10) {
    return false
  }

  let pattern_nanoid = /[^A-Za-z0-9]/g;
  if (str.search(pattern_nanoid) !== -1) {
    return false
  }
  return true
}

export default function ForgotPassword() {

  let [pin, setPin] = React.useState<string>('')
  const [pinMessage, setPinMessage] = React.useState<string>('')
  const [isPin, setIsPin] = React.useState<boolean>(false)

  const pinChange: OnChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (!isValidNanoid(value)) {
      setPinMessage('핀번호 형식이 올바르지 않습니다!')
      setIsPin(false)
    } else {
      setPinMessage('')
      setIsPin(true)
    }
    setPin(value);
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/user/forgot-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pin: data.get('pin')
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)

        alert(`${data['email']}로 메일이 전송되었습니다! 메일에 있는 링크를 눌러서 비밀번호를 재설정해주세요.`)
        location.href="/"
      })
      .catch(err => {
        console.log(err.message)
        alert("올바르지 않은 정보가 입력되었습니다.")
      })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            비밀번호 재설정 요청
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <InputCheckValid input='pin' label='핀번호' isPassword={false} onChange={pinChange} value={pin} isValid={isPin} message={pinMessage} ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={isPin} label='비밀번호 재설정 요청'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
