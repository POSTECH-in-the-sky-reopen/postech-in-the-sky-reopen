import * as React from "react";
import PropTypes from "prop-types";
import { styled, makeStyles } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Modal from "react-modal";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Equipments } from "src/interfaces/Equipments";
import Profile2 from "./profile2";
import Producers from "./producer";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import CampaignIcon from "@mui/icons-material/Campaign";
import { Siege } from "src/entity/Siege";

const modalstyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "100",
  },
  content: {
    background: "#dcedf8",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "100",
  },
};

const hanmadistyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    background: "#FFFFFF",
    top: "25vh",
    left: "10vw",
    right: "10vw",
    bottom: "25vh",
  },
};

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
});

const images = [
  {
    url: "",
    title: "내 정보",
    width: "50%",
    href: "/myinfo",
    imgsrc: "/static/UI 아이콘/내 정보.png",
  },
  {
    url: "",
    title: "분반 정보",
    width: "50%",
    href: "/classinfo",
    imgsrc: "/static/UI 아이콘/분반 정보.png",
  },
  {
    url: "",
    title: "모험",
    width: "50%",
    href: "/adventure",
    imgsrc: "/static/UI 아이콘/모험.png",
  },
  {
    url: "",
    title: "구름탑",
    width: "50%",
    href: "/cloud-tower",
    imgsrc: "/static/UI 아이콘/구름탑.png",
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 100,
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));

// 이미지 처리에 관한 것
const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

function LinearProgressWithLabel(props: any) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="80%" mr={3}>
        <LinearProgress variant="determinate" color="secondary" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /*0에서 100 사이의 값*/
  value: PropTypes.number.isRequired,
};

function UserInfo(props: any) {
  return (
    <div>
      <Box
        sx={{
          height: "20%",
          backgroundColor: "#dcedf8",
          padding: "0.5rem",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "20%",
            border: 2,
            borderColor: "white",
            padding: "0.2rem",
            display: "flex",
          }}
        >
          <img
            src="static/AUTOCRYPT_Logo_Small.png"
            style={{
              objectFit: "contain",
              height: "100%",
              position: "relative",
              marginLeft: "0.2rem",
              marginRight: "0.2rem",
            }}
          />
          <div>
            <div style={{ display: "flex" }}>
              <Typography>
                {" "}
                {props.group}분반 {props.username}
              </Typography>
              <Typography color="#59aade" marginLeft="1.5vw">
                {" "}
                {props.honor}
              </Typography>
            </div>
            <Typography>
              모험 레벨: {props.adventurelevel} 재화: {props.money}
            </Typography>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default function ButtonBases() {
  let [adventurelevel, setAdventurelevel] = React.useState<number>(0);
  let [fatigue, setFatigue] = React.useState<number>(0);
  let [money, setMoney] = React.useState<number | undefined>(undefined);
  let [username, setUsername] = React.useState<string>("");
  let [equipment, setEquipment] = React.useState<Equipments | undefined>(
    undefined
  );
  let [group, setGroup] = React.useState<number | undefined>(undefined);
  let [modalopened, setmodalOpened] = React.useState<boolean>(false);
  let [hanmadiopened, sethanmadiOpened] = React.useState<boolean>(false);
  let [dialogopen, setdialogOpen] = React.useState(false);
  let [dialog2open, setdialog2Open] = React.useState(false);
  let [dialognofatigueopen, setdialognofatigueOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  let [siege, setSiege] = React.useState<Siege | undefined>(undefined);

  let [cost, setCost] = React.useState<number | undefined>(undefined);

  let [honor, setHonor] = React.useState<string | undefined>(undefined);

  React.useEffect(function () {
    fetch("/api/player/equipments/get", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setEquipment(data.equipments);
      })
      .catch((error) => console.log("메인 장비 가져오기 에러"));
  }, []);
  React.useEffect(function () {
    fetch("/api/player/name", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setUsername(data.name);
      })
      .catch((error) => console.log("메인 이름 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/group", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setGroup(data.group.num);
      })
      .catch((error) => console.log("메인 분반 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/fatigue/current", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setFatigue(data.fatigue);
      })
      .catch((error) => console.log("메인 피로도 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/money/current", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setMoney(data.money);
      })
      .catch((error) => console.log("메인 돈 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/fatigue/cost", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setCost(data.cost);
      })
      .catch((error) => console.log("피로도 초기화 비용 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/my-siege", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setSiege(data.siege);
      })
      .catch((error) => console.log("메인 점령전 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/level", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setAdventurelevel(data.level);
      })
      .catch((error) => console.log("메인 모험레벨 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/fatigue/cost", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setCost(data.cost);
      })
      .catch((error) => console.log("메인 피로도 가격 가져오기 에러"));
  }, []);

  React.useEffect(function () {
    fetch("/api/player/achievement/get-honored", { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        setHonor(data.honored);
      })
      .catch((error) => console.log("메인 업적 가져오기 에러"));
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenModal = () => {
    setmodalOpened(true);
  };

  const handleCloseModal = () => {
    setmodalOpened(false);
  };

  const outSection = React.useRef(null);

  const drawer = (
    <div
      style={{
        float: "right",
        marginTop: "1rem",
        marginRight: "2vw",
        width: "30vw",
      }}
    >
      <Box
        sx={{
          border: 2,
          marginLeft: "3.5vw",
          borderColor: "#dcedf8",
          width: "25vw",
        }}
        onClick={function () {
          window.location.href = "/store";
        }}
      >
        <img
          src="/static/UI 아이콘/상점.png"
          style={{
            width: "25vw",
            height: "25vw",
          }}
        ></img>
        <Typography sx={{ textAlign: "center" }}>상점</Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
        onClick={function () {
          window.location.href = "/enchant";
        }}
      >
        <img
          src="/static/UI 아이콘/인챈트.png"
          style={{
            width: "25vw",
            height: "25vw",
          }}
        ></img>
        <Typography sx={{ textAlign: "center" }}>인챈트</Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
        onClick={function () {
          window.location.href = "/reinforcement";
        }}
      >
        <img
          src="/static/UI 아이콘/장비강화.png"
          style={{
            width: "25vw",
            height: "25vw",
          }}
        ></img>
        <Typography sx={{ textAlign: "center" }}>강화</Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
        onClick={function () {
          window.location.href = "/achievements";
        }}
      >
        <img
          src="/static/UI 아이콘/업적.png"
          style={{
            width: "25vw",
            height: "25vw",
          }}
        ></img>
        <Typography sx={{ textAlign: "center" }}>업적</Typography>
      </Box>

      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
        onClick={function () {
          window.location.href = "/illustrated-book";
        }}
      >
        <img
          src="/static/UI 아이콘/몬스터 도감.png"
          style={{
            width: "25vw",
            height: "25vw",
          }}
        ></img>
        <Typography sx={{ textAlign: "center" }}>도감</Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
        onClick={openInNewTap}
      >
        <PeopleIcon
          sx={{ marginLeft: "2.5vw", width: "20vw", height: "20vw" }}
        ></PeopleIcon>
        <Typography sx={{ textAlign: "center" }}>버그 제보</Typography>
      </Box>
      <Box
        sx={{
          marginLeft: "3.5vw",
          border: 2,
          borderColor: "#dcedf8",
          width: "25vw",
          marginTop: "3.5vw",
        }}
      >
        <Producers />
      </Box>
    </div>
  );

  //let myweapon = "/static/무기/" + equipment?.Weapon?.itemInfo.name + ".png";

  function openInNewTap() {
    let win = window.open("https://open.kakao.com/o/sAjL7f6d", "_blank");
    win !== undefined && win !== null ? win.focus() : "";
  }

  return (
    <ThemeProvider theme={theme2}>
      <div
        className="main-gradient"
        style={{ overflow: "hidden", position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            marginTop: "20vh",
            marginLeft: "-30vw",
            width: "300vw",
          }}
          className="cloud-slide"
        >
          {" "}
          <img src="/static/UI/구름1.png"></img>
        </div>
        <div
          style={{
            position: "absolute",
            marginTop: "50vh",
          }}
          className="cloud-slide"
        >
          {" "}
          <img src="/static/UI/구름2.png"></img>
        </div>
        <div
          style={{
            position: "absolute",
            marginTop: "-10vh",
          }}
          className="cloud-slide"
        >
          {" "}
          <img src="/static/UI/구름3.png"></img>
        </div>
        <UserInfo
          username={username}
          adventurelevel={adventurelevel}
          money={money}
          group={group}
          hanmadi={sethanmadiOpened}
          modall={setMobileOpen}
          honor={honor}
        />
        <div
          style={{
            float: "right",
            marginRight: "2vw",
          }}
        >
          <img
            src="/static/UI 아이콘/핫식스.png"
            style={{
              width: "12vw",
              height: "12vw",
              marginRight: "25vw",
              position: "relative",
            }}
            onClick={function (e) {
              e.preventDefault();
              setmodalOpened(true);
            }}
          ></img>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ marginTop: "-7vw" }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            anchor="right"
          >
            {drawer}
          </Drawer>
        </div>
        <div
          style={{
            marginTop: "1rem",
            marginLeft: "0.5rem",
            width: "50%",
            position: "absolute",
          }}
        >
          <LinearProgressWithLabel value={fatigue} />
        </div>
        <Modal
          isOpen={modalopened}
          style={modalstyle}
          ariaHideApp={false}
          shouldCloseOnOverlayClick={true}
          onRequestClose={function (e) {
            e.preventDefault();
            setmodalOpened(false);
          }}
        >
          <Typography
            sx={{ marginTop: "10%", textAlign: "center" }}
            variant="h6"
          >
            재화로 피로도를 회복할 수 있습니다.
          </Typography>
          <Typography sx={{ mt: "10%", textAlign: "center" }}>
            현재 소모 재화 : {cost}
          </Typography>
          <Button
            variant="contained"
            onClick={function (e) {
              e.preventDefault();

              if (money !== undefined && cost !== undefined) {
                if (money >= cost && fatigue != 0) {
                  setdialog2Open(true);
                  fetch("/api/player/fatigue/refresh", { method: "POST" }).then(
                    async (response) => {
                      const data = await response.json();
                    }
                  );
                } else if (fatigue == 0 && money >= cost) {
                  setdialognofatigueOpen(true);
                } else {
                  setdialogOpen(true);
                }
              }
            }}
            sx={{
              backgroundColor: "#bdb6f1",
              mt: "10%",
              position: "relative",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          >
            {" "}
            회복하기{" "}
          </Button>

          <Dialog open={dialogopen}>
            <DialogContent>
              <DialogContentText id="fail">
                재화가 부족합니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setdialogOpen(false);
                  setmodalOpened(false);
                  setdialog2Open(false);
                }}
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={dialog2open}>
            <DialogContent>
              <DialogContentText id="sucess">
                성공적으로 회복이 완료되었습니다.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setdialogOpen(false);
                  setmodalOpened(false);
                  setdialog2Open(false);
                  window.location.reload();
                }}
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={dialognofatigueopen}>
            <DialogContent>
              <DialogContentText id="fail">피로도가 0입니다.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setdialogOpen(false);
                  setmodalOpened(false);
                  setdialog2Open(false);
                  setdialognofatigueOpen(false);
                }}
              >
                확인
              </Button>
            </DialogActions>
          </Dialog>
        </Modal>

        <img
          src="/static/UI/캐릭터창.png"
          style={{
            position: "absolute",
            width: "70vw",
            left: "17vw",
            top: "50vh",
          }}
        ></img>
        <div
          style={{
            width: "100vw",
            position: "absolute",
            left: "-10vw",
          }}
          className="person"
        >
          <div
            style={{
              width: "100vw",
              height: "100vw",
              overflow: "hidden",
              position: "absolute",
            }}
          >
            <Profile2 equipments={equipment} width={120} unit="vw"></Profile2>
          </div>
        </div>
        {siege !== undefined ? (
          <Box
            sx={{
              width: "90%",
              position: "absolute",
              bottom: "28%",
              left: "50%",
              transform: "translate(-50%, 0)",
              borderRadius: 2,
              bgcolor: "#dce4f9",
              p: "3%",
              zIndex: "50",
            }}
          >
            <Typography
              align="center"
              sx={{
                fontSize: 15,
                color: "black",
              }}
            >
              {siege !== undefined &&
              siege !== undefined &&
              siege.cell !== undefined
                ? siege.cell.name + "에서 "
                : ""}
              {siege !== undefined &&
              siege !== undefined &&
              siege.cell !== undefined
                ? siege.damage + "데미지를 가함"
                : ""}
            </Typography>
            <Typography
              align="center"
              sx={{
                fontSize: 8,
                color: "red",
              }}
            >
              다른 점령전 셀에서 전투 시 현재 점령전 공격 정보가 초기화됩니다.
            </Typography>
          </Box>
        ) : (
          ""
        )}

        <div
          style={{
            position: "fixed",
            bottom: 0,
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              height: " 40%",
              zIndex: "70",
            }}
          >
            {images.map((image) => (
              <ImageButton
                focusRipple
                key={image.title}
                style={{
                  width: image.width,
                }}
                onClick={function () {
                  window.location.href = image.href;
                }}
              >
                <ImageSrc style={{ backgroundImage: `url(${image.url})` }} />
                <ImageBackdrop className="MuiImageBackdrop-root" />
                <Image>
                  <img
                    src={image.imgsrc}
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                    }}
                  ></img>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    color="inherit"
                    sx={{
                      position: "relative",
                      p: 2,
                      pt: 2,
                      pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                    }}
                  >
                    {image.title}
                    <ImageMarked className="MuiImageMarked-root" />
                  </Typography>
                </Image>
              </ImageButton>
            ))}
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}
