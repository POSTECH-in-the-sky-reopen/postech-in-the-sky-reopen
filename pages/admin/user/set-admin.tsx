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
import { inputField } from 'pages/user/sign-up';

const theme = createTheme();

export default function Generate() {

  let [studentId, setStudentId] = React.useState<inputField>({value: "", message: "", isValid: false});

  let patternStudentId = /^[0-9]{8}$/gi;
  const studentIdChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternStudentId)) {
      setStudentId({ value: value, message: "학번 형식이 올바르지 않습니다.", isValid: false});
    } else {
      setStudentId({ value: value, message: "", isValid: true});
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/admin/user/set-admin", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        studentId: data.get('studentId')
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
          
        alert("생성이 완료되었습니다!")
        location.href="/admin/user/set-admin"
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
            관리자 권한 부여
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid>
              <InputCheckValid input='studentId' label='학번' isPassword={false} onChange={studentIdChange} value={studentId.value} isValid={studentId.isValid} message={studentId.message} ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={studentId.isValid} label='요청'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
