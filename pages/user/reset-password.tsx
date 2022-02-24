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
import { isValidNanoid } from './forgot-password';

const theme = createTheme();

export default function ResetPassword() {

  let [password, setPassword] = React.useState<string>('')
  let [repassword, setRepassword] = React.useState<string>('')

  const [passwordMessage, setPasswordMessage] = React.useState<string>('')
  const [repasswordMessage, setRepasswordMessage] = React.useState<string>('')

  const [isPassword, setIsPassword] = React.useState<boolean>(false)
  const [isRepassword, setIsRepassword] = React.useState<boolean>(false)

  const passwordChange: OnChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (value.length < 6) {
      setPasswordMessage('6자 이상의 비밀번호를 입력해주세요.')
      setIsPassword(false)
    } else {
      setPasswordMessage('')
      setIsPassword(true)
    }
    setPassword(value);
  };
  const repasswordChange: OnChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (password !== value) {
      setRepasswordMessage('비밀번호가 일치하지 않습니다.')
      setIsRepassword(false)
    } else {
      setRepasswordMessage('')
      setIsRepassword(true)
    }
    setRepassword(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams(location.search);
    const resetPasswordToken= params.get('resetPasswordToken');
    if (resetPasswordToken === null ||
        !isValidNanoid(resetPasswordToken)) {
      alert('비정상적인 접속입니다.')
      location.href='/'
    }
    fetch("/api/user/reset-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resetPasswordToken: resetPasswordToken, 
        password: data.get('password')
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
          
        alert("비밀번호가 재설정되었습니다.")
        location.href="/user/sign-in"
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
            비밀번호 재설정
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <InputCheckValid input='password' label='비밀번호' isPassword={true} onChange={passwordChange} value={password} isValid={isPassword} message={passwordMessage} ></InputCheckValid>
              <InputCheckValid input='repassword' label='비밀번호 재입력' isPassword={true} onChange={repasswordChange} value={repassword} isValid={isRepassword} message={repasswordMessage} ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={isPassword && isRepassword} label='비밀번호 재설정'></SubmitCheckValid>
            <Grid container justifyContent="flex-end">
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
