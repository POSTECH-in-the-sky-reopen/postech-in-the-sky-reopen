import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Link from 'next/link';

const theme = createTheme();

export default function Index() {

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
            관리자 메인 페이지
          </Typography>
          <Grid>
            <Box><Link href="/admin/user/set-admin">관리자 권한 부여</Link></Box>
            <Box><Link href="/admin/level">레벨 변경</Link></Box>
            <Box><Link href="/admin/money">재화 발급</Link></Box>
            <Box><Link href="/admin/item">아이템 발급</Link></Box>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
