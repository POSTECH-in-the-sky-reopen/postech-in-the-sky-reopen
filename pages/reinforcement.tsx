import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Modal from "react-modal";

import { Equipments } from "src/interfaces/Equipments";
import { EquipableItem, Item, ITEM_SHARPNESS_INSANE_MAX, WeaponEquipableItem } from "src/entity/Item";
import { Status } from "src/interfaces/Status";
import { ItemType, sharpnessDiff } from "src/enums/ItemType";
import { EquipableItemInfo } from "src/entity/ItemInfo";
import Button from "@mui/material/Button";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";

const theme = createTheme({
  typography: {
    fontFamily: "MaplestoryLight",
    fontSize: 15,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
          @font-face {
            font-family: 'MaplestoryLight';
            src: url("fonts/MaplestoryLight.ttf") format('truetype');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
    },
  },
  palette: {
    background: {
      default: "#e6e6fa",
    },
    success: {
      main: "#bdb6f1",
    },
  },
});

let ment = ["아무 변화가 없다...", "변화가 없다!"];

const successstyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "100",
  },
  content: {
    top: "50%",
    left: "50%",
    width: "50vw",
    height: "50vh",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "100",
  },
};

const nochangestyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "100",
  },
  content: {
    top: "50%",
    left: "50%",
    width: "50vw",
    height: "50vh",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "100",
  },
};

const failstyle = {
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: "100",
  },
  content: {
    top: "50%",
    left: "50%",
    width: "50vw",
    height: "50vh",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    zIndex: "100",
  },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Reinforcement() {
  const [value, setValue] = React.useState(0);

  let [inventory, setInventory] = React.useState<Item[] | undefined>(undefined);

  let [reinforcing, setReinforcing] = React.useState<Item | undefined>(
    undefined
  );
  let [basicstat, setBasicstat] = React.useState<Status | undefined>(undefined);

  let [cost, setCost] = React.useState<number | undefined>(undefined);

  let [money, setMoney] = React.useState<number | undefined>(undefined);

  let [successopened, setsuccessOpened] = React.useState<boolean>(false);

  let [nochangeopened, setnochangeOpened] = React.useState<boolean>(false);
  let [failopened, setfailOpened] = React.useState<boolean>(false);

  let [sprobability, setsProbability] = React.useState<number | undefined>(
    undefined
  );
  let [nprobability, setnProbability] = React.useState<number | undefined>(
    undefined
  );
  let [fprobability, setfProbability] = React.useState<number | undefined>(
    undefined
  );

  let [sharpness, setSharpness] = React.useState<number | undefined>(undefined);

  let [reincnt, setReincnt] = React.useState<number>(1);

  let [errorMessage, setErrorMessage] = React.useState<string | undefined>("");
  let [improvedStatus, setImprovedStatus] = React.useState<Status | undefined>(
    undefined
  );

  let [myweapon, setMyweapons] = React.useState<Item | undefined>(undefined);
  let [myacce, setMyacce] = React.useState<Item | undefined>(undefined);

  let [en_name, setEn_name] = React.useState("");

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: React.SetStateAction<number>
  ) => {
    setValue(newValue);
  };

  let weaponSlots = [];
  let accessorySlots = [];

  function handleToggle() {
    if (reinforcing !== undefined) {
      fetch("/api/player/inventory/grind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: reinforcing.id }),
      }).then(async (res) => {
        const data = await res.json();
        if (res.status >= 400) {
          alert(data.message);
          return;
        }
        if (data.sharpnessDiff === 1) {
          setsuccessOpened(true);
        } else if (data.sharpnessDiff === 0) {
          setnochangeOpened(true);
        } else if (data.sharpnessDiff === -1) {
          setfailOpened(true);
        }
      });
    }
  }

  React.useEffect(function () {
    let ag = 0;
    fetch("/api/player/inventory/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sortType: ag, sortDir: "DESC" }),
    }).then(async (response) => {
      const data = await response.json();
      setInventory(data.items);
    });
    fetch("/api/player/equipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      if (data.equipments !== undefined) {
        setMyweapons(data.equipments.Weapon);
        setMyacce(data.equipments.Accessory);
      }
    });
  }, []);

  React.useEffect(
    function () {
      if (reinforcing !== undefined) {
        fetch("/api/item/get-one", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: reinforcing.id }),
        }).then(async (res) => {
          const data = await res.json();
          if (data.status !== undefined) {
            setBasicstat(data.status);
          }
          if (data.item !== undefined && data.item.sharpness !== undefined) {
            setSharpness(data.item.sharpness);
          }
          if (
            data.item.enchantItemInfo !== undefined &&
            data.item.enchantItemInfo !== null
          ) {
            setEn_name(data.item.enchantItemInfo.name);
          } else {
            setEn_name("");
          }
        });

        fetch("/api/player/inventory/grind-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId: reinforcing.id }),
        }).then(async (res) => {
          const data = await res.json();
          if (res.status >= 400) {
            setErrorMessage(data.message);
            setImprovedStatus(data.improvedStatus);
          } else {
            setErrorMessage(undefined);
            setCost(data.cost);
            setImprovedStatus(data.improvedStatus);
            if (data.probability !== undefined) {
              setsProbability(data.probability[1]);
              setnProbability(data.probability[0]);
              setfProbability(data.probability[-1]);
            }
          }
        });
        fetch("/api/player/money/current", { method: "POST" })
          .then(async (response) => {
            const data = await response.json();
            setMoney(data.money);
          })
          .catch((error) => console.log("강화 돈 가져오기 에러"));
      }
    },
    [reinforcing, reincnt]
  );

  React.useEffect(
    function () {
      if (cost !== undefined && money !== undefined) {
        if (cost > money) {
          setErrorMessage("재화가 부족합니다.");
        }
      }
    },
    [cost, money]
  );
  let cntweapon = 0;
  let cntacce = 0;

  if (inventory !== undefined) {
    let flagSlots = [];
    let flagSlots2 = [];

    if (myweapon !== undefined) {
    }
    if (myacce !== undefined) {
    }

    for (let i = 0; i < inventory.length; i++) {
      if (
        inventory[i].itemType === ItemType.WEAPON &&
        inventory[i] !== myweapon &&
        inventory[i] !== myacce
      ) {
        let barlength = 0;
        let colr = "";
        let type = -1;
        let lv = -1;
        let star = -1;
        cntweapon++;

        if (
          (inventory[i] as EquipableItem) !== undefined &&
          (inventory[i].itemInfo as EquipableItemInfo) !== undefined
        ) {
          barlength =
            ((inventory[i] as EquipableItem).durability /
              (inventory[i].itemInfo as EquipableItemInfo).durability) *
            6.5;
          type = (inventory[i].itemInfo as EquipableItemInfo).battleType;
          lv = (inventory[i] as EquipableItem).level;
          star = (inventory[i] as EquipableItem).sharpness;

          if (barlength > 3.25) {
            colr = "#82F9B7";
          } else if (barlength > 1.3) {
            colr = "#FFE65A";
          } else {
            colr = "#FF5A5A";
          }
        }
        let bar_length = "";
        bar_length = barlength + "vh";
        flagSlots.push(
          <div>
            <div
              key={i}
              style={{ position: "relative" }}
              className={"rein-box-" + type}
              onClick={function () {
                if (inventory !== undefined && inventory[i] !== undefined) {
                  setReinforcing(inventory[i]);
                  setSharpness((inventory[i] as EquipableItem).sharpness);
                  sessionStorage.setItem("ing", JSON.stringify(reinforcing));
                }
              }}
            >
              {inventory[i] !== undefined &&
              inventory[i].itemInfo !== undefined ? (
                inventory[i] !== reinforcing ? (
                  <img
                    src={
                      "/static/무기 아이콘/" +
                      inventory[i].itemInfo.name +
                      ".png"
                    }
                    className="reinforce-img-box"
                    style={{
                      backgroundColor: "transparent",
                      position: "absolute",
                      borderRadius: "6px",
                      width: "8vh",
                      height: "8vh",
                    }}
                  />
                ) : (
                  <img
                    src={
                      "/static/무기 아이콘/" +
                      inventory[i].itemInfo.name +
                      ".png"
                    }
                    className="reinforce-img-box"
                    style={{
                      backgroundColor: "#FFD700",
                      position: "absolute",
                      borderRadius: "6px",
                      width: "8vh",
                      height: "8vh",
                    }}
                  />
                )
              ) : (
                ""
              )}
              {inventory[i] !== undefined ? (
                <div
                  className="reindurability-bar"
                  style={{ marginTop: "7vh", position: "absolute" }}
                >
                  <div
                    className="reindurability-bar-dynamic"
                    style={{
                      zIndex: "1000",
                      width: bar_length,
                      backgroundColor: colr,
                    }}
                  ></div>
                </div>
              ) : (
                ""
              )}
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(30,30,30,0.6)",
                  width: "4vh",
                  height: "2vh",
                  color: "white",
                  right: "0",
                  textAlign: "center",
                  fontSize: "1vh",
                }}
              >
                Lv.{lv}
              </div>
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(30,30,30,0.6)",
                  width: "4vh",
                  height: "2vh",
                  marginTop: "2vh",
                  color: "yellow",
                  right: "0",
                  textAlign: "center",
                  fontSize: "1vh",
                }}
              >
                ☆{star}
              </div>
            </div>
          </div>
        );
        if (cntweapon % 2 == 0) {
          weaponSlots.push(<div>{flagSlots}</div>);
          flagSlots = [];
        }
      } else if (inventory[i].itemType === ItemType.ACCESSORY) {
        let barlength = 0;
        let colr = "";
        let type = -1;
        let lv = -1;
        let star = -1;
        cntacce++;

        if (
          (inventory[i] as EquipableItem) !== undefined &&
          (inventory[i].itemInfo as EquipableItemInfo) !== undefined
        ) {
          barlength =
            ((inventory[i] as EquipableItem).durability /
              (inventory[i].itemInfo as EquipableItemInfo).durability) *
            6.5;
          type = (inventory[i].itemInfo as EquipableItemInfo).battleType;
          lv = (inventory[i] as EquipableItem).level;
          star = (inventory[i] as EquipableItem).sharpness;
          if (barlength > 3.25) {
            colr = "#82F9B7";
          } else if (barlength > 1.3) {
            colr = "#FFE65A";
          } else {
            colr = "#FF5A5A";
          }
        }
        let bar_length = "";
        bar_length = barlength + "vh";
        flagSlots2.push(
          <div>
            <div
              key={i}
              style={{ position: "relative" }}
              className={"rein-box-" + type}
              onClick={function () {
                if (inventory !== undefined && inventory[i] !== undefined) {
                  setReinforcing(inventory[i]);
                  setSharpness((inventory[i] as EquipableItem).sharpness);
                  sessionStorage.setItem("ing", JSON.stringify(reinforcing));
                }
              }}
            >
              {inventory[i] !== undefined &&
              inventory[i].itemInfo !== undefined ? (
                inventory[i] !== reinforcing ? (
                  <img
                    src={
                      "/static/장신구/" + inventory[i].itemInfo.name + ".png"
                    }
                    className="reinforce-img-box"
                    style={{
                      backgroundColor: "transparent",
                      position: "absolute",
                      borderRadius: "6px",
                      width: "8vh",
                      height: "8vh",
                    }}
                  />
                ) : (
                  <img
                    src={
                      "/static/장신구/" + inventory[i].itemInfo.name + ".png"
                    }
                    className="reinforce-img-box"
                    style={{
                      backgroundColor: "#FFD700",
                      position: "absolute",
                      borderRadius: "6px",
                      width: "8vh",
                      height: "8vh",
                    }}
                  />
                )
              ) : (
                ""
              )}
              {inventory[i] !== undefined ? (
                <div
                  className="reindurability-bar"
                  style={{ marginTop: "7vh", position: "absolute" }}
                >
                  <div
                    className="reindurability-bar-dynamic"
                    style={{
                      zIndex: "1000",
                      width: bar_length,
                      backgroundColor: colr,
                    }}
                  ></div>
                </div>
              ) : (
                ""
              )}
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(30,30,30,0.6)",
                  width: "4vh",
                  height: "2vh",
                  color: "white",
                  right: "0",
                  textAlign: "center",
                  fontSize: "1vh",
                }}
              >
                Lv.{lv}
              </div>
              <div
                style={{
                  position: "absolute",
                  backgroundColor: "rgba(30,30,30,0.6)",
                  width: "4vh",
                  height: "2vh",
                  marginTop: "2vh",
                  color: "yellow",
                  right: "0",
                  textAlign: "center",
                  fontSize: "1vh",
                }}
              >
                ☆{star}
              </div>
            </div>
          </div>
        );

        if (cntacce % 2 == 0) {
          accessorySlots.push(<div>{flagSlots2}</div>);
          flagSlots2 = [];
        }
      }
    }
    weaponSlots.push(<div>{flagSlots}</div>);
    accessorySlots.push(<div>{flagSlots2}</div>);
  }

  let reinforceInfo = [];
  reinforceInfo.push(
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ backgroundColor: "#bdb6f1", height: "4vh" }}>
        <Typography align="center">
          {reinforcing !== undefined && sharpness !== undefined
            ? sharpness < ITEM_SHARPNESS_INSANE_MAX
              ? "날카로움: " + sharpness + " → " + (sharpness + 1)
              : "강화 불가능"
            : null}{" "}
        </Typography>
      </div>

      <div style={{ display: "flex" }}>
        <img src="/static/hp.png" style={{ width: "8vh", height: "8vh" }}></img>
        <div className="reininfo">
          <Typography textAlign="center">
            {basicstat !== undefined ? basicstat.hpmax : "?"}
          </Typography>
        </div>
        <DoubleArrowIcon />
        <div className="reininfo">
          <Typography textAlign="center">
            {improvedStatus !== undefined ? improvedStatus.hpmax : "?"}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "2vh" }}>
        <img
          src="/static/atk.png"
          style={{ width: "8vh", height: "8vh" }}
        ></img>
        <div className="reininfo">
          <Typography textAlign="center">
            {basicstat !== undefined ? basicstat.attack : "?"}
          </Typography>
        </div>
        <DoubleArrowIcon />
        <div className="reininfo">
          <Typography textAlign="center">
            {improvedStatus !== undefined ? improvedStatus.attack : "?"}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "2vh" }}>
        <img
          src="/static/def.png"
          style={{ width: "8vh", height: "8vh" }}
        ></img>
        <div className="reininfo">
          <Typography textAlign="center">
            {basicstat !== undefined ? basicstat.defense : "?"}
          </Typography>
        </div>
        <DoubleArrowIcon />
        <div className="reininfo">
          <Typography textAlign="center">
            {improvedStatus !== undefined ? improvedStatus.defense : "?"}
          </Typography>
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "2vh" }}>
        <img
          src="/static/luk.png"
          style={{ width: "8vh", height: "8vh" }}
        ></img>
        <div className="reininfo">
          <Typography textAlign="center">
            {basicstat !== undefined ? basicstat.luck : "?"}
          </Typography>
        </div>
        <DoubleArrowIcon />
        <div className="reininfo">
          <Typography textAlign="center">
            {improvedStatus !== undefined ? improvedStatus.luck : "?"}
          </Typography>
        </div>
      </div>
    </div>
  );

  if (cntweapon % 2 !== 0) cntweapon++;
  if (cntacce % 2 !== 0) cntacce++;
  let weaponlength = (cntweapon / 2) * 12 + "vh";

  let accelength = (cntacce / 2) * 12 + "vh";

  let itemBox = [];
  itemBox.push(
    <Box sx={{ width: "100vw" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <div>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="무기" {...a11yProps(0)} />
            <Tab label="장신구" {...a11yProps(1)} />
          </Tabs>
        </div>
      </Box>
      <div>
        <TabPanel value={value} index={0}>
          <div
            style={{ width: "100vw", overflowX: "auto", marginTop: "-18px" }}
          >
            <div className="garo-garo" style={{ width: weaponlength }}>
              {weaponSlots}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div
            style={{ width: "100vw", overflowX: "auto", marginTop: "-18px" }}
          >
            <div className="garo-garo" style={{ width: accelength }}>
              {accessorySlots}
            </div>
          </div>
        </TabPanel>
      </div>
    </Box>
  );
  return (
    <ThemeProvider theme={theme}>
      {" "}
      <div style={{ height: "100vh", overflow: "hidden" }}>
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
            <b>장비 강화 </b>
          </Typography>
        </div>
        <div style={{ height: "45vh", display: "flex" }}>
          <Box
            sx={{
              width: "50vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <div className="rein-1">
                {reinforcing !== undefined ? (
                  reinforcing.itemType === 0 ? (
                    <img
                      src={
                        "/static/무기 아이콘/" +
                        reinforcing.itemInfo.name +
                        ".png"
                      }
                      className="rein-1-img"
                    ></img>
                  ) : (
                    <img
                      src={
                        "/static/장신구/" + reinforcing.itemInfo.name + ".png"
                      }
                      className="rein-1-img"
                    ></img>
                  )
                ) : (
                  <Typography textAlign="center">아이템이 없습니다</Typography>
                )}
              </div>
              <Typography textAlign="center">
                {reinforcing !== undefined ? (
                  <div>
                    <a style={{ color: "#bdb6f1" }}>{en_name}</a>{" "}
                    {reinforcing.itemInfo.name}
                  </div>
                ) : (
                  ""
                )}
              </Typography>
            </div>
          </Box>
          <Box sx={{ width: "50vw" }}>{reinforceInfo}</Box>
        </div>
        <Box sx={{ height: "5vh" }}>
          {errorMessage !== undefined ? (
            <div
              style={{
                marginLeft: "4vw",
                width: "92vw",
                height: "5vh",
                borderRadius: "8px",
                backgroundColor: "#cccccc",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography>{errorMessage}</Typography>
            </div>
          ) : (
            <div
              style={{
                marginLeft: "4vw",
                width: "92vw",
                height: "5vh",
                borderRadius: "8px",
                backgroundColor: "#dce4f9",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {reinforcing !== undefined ? (
                <Typography>
                  성공: {sprobability}% 유지: {nprobability}% 하락:
                  {fprobability}%
                </Typography>
              ) : null}
            </div>
          )}
        </Box>
        <Box sx={{ height: "15vh" }}>
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "46vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "2vh",
              }}
            >
              <img
                src="/static/UI 아이콘/코인.png"
                width="50vw"
                height="50vw"
              ></img>
              <div style={{ width: "46vw" }}>
                {reinforcing !== undefined ? (
                  <div>
                    {" "}
                    <Typography textAlign="center">{cost}골드 소모</Typography>
                    <Typography textAlign="center">{money}골드 보유</Typography>
                  </div>
                ) : null}
              </div>
            </div>
            {money !== undefined && cost !== undefined && money >= cost ? (
              <div style={{ marginTop: "2.5vh" }}>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ width: "50vw", height: "10vh" }}
                  onClick={function () {
                    handleToggle();
                  }}
                >
                  {" "}
                  <Typography color="white">강화</Typography>
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: "2.5vh" }}>
                <Button
                  variant="contained"
                  color="error"
                  disabled
                  sx={{ width: "50vw", height: "10vh" }}
                >
                  {" "}
                  <Typography color="white">강화</Typography>
                </Button>
              </div>
            )}
          </div>
        </Box>
        <Box sx={{ height: "30vh", backgroundColor: "lavender" }}>
          {itemBox}
        </Box>
      </div>
      <Modal
        isOpen={successopened}
        style={successstyle}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        onRequestClose={function (e) {
          e.preventDefault();
          setsuccessOpened(false);
          //window.location.reload();
          setReincnt(reincnt + 1);
        }}
      >
        <div className="reiningani0">
          {reinforcing !== undefined ? (
            reinforcing.itemType === 0 ? (
              <div className="rein-2">
                <img
                  src={
                    "/static/무기 아이콘/" + reinforcing.itemInfo.name + ".png"
                  }
                  className="rein-2-img"
                ></img>
              </div>
            ) : (
              <div className="rein-2">
                <img
                  src={"/static/장신구/" + reinforcing.itemInfo.name + ".png"}
                  className="rein-2-img"
                ></img>
              </div>
            )
          ) : null}
        </div>
        <div className="rein-2-text">
          {" "}
          <Typography color="green">성공</Typography>
          <Typography>성공!!</Typography>
        </div>
      </Modal>
      <Modal
        isOpen={nochangeopened}
        style={nochangestyle}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        onRequestClose={function (e) {
          e.preventDefault();
          setnochangeOpened(false);
          //window.location.reload();
          setReincnt(reincnt + 1);
        }}
      >
        <div className="reiningani0">
          {reinforcing !== undefined ? (
            reinforcing.itemType === 0 ? (
              <div className="rein-2">
                <img
                  src={
                    "/static/무기 아이콘/" + reinforcing.itemInfo.name + ".png"
                  }
                  className="rein-2-img"
                ></img>
              </div>
            ) : (
              <div className="rein-2">
                <img
                  src={"/static/장신구/" + reinforcing.itemInfo.name + ".png"}
                  className="rein-2-img"
                ></img>
              </div>
            )
          ) : null}
        </div>
        <div className="rein-2-text">
          {" "}
          <Typography color="#FFD400">유지</Typography>
          <Typography>아무 변화가 없다</Typography>
        </div>
      </Modal>
      <Modal
        isOpen={failopened}
        style={failstyle}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        onRequestClose={function (e) {
          e.preventDefault();
          setfailOpened(false);
          //window.location.reload();
          setReincnt(reincnt + 1);
        }}
      >
        <div className="reiningani0">
          {reinforcing !== undefined ? (
            reinforcing.itemType === 0 ? (
              <div className="rein-2">
                <img
                  src={
                    "/static/무기 아이콘/" + reinforcing.itemInfo.name + ".png"
                  }
                  className="rein-2-img"
                ></img>
              </div>
            ) : (
              <div className="rein-2">
                <img
                  src={"/static/장신구/" + reinforcing.itemInfo.name + ".png"}
                  className="rein-2-img"
                ></img>
              </div>
            )
          ) : null}
        </div>
        <div className="rein-2-text">
          {" "}
          <Typography color="red">하락</Typography>
          <Typography>앗!! 강화 단계가 떨어져버렸다...</Typography>
        </div>
      </Modal>
    </ThemeProvider>
  );
}
