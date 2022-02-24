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

export default function Generate() {

  let [name, setName] = React.useState<string>('');
  let [studentId, setStudentId] = React.useState<string>('');

  const [nameMessage, setNameMessage] = React.useState<string>('')
  const [studentIdMessage, setStudentIdMessage] = React.useState<string>('')

  const [isName, setIsName] = React.useState<boolean>(false)
  const [isStudentId, setIsStudentId] = React.useState<boolean>(false)

  let pattern_special = /[~!@#$%<>^&*()\-=+_\\\/,.:;|'"]/gi

  const nameChange: OnChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (pattern_special.test(value)) {
      setNameMessage('이름에 특수문자가 포함될 수는 없습니다! \ㅅ/')
      setIsName(false)
    } else if (value.length > 20) {
      setNameMessage('이름은 20자 이내로 입력해주세요.')
      setIsName(false)
    } else {
      setNameMessage('')
      setIsName(true)
    }
    setName(value);
  };
  const studentIdChange: OnChangeFunc = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (isNaN(Number(value)) || Number(value) < 20220000 || Number(value) >= 20230000) {
      setStudentIdMessage('학번 형식이 올바르지 않습니다!')
      setIsStudentId(false)
    } else {
      setStudentIdMessage('')
      setIsStudentId(true)
    }
    setStudentId(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/admin/user/generate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        name: data.get('name'), 
        studentId: data.get('studentId')
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
          
        alert(`생성이 완료되었습니다! pin: ${data.pin} `)
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
            가상 사용자 생성
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid>
              <InputCheckValid input='name' label='이름' isPassword={false} onChange={nameChange} value={name} isValid={isName} message={nameMessage} ></InputCheckValid>
              <InputCheckValid input='studentId' label='학번' isPassword={false} onChange={studentIdChange} value={studentId} isValid={isStudentId} message={studentIdMessage} ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={isName && isStudentId} label='가상 사용자 생성'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
