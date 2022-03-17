import * as React from "react";
export default function Start() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div
        className="indexstyle"
        onClick={function () {
          window.location.href = "/";
        }}
      >
        <img
          src="/static/closed.png"
          style={{
            width: "100vw",
            height: "100vh",
            objectFit: "cover",
            position: "absolute",
          }}
        />
        <div className="touch-to-start">touch to start</div>
        <div
          style={{
            position: "absolute",
            marginTop: "97vh",
            color: "white",
            fontSize: "3.3vw",
          }}
        >
        </div>
      </div>
    </div>
  );
}
