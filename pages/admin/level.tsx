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

export default function Level() {
  let [id, setId] = React.useState<number|undefined>(undefined);
  React.useEffect(function () {
    fetch("/api/admin/player/id", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
        setId(data.id)
      })
      .catch(err => {
        console.log(err.message)
        alert("플레이어 정보를 가져오는 중 실패했습니다.")
      })
  }, [])

  let [level, setLevel] = React.useState<inputField>({value: "", message: "", isValid: false});

  const levelChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!(parseInt(value) > 0)) {
      setLevel({ value: value, message: "레벨 형식이 올바르지 않습니다.", isValid: false});
    } else {
      setLevel({ value: value, message: "", isValid: true});
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/admin/player/set-level", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: id,
        level: data.get('level')
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
          
        alert("레벨 변경 완료")
        location.href = "/admin"
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
            레벨 변경
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid>
              <InputCheckValid input='level' label='레벨' isPassword={false} onChange={levelChange} value={level.value} isValid={level.isValid} message={level.message} ></InputCheckValid>
            </Grid>
            <SubmitCheckValid enabled={level.isValid} label='요청'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
