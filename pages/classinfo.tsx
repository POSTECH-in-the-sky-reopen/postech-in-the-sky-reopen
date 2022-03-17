import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";
import { Friend } from "src/interfaces/Friend";
import { Cell } from "src/entity/Cell";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Profile2 from "./profile2";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Paper from "@mui/material/Paper";
import { ItemType, Layer } from "src/enums/ItemType";

const theme2 = createTheme({
  typography: {
    fontFamily: "MaplestoryLight",
    fontSize: 15,
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
  palette: {
    background: {
      default: "#e6e6fa",
    },
  },
});

export interface ItemInfoForPlayer {
  name: string;
  silhouetteId: string;
  itemType: ItemType;
  isFound: boolean;
  layers: Layer[];
}

export interface CollectionForPlayer {
  collectionName: string;
  itemInfos: ItemInfoForPlayer[];
  effectDetail: string;
}

interface AchievementForPlayer {
  name: string;
  detail: string;
  honored: string;
}

const sections = [
  { key: 1, title: "점령지" },
  { key: 2, title: "컬렉션" },
  { key: 3, title: "플레이어" },
];

const occupationflag = [
  { key: 1, title: "1분반", src: "/static/분반 깃발/1분반.png" },
  { key: 2, title: "2분반", src: "/static/분반 깃발/2분반.png" },
  { key: 3, title: "3분반", src: "/static/분반 깃발/3분반.png" },
  { key: 4, title: "4분반", src: "/static/분반 깃발/4분반.png" },
  { key: 5, title: "5분반", src: "/static/분반 깃발/5분반.png" },
  { key: 6, title: "6분반", src: "/static/분반 깃발/6분반.png" },
  { key: 7, title: "7분반", src: "/static/분반 깃발/7분반.png" },
  { key: 8, title: "8분반", src: "/static/분반 깃발/8분반.png" },
  { key: 9, title: "9분반", src: "/static/분반 깃발/9분반.png" },
  { key: 10, title: "10분반", src: "/static/분반 깃발/10분반.png" },
  { key: 11, title: "11분반", src: "/static/분반 깃발/11분반.png" },
  { key: 12, title: "12분반", src: "/static/분반 깃발/12분반.png" },
  { key: 13, title: "13분반", src: "/static/분반 깃발/13분반.png" },
  { key: 14, title: "14분반", src: "/static/분반 깃발/14분반.png" },
  { key: 15, title: "15분반", src: "/static/분반 깃발/15분반.png" },
];

const AppbarTheme = createTheme({
  palette: {
    primary: {
      main: "#F9FFFF",
    },
    warning: {
      main: "#bebefa",
    },
    secondary: {
      main: "#e6e6fa",
    },
  },
  typography: {
    fontFamily: "MaplestoryLight",
    fontSize: 15,
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

function Appbar(props: any) {
  return (
    <ThemeProvider theme={AppbarTheme}>
      <AppBar position="fixed" color="primary" sx={{ top: 0 }}>
        <div
          style={{
            height: "2.5rem",
            backgroundColor: "#dcedf8",
            textAlign: "center",
            padding: "0.8rem",
          }}
        >
          <div
            style={{
              position: "absolute",
              marginTop: "-1vw",
              marginLeft: "-2vw",
            }}
            onClick={function () {
              window.location.href = "/main";
            }}
          >
            <ArrowBackIcon />
          </div>
          <Typography sx={{ marginTop: "-1vw" }}>
            <b>분반 정보</b>
          </Typography>
        </div>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{
            justifyContent: "space-between",
            overflowX: "auto",
            //borderBottom: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            variant="contained"
            color={props.choosed <= 1 ? "warning" : "secondary"}
            onClick={function (e) {
              e.preventDefault();
              props.setchoosed(1);
            }}
            sx={{ width: 0.3 }}
          >
            점령지
          </Button>
          <Button
            variant="contained"
            color={
              props.choosed >= 2 && props.choosed <= 2 ? "warning" : "secondary"
            }
            onClick={function (e) {
              e.preventDefault();
              props.setchoosed(2);
            }}
            sx={{ width: 0.3 }}
          >
            컬렉션
          </Button>
          <Button
            variant="contained"
            color={props.choosed >= 3 ? "warning" : "secondary"}
            onClick={function (e) {
              e.preventDefault();
              props.setchoosed(3);
            }}
            sx={{ width: 0.3 }}
          >
            플레이어
          </Button>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default function Header() {
  const Offset = styled("div")(({ theme }) => AppbarTheme.mixins.toolbar);

  let [choosed, setchoosed] = React.useState<number>(1);
  let [friend, setFriend] = React.useState<Friend[] | undefined>(undefined);
  let [group, setGroup] = React.useState<number | undefined>(undefined);
  let [occupationmap, setOccupationmap] = React.useState<Cell[] | undefined>(
    undefined
  );
  let [page, setPage] = React.useState<number>(1);
  let [collections, setCollections] = React.useState<
    CollectionForPlayer[] | undefined
  >(undefined);

  let collectionSlots: any[] = [];
  let itemSlots: any[] = [];
  let playerSlots: any[] = [];
  let occupationSlots: any[] = [];
  let occupationSlots1: any[] = [];
  let occupationSlots2: any[] = [];
  let occupationSlots3: any[] = [];
  let occupationSlots4: any[] = [];
  let occupationSlots5: any[] = [];

  React.useEffect(function () {
    fetch("/api/group/get-friends", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setFriend(data.friends);
      })
      .catch((error) => console.log("분반 친구 가져오기 에러"));
    fetch("/api/player/group", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setGroup(data.group.num);
      })
      .catch((error) => console.log("분반 가져오기 에러"));
    fetch("/api/map/get-siege-cells", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setOccupationmap(data.cells);
      })
      .catch((error) => console.log("분반 점령전 가져오기 에러"));
    fetch("/api/group/get-collections", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setCollections(data.collections);
      })
      .catch((error) => console.log("분반 컬렉션 가져오기 에러"));
  }, []);

  if (friend !== undefined) {
    for (let i = 0; i < friend.length; i++) {
      let time0 = String(friend[i].recentAccessedAt);
      let time1 = time0.split("T")[0];
      playerSlots.push(
        <Paper
          key={"playerslots" + i}
          elevation={2}
          sx={{
            marginLeft: "5%",
            width: "90%",
            height: "25vh",
            marginBottom: "5%",
            position: "relative",
          }}
        >
          <Container>
            <Box
              sx={{
                position: "absolute",
                width: "30vw",
                height: "25vh",
                left: "-17%",
                top: "-5%",
              }}
            >
              <Profile2
                equipments={friend[i].equipments}
                width={63}
                unit={"vw"}
              />
            </Box>
            <Box sx={{ marginLeft: "40%", marginTop: "5%" }}>
              <Typography>
                {group}분반 {friend[i].name}
              </Typography>
              {friend[i].honored !== undefined ? (
                <Typography color="#aba4db">{friend[i].honored}</Typography>
              ) : null}

              <Typography>최근 위치 : {friend[i].location.name}</Typography>
              <Typography>최근 접속 시간 :</Typography>
              <Typography>{time1}</Typography>
            </Box>
          </Container>
        </Paper>
      );
    }
  }

  if (occupationmap !== undefined) {
    for (let i = 0; i < occupationmap.length; i++) {
      if (occupationmap[i].group === null || occupationmap[i].group.num === 0) {
        occupationSlots.push(
          <div key={"occupationslots" + i}>
            <Box
              sx={{
                marginLeft: "10%",
                marginBottom: "5%",
                width: "80%",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "1rem",
              }}
            >
              {" "}
              <div>
                <Typography color="black">{occupationmap[i].name} </Typography>
                <Typography color="black">미점령</Typography>
              </div>
            </Box>
          </div>
        );
      } else if (occupationmap[i].group.num === group) {
        occupationSlots.push(
          <div key={"occupationslots" + i}>
            <Box
              sx={{
                marginLeft: "10%",
                marginBottom: "5%",
                width: "80%",
                textAlign: "center",
                backgroundColor: "#007a00",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "1rem",
              }}
            >
              <div>
                <Typography color="white">{occupationmap[i].name} </Typography>
                <Typography color="white">우리의 영역이다!!!</Typography>
              </div>
            </Box>
          </div>
        );
      } else {
        occupationSlots.push(
          <div key={"occupationslots" + i}>
            <Box
              sx={{
                marginLeft: "10%",
                marginBottom: "5%",
                width: "80%",
                textAlign: "center",
                backgroundColor: "#9B111E",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "1rem",
              }}
            >
              <div>
                <Typography color="white">{occupationmap[i].name} </Typography>
                <Typography color="white">
                  {occupationmap[i].group.num}분반의 영역이다!!!
                </Typography>
              </div>
            </Box>
          </div>
        );
      }
      if (i == 5) {
        occupationSlots1 = occupationSlots;
        occupationSlots = [];
      } else if (i == 8) {
        occupationSlots2 = occupationSlots;
        occupationSlots = [];
      } else if (i == 12) {
        occupationSlots3 = occupationSlots;
        occupationSlots = [];
      } else if (i == 16) {
        occupationSlots4 = occupationSlots;
        occupationSlots = [];
      } else if (i == occupationmap.length - 1) {
        occupationSlots5 = occupationSlots;
        occupationSlots = [];
      }
    }
  }

  if (collections !== undefined) {
    for (let i = 0; i < collections.length; i++) {
      itemSlots.push([]);
      for (let j = 0; j < collections[i].itemInfos.length; j++) {
        if (collections[i].itemInfos[j].isFound) {
          switch (collections[i].itemInfos[j].itemType) {
            case ItemType.WEAPON:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/무기 아이콘/" +
                      collections[i].itemInfos[j].name +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">
                    {collections[i].itemInfos[j].name}
                  </div>
                </div>
              );
              break;
            case ItemType.ACCESSORY:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/장신구/" +
                      collections[i].itemInfos[j].name +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">
                    {collections[i].itemInfos[j].name}
                  </div>
                </div>
              );
              break;
            case ItemType.ENCHANT:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={"/static/UI 아이콘/인챈트북.png"}
                    className="collection-img"
                  />
                  <div className="collection-name">
                    {collections[i].itemInfos[j].name}
                  </div>
                </div>
              );
              break;
            case ItemType.FACE:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/코디/얼굴_" +
                      collections[i].itemInfos[j].name +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">
                    {collections[i].itemInfos[j].name}
                  </div>
                </div>
              );
              break;
            case ItemType.HAIR:
              if (collections[i].itemInfos[j].layers.length === 2) {
                itemSlots[i].push(
                  <div key={"itemslots" + i + j} className="collection-box">
                    <img
                      src={
                        "/static/코디/앞머리_" +
                        collections[i].itemInfos[j].name +
                        ".png"
                      }
                      style={{ position: "absolute" }}
                      className="collection-img"
                    />
                    <img
                      src={
                        "/static/코디/뒷머리_" +
                        collections[i].itemInfos[j].name +
                        ".png"
                      }
                      style={{ position: "absolute" }}
                      className="collection-img"
                    />
                    <div className="collection-name">
                      {collections[i].itemInfos[j].name}
                    </div>
                  </div>
                );
              } else {
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/코디/앞머리_" +
                      collections[i].itemInfos[j].name +
                      ".png"
                    }
                    style={{ position: "absolute" }}
                    className="collection-img"
                  />
                </div>;
              }
              break;
            case ItemType.SUIT:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/코디/옷_" +
                      collections[i].itemInfos[j].name +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">
                    {collections[i].itemInfos[j].name}
                  </div>
                </div>
              );
              break;
            case ItemType.DECO:
              if (collections[i].itemInfos[j].layers[0] === "1") {
                itemSlots[i].push(
                  <div key={"itemslots" + i + j} className="collection-box">
                    <img
                      src={
                        "/static/코디/망토_" +
                        collections[i].itemInfos[j].name +
                        ".png"
                      }
                      className="collection-img"
                    />
                    <div className="collection-name">
                      {collections[i].itemInfos[j].name}
                    </div>
                  </div>
                );
              }
              if (collections[i].itemInfos[j].layers[0] === "7") {
                itemSlots[i].push(
                  <div key={"itemslots" + i + j} className="collection-box">
                    <img
                      src={
                        "/static/코디/오버레이_" +
                        collections[i].itemInfos[j].name +
                        ".png"
                      }
                      className="collection-img"
                    />
                    <div className="collection-name">
                      {collections[i].itemInfos[j].name}
                    </div>
                  </div>
                );
              }
              break;
          }
        } else {
          switch (collections[i].itemInfos[j].itemType) {
            case ItemType.WEAPON:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/무기 아이콘 실루엣/" +
                      collections[i].itemInfos[j].silhouetteId +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">???</div>
                </div>
              );
              break;
            case ItemType.ACCESSORY:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/장신구 실루엣/" +
                      collections[i].itemInfos[j].silhouetteId +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">???</div>
                </div>
              );
              break;
            case ItemType.ENCHANT:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/인챈트 실루엣/" +
                      collections[i].itemInfos[j].silhouetteId +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">???</div>
                </div>
              );
              break;
            default:
              itemSlots[i].push(
                <div key={"itemslots" + i + j} className="collection-box">
                  <img
                    src={
                      "/static/코디 실루엣/" +
                      collections[i].itemInfos[j].silhouetteId +
                      ".png"
                    }
                    className="collection-img"
                  />
                  <div className="collection-name">???</div>
                </div>
              );
              break;
          }
        }
      }
    }
  }

  if (collections !== undefined) {
    for (let i = 0; i < collections.length; i++) {
      collectionSlots.push(
        <div key={"collectionslots" + i}>
          <Typography
            align="center"
            sx={{
              color: "black",
              position: "relative",
            }}
          >
            [{collections[i].collectionName}]
          </Typography>
          <Typography textAlign="center" color="#aba4db">
            {collections[i].effectDetail}
          </Typography>
          <div className="collection-slot">{itemSlots[i]}</div>
        </div>
      );
    }
  }
  if (choosed === 2) {
    // 컬렉션
    return (
      <ThemeProvider theme={theme2}>
        <CssBaseline />
        <div>
          <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
          <Offset />
          <Offset />
          <div style={{ overflow: "scroll" }}> {collectionSlots}</div>
        </div>
      </ThemeProvider>
    );
  } else if (choosed == 1) {
    // 점령지
    if (page == 1) {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
          <div
            style={{
              height: "100vh",
            }}
          >
            <Offset />
            <Offset />
            <Typography sx={{ marginLeft: "10%" }}>지역 1</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
              sx={{ marginTop: "-3vh" }}
            >
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(2);
                }}
              >
                <ArrowCircleRightIcon />
              </IconButton>
            </Stack>
            {occupationSlots1}
            <Box sx={{ height: "3vh" }}></Box>
          </div>
        </ThemeProvider>
      );
    } else if (page == 2) {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
          <div
            style={{
              height: "100vh",
            }}
          >
            <Offset />
            <Offset />
            <Typography sx={{ marginLeft: "10%" }}>지역 2</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
              sx={{ marginTop: "-3vh" }}
            >
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(1);
                }}
              >
                <ArrowCircleLeftIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(3);
                }}
              >
                <ArrowCircleRightIcon />
              </IconButton>
            </Stack>
            {occupationSlots2}
            <Box sx={{ height: "3vh" }}></Box>
          </div>
        </ThemeProvider>
      );
    } else if (page == 3) {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <div
            style={{
              height: "100vh",
            }}
          >
            <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
            <Offset />
            <Offset />
            <Typography sx={{ marginLeft: "10%" }}>지역 3</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
              sx={{ marginTop: "-3vh" }}
            >
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(2);
                }}
              >
                <ArrowCircleLeftIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(4);
                }}
              >
                <ArrowCircleRightIcon />
              </IconButton>
            </Stack>
            {occupationSlots3}
            <Box sx={{ height: "3vh" }}></Box>
          </div>
        </ThemeProvider>
      );
    } else if (page == 4) {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <div
            style={{
              height: "100vh",
            }}
          >
            <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
            <Offset />
            <Offset />
            <Typography sx={{ marginLeft: "10%" }}>지역 4</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
              sx={{ marginTop: "-3vh" }}
            >
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(3);
                }}
              >
                <ArrowCircleLeftIcon />
              </IconButton>
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(5);
                }}
              >
                <ArrowCircleRightIcon />
              </IconButton>
            </Stack>
            {occupationSlots4}
            <Box sx={{ height: "3vh" }}></Box>
          </div>
        </ThemeProvider>
      );
    } else {
      return (
        <ThemeProvider theme={theme2}>
          <CssBaseline />
          <div
            style={{
              height: "100vh",
            }}
          >
            <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
            <Offset />
            <Offset />
            <Typography sx={{ marginLeft: "10%" }}>지역 5</Typography>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={0}
              sx={{ marginTop: "-3vh" }}
            >
              <IconButton
                color="inherit"
                onClick={function () {
                  setPage(4);
                }}
              >
                <ArrowCircleLeftIcon />
              </IconButton>
            </Stack>
            {occupationSlots5}
            <Box sx={{ height: "3vh" }}></Box>
          </div>
        </ThemeProvider>
      );
    }
  } else if (choosed == 3) {
    // 플레이어
    return (
      <ThemeProvider theme={theme2}>
        <CssBaseline />
        <div>
          <Appbar choosed={choosed} setchoosed={setchoosed}></Appbar>
          <Offset />
          <Offset />
          <div style={{ overflow: "scroll" }}> {playerSlots}</div>
        </div>
      </ThemeProvider>
    );
  }
}
