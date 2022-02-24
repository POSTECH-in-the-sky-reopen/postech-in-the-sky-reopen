import * as React from "react";
import { css, keyframes } from "@emotion/react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LinkPage from "src/components/LinkPage";
export default function Start() {
  const [open, setOpen] = React.useState(true)
  let [name, setName] = React.useState<string[] | undefined>(undefined);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(function () {
    fetch("/api/player/name", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setName(data.name);
    });
  }, []);

  React.useEffect(function () {
    if (navigator.userAgent.match(/Android/i)) {
      window.scrollTo(0, 1);
    } else if (navigator.userAgent.match(/iPhone/i)) {
      window.scrollTo(0, 1);
    }
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      
      <div
        className="indexstyle"
        onClick={function () {
          window.location.href = "/main";
        }}
      >
        <img
          src="/static/로그인 배경.png"
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            position: "absolute",
          }}
        />
        <img src="/static/로고.png" className="logo" />
        <img src="/static/로그인 전경.png" className="floating-people" />
        <div className="show-name">{name}</div>
        <div className="touch-to-start">touch to start</div>
        <div
          style={{
            position: "absolute",
            marginTop: "97vh",
            color: "white",
            fontSize: "3.3vw",
          }}
        >
          팀 이름
        </div>
      </div>
    </div>
  );
}
