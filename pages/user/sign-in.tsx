import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import LinkPage from "src/components/LinkPage";
import { Container } from "@mui/material";

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

export default function SignInSide() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/user/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: data.get("studentId"),
        password: data.get("password"),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.status >= 400) throw new Error(data.message);

        location.href = "/";
      })
      .catch((err) => {
        console.log(err.message);
        alert("로그인 정보가 일치하지 않습니다!");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div className="indexstyle">
          <img
            src="https://cdn.discordapp.com/attachments/927221603778035755/935162801230590013/4c44b30f0b9a1897.png"
            style={{
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              position: "absolute",
            }}
          />
          <div className="log-in-box">
            <Container
              component="main"
              sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CssBaseline />
              <Box
                sx={{
                  mt: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5">
                  로그인
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="studentId"
                    label="학번"
                    name="studentId"
                    autoComplete="studentId"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="비밀번호"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    로그인
                  </Button>
                  <LinkPage
                    href="/user/sign-up"
                    label="계정이 없으신가요?"
                  ></LinkPage>
                  <LinkPage
                    href="/user/forgot-password"
                    label="비밀번호를 잊으셨나요?"
                  ></LinkPage>
                </Box>
              </Box>
            </Container>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
