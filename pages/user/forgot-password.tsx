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
import { inputField } from './sign-up';

const theme = createTheme();

export function isValidNanoid(str: string) {
  if (str.length !== 30) {
    return false
  }

  let pattern_nanoid = /[^A-Za-z0-9]/g;
  if (str.search(pattern_nanoid) !== -1) {
    return false
  }
  return true
}

export default function ForgotPassword() {

  let [name, setName] = React.useState<inputField>({value: "", message: "", isValid: false});
  let [studentId, setStudentId] = React.useState<inputField>({value: "", message: "", isValid: false});
  let [povisId, setPovisId] = React.useState<inputField>({value: "", message: "", isValid: false});

  let patternName = /^[ㄱ-ㅎ가-힣a-z ]*$/gi;
  const nameChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternName)) {
      setName({ value: value, message: "이름 형식이 올바르지 않습니다.", isValid: false});
    } else {
      setName({ value: value, message: "", isValid: true});
    }
  };

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

  let patternPovisId = /^[a-z0-9-_\.]*$/gi;
  const povisIdChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternPovisId)) {
      setPovisId({ value: value, message: "POVIS 아이디 형식이 올바르지 않습니다.", isValid: false});
    } else {
      setPovisId({ value: value, message: "", isValid: true});
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/user/forgot-password", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.get("name"),
        studentId: data.get("studentId"),
        povisId: data.get("povisId"),
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
                <InputCheckValid
                  input="name"
                  label="이름"
                  isPassword={false}
                  onChange={nameChange}
                  value={name.value}
                  isValid={name.isValid}
                  message={name.message}
                ></InputCheckValid>
                <InputCheckValid
                  input="studentId"
                  label="학번"
                  isPassword={false}
                  onChange={studentIdChange}
                  value={studentId.value}
                  isValid={studentId.isValid}
                  message={studentId.message}
                ></InputCheckValid>
                <InputCheckValid
                  input="povisId"
                  label="POVIS 아이디"
                  isPassword={false}
                  onChange={povisIdChange}
                  value={povisId.value}
                  isValid={povisId.isValid}
                  message={povisId.message}
                ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={name.isValid && studentId.isValid && povisId.isValid} label='비밀번호 재설정 요청'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
