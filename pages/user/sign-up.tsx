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
import { isValidNanoid } from "./forgot-password";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
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

export default function SignUp() {
  let [pin, setPin] = React.useState<string>("");
  let [email, setEmail] = React.useState<string>("");
  let [password, setPassword] = React.useState<string>("");
  let [repassword, setRepassword] = React.useState<string>("");

  const [pinMessage, setPinMessage] = React.useState<string>("");
  const [emailMessage, setEmailMessage] = React.useState<string>("");
  const [passwordMessage, setPasswordMessage] = React.useState<string>("");
  const [repasswordMessage, setRepasswordMessage] = React.useState<string>("");

  const [isPin, setIsPin] = React.useState<boolean>(false);
  const [isEmail, setIsEmail] = React.useState<boolean>(false);
  const [isPassword, setIsPassword] = React.useState<boolean>(false);
  const [isRepassword, setIsRepassword] = React.useState<boolean>(false);
  const [isCheck, setIsCheck] = React.useState<boolean>(false);

  let [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  let pattern_special = /[~!@#$%<>^&*()\-=+_\\\/,.:;|'"]/gi;
  let pattern_emailcheck = /.+@.+\..+/gi;

  const pinChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!isValidNanoid(value)) {
      setPinMessage("핀번호 형식이 올바르지 않습니다!");
      setIsPin(false);
    } else {
      setPinMessage("");
      setIsPin(true);
    }
    setPin(value);
  };
  const emailChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!value.match(pattern_emailcheck)) {
      setEmailMessage("이메일 형식이 올바르지 않습니다!");
      setIsEmail(false);
    } else {
      setEmailMessage("");
      setIsEmail(true);
    }
    setEmail(value);
  };
  const passwordChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (value.length < 6) {
      setPasswordMessage("6자 이상의 비밀번호를 입력해주세요.");
      setIsPassword(false);
    } else {
      setPasswordMessage("");
      setIsPassword(true);
    }
    setPassword(value);
  };
  const repasswordChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (password !== value) {
      setRepasswordMessage("비밀번호가 일치하지 않습니다.");
      setIsRepassword(false);
    } else {
      setRepasswordMessage("");
      setIsRepassword(true);
    }
    setRepassword(value);
  };
  const checkboxChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCheck(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pin: data.get("pin"),
        email: data.get("email"),
        password: data.get("password"),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status >= 400) throw new Error(data.message);

        alert("회원가입이 완료되었습니다!");
        location.href = "/user/sign-in";
      })
      .catch((err) => {
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
                  input="pin"
                  label="핀번호"
                  isPassword={false}
                  onChange={pinChange}
                  value={pin}
                  isValid={isPin}
                  message={pinMessage}
                ></InputCheckValid>
                <InputCheckValid
                  input="email"
                  label="이메일"
                  isPassword={false}
                  onChange={emailChange}
                  value={email}
                  isValid={isEmail}
                  message={emailMessage}
                ></InputCheckValid>
                <InputCheckValid
                  input="password"
                  label="비밀번호"
                  isPassword={true}
                  onChange={passwordChange}
                  value={password}
                  isValid={isPassword}
                  message={passwordMessage}
                ></InputCheckValid>
                <InputCheckValid
                  input="repassword"
                  label="비밀번호 재입력"
                  isPassword={true}
                  onChange={repasswordChange}
                  value={repassword}
                  isValid={isRepassword}
                  message={repasswordMessage}
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
                      <Typography>
                        TODO: 개인정보 수집 및 활용 내용 채우기
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
                  isPin && isEmail && isPassword && isRepassword && isCheck
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
