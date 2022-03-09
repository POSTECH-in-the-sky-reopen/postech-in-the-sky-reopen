import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { isValidNanoid } from './forgot-password';

const theme = createTheme();

export default function ConfirmEmail() {
  
  React.useEffect(function () {
    const params = new URLSearchParams(location.search);
    const confirmEmailToken= params.get('confirmEmailToken');
    if (confirmEmailToken === null ||
        !isValidNanoid(confirmEmailToken)) {
      alert('비정상적인 접속입니다.')
      location.href='/'
    }
    fetch("/api/user/confirm-email", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        confirmEmailToken: confirmEmailToken, 
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
          
        alert("이메일 인증이 완료되었습니다.")
        location.href="/user/sign-in"
      })
      .catch(err => {
        console.log(err.message)
        alert("올바르지 않은 링크입니다.")
      })
  }, [])

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
            이메일 인증
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
