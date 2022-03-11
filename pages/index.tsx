import * as React from "react";

export default function Index() {
  let [name, setName] = React.useState<string[] | undefined>(undefined);

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
        <div className="index-sponsor">아우토크립트 후원! 대박 감사!<br/>모빌리티의 중심 아우토크립트여 영원하라</div>
        <img src="static/AUTOCRYPT_Logo_Large.png" style={{objectFit: "contain", bottom:"2vh", height:"5vh", position:"absolute", zIndex:"1000"}}/>
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
