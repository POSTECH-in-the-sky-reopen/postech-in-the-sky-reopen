import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { OnChangeFunc } from "src/components/type-misc";
import InputCheckValid from "src/components/InputCheckValid";
import SubmitCheckValid from "src/components/SubmitCheckValid";
import LinkPage from "src/components/LinkPage";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";

const theme = createTheme({
  typography: {
    fontFamily: "MaplestoryLight",
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
});

export interface inputField {
  value: string;
  message: string;
  isValid: boolean;
}

export default function SignUp() {
  let [name, setName] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });
  let [studentId, setStudentId] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });
  let [povisId, setPovisId] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });
  let [group, setGroup] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });
  let [password, setPassword] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });
  let [repassword, setRepassword] = React.useState<inputField>({
    value: "",
    message: "",
    isValid: false,
  });

  const [isCheck, setIsCheck] = React.useState<boolean>(false);

  const [open, setOpen] = React.useState(false);

  const [waiting, setWaiting] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let patternName = /^[ㄱ-ㅎ가-힣a-z ]*$/gi;
  const nameChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternName)) {
      setName({
        value: value,
        message: "이름 형식이 올바르지 않습니다.",
        isValid: false,
      });
    } else {
      setName({ value: value, message: "", isValid: true });
    }
  };

  let patternStudentId = /^[0-9]{8}$/gi;
  const studentIdChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternStudentId)) {
      setStudentId({
        value: value,
        message: "학번 형식이 올바르지 않습니다.",
        isValid: false,
      });
    } else {
      setStudentId({ value: value, message: "", isValid: true });
    }
  };

  let patternPovisId = /^[a-z0-9-_\.]*$/gi;
  const povisIdChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(patternPovisId)) {
      setPovisId({
        value: value,
        message: "POVIS 아이디 형식이 올바르지 않습니다.",
        isValid: false,
      });
    } else {
      setPovisId({ value: value, message: "", isValid: true });
    }
  };

  const groupChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!(parseInt(value) >= 0 && parseInt(value) <= 15)) {
      setGroup({
        value: value,
        message: "분반 형식이 올바르지 않습니다.",
        isValid: false,
      });
    } else {
      setGroup({ value: value, message: "", isValid: true });
    }
  };

  const passwordChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (value !== "" && value.length < 6) {
      setPassword({
        value: value,
        message: "6자 이상의 비밀번호를 입력해주세요.",
        isValid: false,
      });
    } else {
      setPassword({ value: value, message: "", isValid: true });
    }
  };
  const repasswordChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (password.value !== value) {
      setRepassword({
        value: value,
        message: "비밀번호가 일치하지 않습니다.",
        isValid: false,
      });
    } else {
      setRepassword({ value: value, message: "", isValid: true });
    }
  };
  const checkboxChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheck(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setWaiting(true);
    fetch("/api/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.get("name"),
        studentId: data.get("studentId"),
        povisId: data.get("povisId"),
        group: data.get("group"),
        password: data.get("password"),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status >= 400) throw new Error(data.message);

        setWaiting(false);
        alert(
          `${data.email}로 인증 메일이 발송되었습니다. 메일에 있는 링크를 눌러서 가입을 완료해주세요.`
        );
        location.href = "/user/sign-in";
      })
      .catch((err) => {
        setWaiting(false);
        console.log(err.message);
        alert("올바르지 않은 정보가 입력되었습니다.");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <img
        src="https://cdn.discordapp.com/attachments/927221603778035755/935162801230590013/4c44b30f0b9a1897.png"
        style={{
          width: "100vw",
          height: "135vh",
          objectFit: "cover",
          position: "absolute",
          top: "0",
        }}
      />
      <div className="all">
        <div
          className="log-in-box"
          style={{ position: "absolute", height: "90vh", top: "5vh" }}
        ></div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <div></div>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                position: "relative",
              }}
            >
              회원가입
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
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
                <InputCheckValid
                  input="group"
                  label="분반"
                  isPassword={false}
                  onChange={groupChange}
                  value={group.value}
                  isValid={group.isValid}
                  message={group.message}
                ></InputCheckValid>
                <InputCheckValid
                  input="password"
                  label="비밀번호"
                  isPassword={true}
                  onChange={passwordChange}
                  value={password.value}
                  isValid={password.isValid}
                  message={password.message}
                ></InputCheckValid>
                <InputCheckValid
                  input="repassword"
                  label="비밀번호 재입력"
                  isPassword={true}
                  onChange={repasswordChange}
                  value={repassword.value}
                  isValid={repassword.isValid}
                  message={repassword.message}
                ></InputCheckValid>
                <Grid item xs={12}>
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{
                      position: "relaitve",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        width: 1,
                        position: "relaitve",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          position: "relative",
                        }}
                      >
                        개인정보 수집 및 이용 동의서 확인
                      </Typography>
                      <Button
                        onClick={handleClickOpen}
                        sx={{
                          position: "relative",
                        }}
                      >
                        내용 보기
                      </Button>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        width: 1,
                        position: "relaitve",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          position: "relative",
                        }}
                      >
                        개인정보 수집 및 이용에 동의합니다.
                      </Typography>
                      <Checkbox
                        checked={isCheck}
                        onChange={checkboxChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Stack>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "red",
                        position: "relative",
                      }}
                    >
                      * 동의하지 않을 경우, 회원가입이 제한됩니다.
                    </Typography>
                  </Stack>

                  <Dialog onClose={handleClose} open={open} fullWidth={true}>
                    <DialogTitle id="scroll-dialog-title">
                      개인정보 수집 및 활용 내용
                    </DialogTitle>
                    <DialogContent>
                      <Typography>개인정보 수집·이용 동의서</Typography>
                      <Typography>
                        {" "}
                        천공의 섬 포스텍에서는 포스텍 구성원 인증을 통한 게임
                        서비스 제공을 위하여 이름, 학번, POVIS 아이디, 분반
                        정보를 수집합니다. 해당 정보는 서비스 운영이 종료되는
                        즉시 파기될 예정이며, 위에 서술된 내용 외의 목적으로
                        사용되지 않습니다. 위와 같이 개인정보를 수집·이용하는데
                        동의를 거부할 권리가 있으나, 동의를 거부할 경우 서비스
                        이용이 제한됩니다.
                      </Typography>
                      <Typography>
                        천공의 섬 포스텍에서는 매크로 등을 악용한 플레이를
                        방지하고 컨텐츠 제공을 위해 플레이 데이터를 수집합니다.
                        또한 개임 내에서 랭킹 출력을 목적으로 이름, 분반 정보,
                        플레이 정보가 노출될 수 있습니다. 위 정보 역시 서비스
                        운영이 종료되는 즉시 파기될 예정이며, 위에 서술된 내용
                        외의 목적으로 사용되지 않습니다.
                      </Typography>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={handleClose}
                        sx={{
                          bgcolor: "#CCCCCC",
                          color: "#000000",
                        }}
                      >
                        확인
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
              <SubmitCheckValid
                enabled={
                  !waiting &&
                  name.isValid &&
                  studentId.isValid &&
                  povisId.isValid &&
                  group.isValid &&
                  password.isValid &&
                  repassword.isValid &&
                  isCheck
                }
                label="회원가입"
              ></SubmitCheckValid>
              <LinkPage
                href="/user/sign-in"
                label="계정이 이미 있으신가요?"
              ></LinkPage>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
