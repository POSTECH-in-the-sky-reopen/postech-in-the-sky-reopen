import type { NextPage } from 'next'
import * as React from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from 'styles/Home.module.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import NavigationIcon from '@mui/icons-material/Navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EquipableItemInfo, WeaponEquipableItemInfo, CoordiItemInfo } from 'src/entity/ItemInfo';
import { Status } from 'src/interfaces/Status';
import { ItemType } from 'src/enums/ItemType';
import { Equipments } from 'src/interfaces/Equipments';
import Confetti from 'react-confetti'
//import useWindowSize from 'react-use/lib/useWindowSize'
import { EquipableItem, Item } from 'src/entity/Item';
import InfoIcon from '@mui/icons-material/Info';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const theme = createTheme({
  typography: {
    fontFamily: 'MaplestoryLight',
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
    secondary: {
      main: '#9987e7'
    }
  },
})


const Home: NextPage = () => {

  const [open, setOpen] = React.useState(false)
  const [open2, setOpen2] = React.useState(false)
  let [toenchant, setToenchant] = React.useState(-1)
  let [enchanting, setEnchanting] = React.useState(-1)
  const [percent, setPercent] = React.useState(0)
  const [yon, setYon] = React.useState("")
  let [en_name, setEn_name] = React.useState("")
  let [sorf, setSorf] = React.useState<boolean | undefined>(undefined)
  let [numi, setNumi] = React.useState(0)
  let [en_detail, setEn_detail] = React.useState<string | undefined>(undefined)
  let [w_stat, setW_stat] = React.useState<Status | undefined>(undefined)
  const handleClose = () => {
    setOpen(false);
    window.location.reload()
  }
  //const { width, height } = useWindowSize()
  const handleClose2 = () => {
    setOpen2(false);
  }

  let buttons = [
    <Button key="one" variant="contained">획득</Button>,
    <Button key="two">레벨</Button>,
    <Button key="three">속성</Button>,
  ];
  const handleClickOpen5 = () => {
    setOpen5(true);
  };
  const handleClosing5 = () => {
    setOpen5(false);
  };
  const [open5, setOpen5] = React.useState(false);

  function handleToggle() {
    if (toenchant !== -1 && enchanting !== -1 && item2 !== undefined && item2[toenchant] !== undefined && item2[enchanting] !== undefined) {

      setNumi(item2[enchanting].id)
      //console.log(numi)
      //console.log(item2[toenchant].id)
      //console.log(item2[enchanting].id)
      fetch("/api/player/enchant", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weaponId: item2[toenchant].id, enchantId: item2[enchanting].id }),
      }).then(async (res) => {
        const data = await res.json();
        setSorf(data.success)
        //console.log(data.success)
        //console.log(data.msessage)
          ;
      });
    }
    else {
      //console.log(toenchant)
      //console.log(enchanting)
      alert("아이템이 없습니다.");
    }
    setOpen(!open);
  }

  function handleToggle2() {

    setOpen2(!open2);
  }

  function showstat() {
    if (item2 !== undefined && item2[toenchant] !== undefined) {


      return (
        <div className='balloon_05'>
          레벨: {(item2[toenchant] as EquipableItem).level} / {(item2[toenchant] as EquipableItem).sharpness}성 / 속성: {battle_type()}
          <br />체: {w_stat?.hpmax} 공: {w_stat?.attack} 방: {w_stat?.defense} 운: {w_stat?.luck}

        </div>
      )
    }
  }

  let [something, setSomething] = React.useState<number | undefined>(undefined)
  let enchantSlots = []
  let [equipments, setEquipments] = React.useState<Equipments | undefined>(undefined)
  let weaponSlots = []
  let accessorySlots2 = []
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  let [item2, setItem2] = React.useState<Item[] | undefined>(undefined)
  let [status, setStatus] = React.useState<Status | undefined>(undefined)

  React.useEffect(function () {
    fetch("/api/player/inventory/items", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sortType:0, sortDir: "ASC"}),
    }).then(async (response) => {
      const data = await response.json()
      setItem2(data.items)
      //console.log(data.message)
    })
  }, [equipments, enchanting])

  React.useEffect(function () {
    if (item2 !== undefined && item2[toenchant] !== undefined) {
      fetch("/api/item/get-one", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: item2[toenchant].id }),
      }).then(async (res) => {
        const data = await res.json()
        //console.log(data.message)
        if (data.status !== undefined) {
          //console.log(data.status)
          setW_stat(data.status)
        }
      }
      )
    }
  }, [toenchant])
  React.useEffect(function () {
    fetch("/api/player/equipments/get", {method: 'POST'}).then(async (response) => {
      const data = await response.json()
      setEquipments(data.equipments)
      //console.log(data.equipments)
    })
  }, [])

  React.useEffect(function () {
    if (navigator.userAgent.match(/Android/i)) {
      window.scrollTo(0, 1);
    }
    else if (navigator.userAgent.match(/iPhone/i)) {
      window.scrollTo(0, 1);
    }
  }, [])

  let w = 0
  let e = 0

  if (item2 !== undefined) {
    for (let i = 0; i < item2?.length; i++) {
      if (item2[i].itemType === ItemType.WEAPON) {
        w++
      }
      else if (item2[i].itemType === ItemType.ENCHANT) {
        e++
        //console.log(e)
      }
    }
  }

  let sths = something

  function result() {
    if (sorf === undefined) {
      return (
        <div></div>
      )
    }
    else if (sorf) {
      return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className='enchant-result'>
          <Confetti />
          </div>
          <div  className='enchant-result' style={{ width: "50vw", height: "25vw", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center",borderRadius:"6px" }}>
            <div className='item-box2' style={{}}>
              <img className='item-img-box' style={{ backgroundColor: "lavender", }} src={item2 !== undefined ? "/static/무기 아이콘/" + item2[toenchant].itemInfo.name + ".png" : ""} />
            </div>
            <div style={{ width: "25vw", color: "black", paddingLeft: "0.5rem" }}>
              인챈트 성공
              <div style={{ fontSize: "3vw" }}>{item2 !== undefined && item2[enchanting] !== undefined ? item2[enchanting].itemInfo.name : ""} {item2 !== undefined && item2[toenchant] !== undefined ? item2[toenchant].itemInfo.name : ""}</div>
            </div>
          </div>
          <img className='enchant-start' src='/static/UI 아이콘/인챈트.png' style={{position:"absolute"}}/>
        </div>
      )
    }
    else {
      return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className='enchant-result-fail'  style={{ width: "11rem", height: "6rem", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center",borderRadius:"6px" }}>
            인챈트 실패
           </div>
           <img className='enchant-start' src='/static/UI 아이콘/인챈트.png' style={{position:"absolute"}}/>
          </div>
      )
    }
  }

  function battle_type() {
    if (item2 !== undefined) {
      if ((item2[toenchant].itemInfo as EquipableItemInfo) !== undefined) {
        let type = (item2[toenchant].itemInfo as EquipableItemInfo).battleType
        if (type === 0) {
          return (
            "친화"
          )
        }
        else if (type === 1) {
          return (
            "감성"
          )
        }
        else if (type === 2) {
          return (
            "계산"
          )
        }
        else if (type === 3) {
          return (
            "논리"
          )
        }
        else if (type === 4) {
          return (
            "암기"
          )
        }
        else {
          return (
            ""
          )
        }
      }
    }
    else {
      return ("")
    }
  }
  let ww = 0
  let ee = 0

  let enchantSlots2 = []
  if (item2 !== undefined) {

    for (let i = 0; i < item2?.length; i++) {
      if (item2[i].itemType === ItemType.WEAPON) {
        let barlength = 0
        let colr = ""
        let type = -1
        let lv = -1
        let eq = ""
        if (i === toenchant) {
          eq = "snow"
        }
        if ((item2[i] as EquipableItem) !== undefined && (item2[i].itemInfo as EquipableItemInfo) !== undefined) {
          barlength = (item2[i] as EquipableItem).durability / (item2[i].itemInfo as EquipableItemInfo).durability * 10
          type = (item2[i].itemInfo as EquipableItemInfo).battleType
          lv = (item2[i] as EquipableItem).level
          if (barlength > 5) {
            colr = "#82F9B7"
          }
          else if (barlength > 2) {
            colr = "#FFE65A"
          }
          else {
            colr = "#FF5A5A"
          }

        }
        let bar_length = ""
        bar_length = barlength + "vw"
        document.documentElement.style.setProperty("--dur-bar-", bar_length)
        if (item2[i].id !== undefined) {
          weaponSlots.push(
            <div
              key={ww}
              onClick={function () {
                if (item2 !== undefined) {
                  toenchant = i
                  if (item2[toenchant] !== undefined) {
                    //console.log(item2[toenchant].id)
                    fetch("/api/item/get-one", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemId: item2[toenchant].id }),
                    }).then(async (res) => {
                      const data = await res.json()
                      //console.log(data.message)
                      if (data.item.enchantItemInfo !== undefined) {
                        if (data.item.enchantItemInfo !== null) {
                          //console.log(data.item.enchantItemInfo.name)
                          setEn_name(data.item.enchantItemInfo.name)
                          setEn_detail(data.item.enchantItemInfo.description)
                          //console.log(data.item.enchantItemInfo.description)
                          //console.log(en_name)
                        }
                        else {
                          setEn_name("")
                          setEn_detail("")
                        }
                      }
                      else {
                        setEn_name("")
                        setEn_detail("")
                      }
                    }
                    )
                  }
                  setToenchant(i)
                }
              }
              }
              className={'item-box-' + type}
              style={{ position: "relative", width: "13vw", height: "13vw", margin: "0.6vw", maxWidth: "13vw", maxHeight: "13vw", borderRadius: "4px", backgroundColor: eq,overflow:"hidden" }}
            >
              {item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/무기 아이콘/' + item2[i].itemInfo.name + '.png'} className='item-img-box-e'
                style={{
                  backgroundColor: "transparent",
                  borderRadius: "4px"
                }} /> : ""
              }
              {item2[i] !== undefined ? <div
                className='durability-bar'
                style={{ marginTop: "-2.5vw", position: "relative", width: "10vw", height: "0.8vw" }}>
                <div
                  className='durability-bar-dynamic'
                  style={{ zIndex: "1000", width: bar_length, backgroundColor: colr, height: "0.8vw" }}

                ></div>
              </div> : ""}
              <div style={{ position: "absolute", backgroundColor: "rgba(30,30,30,0.6)", width: "7vw", height: "3.5vw", color: "white",top:"0", right: "0", textAlign: "center", fontSize: "1.5vw", paddingBottom: "0vw",borderRadius:"2px" }}>
                Lv.{lv}</div>
                
              {equipments !== undefined && equipments.Weapon !== undefined && item2[i].id === equipments.Weapon.id ?
                <div className='enchant-detail' style={{ position: "absolute", width: "13vw", left: "0", height: "4vw", top: "5vw", fontSize: "2vw" }}>장착 중</div> : ""}
            </div>
          )
          ww++
        }
      }
      else if (item2[i].itemType === ItemType.ENCHANT) {
        enchantSlots2.push(
          <div
            key={ee}
            style={{ display: "flex", width: "44vw" }}
            onClick={function () {
              if (item2 !== undefined) {
                let enchanting = i
                fetch("/api/item/get-info", {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ itemId: item2[i].id }),
                }).then(async (res) => {
                  const data = await res.json()
                  if (data.itemInfo !== undefined) {
                    setPercent(data.itemInfo.enchantSuccess)
                  }
                  //console.log(data.message)
                })

                setEnchanting(i)
                //console.log(item2[enchanting].id)
                ////console.log(item2[enchanting].itemInfo)
              }
            }}
          >
            <div
              
              className={enchanting === i ? 'item-box2-e' : 'item-box-e'}
              style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw" }}
            >
              <div><img src="/static/UI 아이콘/인챈트북.png"
                style={{
                  width: "13vw",
                  height: "13vw",
                  objectFit: "cover",
                  borderRadius: "4px"
                  //marginTop: "17.5vw"
                }} /></div></div>
            <div className='item-box-e-detail' style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw", backgroundColor: "#efefef" }}>
              <div>{item2[i] !== undefined && item2[i].itemInfo !== undefined ? item2[i].itemInfo.name : ""}</div></div></div>
        )
        ee++
      }
    }

    let addWslots = w % 3
    for (let i = 0; i < (3 - addWslots + 18); i++) {
      weaponSlots.push(
        <div
          key={ww}
          className='item-box-e'
          style={{ backgroundColor: "lightgray" }}
        ></div>)
      ww++
    }
  }

    // //console.log(5-e)
    for (let i = 0; i < 7; i++) {
      enchantSlots2.push(
        <div
          key={ee}
          style={{ display: "flex", width: "44vw" }}
        >
          <div
            className='item-box-e'
            style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw", backgroundColor: "lightgray" }}
          >
            <div></div></div>
          <div className='item-box-e-detail' style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw" }}>
            <div></div></div></div>
      )
      ee++
    }

  return (
    <ThemeProvider theme={theme}>
    <div style={{ display: "inline-block", height: "100vh", backgroundColor: "#F9FFFF" }} className='all'>

      <div style={{
        height: "2.5rem",
        backgroundColor: "#dcedf8",
        textAlign: "center",
        padding: "0.7rem",
        width: "100vw"
      }}>
        <b>인챈트</b>
      </div>

      <div style={{ position: "absolute", marginLeft: "2vw", marginTop: "-2rem" }}
        onClick={function () {
          window.location.href = "/main";
        }}
      ><ArrowBackIcon /></div>

        <Dialog
          open={open5}
          onClose={handleClosing5}
          aria-labelledby="alert-dialog-title2"
          aria-describedby="alert-dialog-description2"
        >
          <DialogTitle id="alert-dialog-title2">
            인챈트 하시겠습니까?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description2">
              인챈트 성공 시 이전에 있던 인챈트 효과는 사라집니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosing5}>아니오</Button>
            <Button onClick={function () {
              setOpen5(false)
            numi++
            handleToggle()

          }} autoFocus>
              예
            </Button>
          </DialogActions>
        </Dialog>
      <div style={{ display: "flex" }}>
        <div style={{ margin: "5vw"}}>
          <div style={{ width: "35vw", height: "35vw", backgroundColor: "#efefef", }}
            onClick={function () {
              if (toenchant !== -1) {
                setToenchant(-1)
                setEn_name("")
              }
            }}
          >
            {item2 !== undefined && item2[toenchant] !== undefined && item2[toenchant].itemInfo !== undefined ? <img src={'/static/무기 아이콘/' + item2[toenchant].itemInfo.name + '.png'}
              style={{ width: "35vw", height: "35vw", backgroundColor: "transparent", objectFit: "cover" }}>
            </img> : ""}

          </div>
          <div style={{
            width: "35vw", height: "12vw", backgroundColor: "lightgray",
            fontSize: "3.5vw", textAlign: "center", display: "flex",
            flexWrap: "wrap", justifyContent: "center",
            alignItems: "center", padding: "2vw"
          }}>
            <div><a style={{ color: "purple" }}>{en_name !== "" ? en_name : ""}</a> {item2 !== undefined && item2[toenchant] !== undefined && item2[toenchant].itemInfo ? item2[toenchant].itemInfo.name : ""}
            </div>
          </div>
        </div>
        <img src='https://cdn-icons-png.flaticon.com/512/43/43869.png'
          style={{
            width: "10vw",
            height: "10vw",
            objectFit: "cover",
            marginTop: "17.5vw"
          }} />
        <div style={{ margin: "5vw" }}>
          <div style={{ width: "35vw", height: "35vw", backgroundColor: "#efefef" }}
            onClick={function () {
              if (enchanting !== -1) {
                setEnchanting(-1)
              }
            }}
          >
            {item2 !== undefined && item2[enchanting] !== undefined ? <img src={'/static/UI 아이콘/인챈트북.png'}
              style={{ width: "35vw", height: "35vw", backgroundColor: "transparent", objectFit: "cover" }} /> : ""}
          </div>
          <div style={{
            width: "35vw", height: "12vw", backgroundColor: "lightgray",
            fontSize: "3.5vw", textAlign: "center", display: "flex",
            flexWrap: "wrap", justifyContent: "center",
            alignItems: "center", padding: "2vw"
          }}>
            <div>
              {item2 !== undefined && item2[enchanting] !== undefined && item2[enchanting].itemInfo !== undefined ? item2[enchanting].itemInfo.name : ""}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100vw", }}>
          <div className='enchant-detail'>
            <div style={{ width: "35vw", color: "white", fontSize: "3.2vw", textAlign: "center" }}>
              {toenchant !== -1 ? en_detail : ""}
            </div>
          </div>
          <div style={{ width: "15vw" }}></div>
          <div className='enchant-detail'>
            <div style={{ width: "35vw", color: "white", fontSize: "3.2vw", textAlign: "center" }}>
              {item2 !== undefined && item2[enchanting] !== undefined && item2[enchanting].itemInfo !== undefined ? item2[enchanting].itemInfo.description : ""}
            </div></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", }}>

        <div
          style={{ marginTop: "2vw", width: "92vw", height: "11vw", borderRadius: "8px", backgroundColor: "#dce4f9", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}
        ><div style={{ fontSize: "4vw" }}>성공확률: {percent}%</div></div>
      </div>
      {toenchant !== -1 ? <div className='toenchant-item-info' onClick={function () {
        handleToggle2()
      }}><InfoIcon fontSize='medium'
        /></div> : ""}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >{result()}
      </Backdrop>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open2}
        onClick={handleClose2}
      >{showstat()}
      </Backdrop>

      <div style={{ display: "flex", backgroundColor: "lavender", marginTop: "1vh", borderRadius: "5px", width: "100vw"}}>

        <div className='slot-box-e'
        >
          {weaponSlots}
        </div>
        <div className='slot-box-e'
        >{enchantSlots2}
        </div>

      </div>
      <div className='en-bu-box'>

        <div style={{ width: "50vw", height: "15vw", backgroundColor: "#bdb6f1", fontSize: "7.5vw", borderRadius: "10px", textAlign: "center", paddingTop: "3vw", color: "white" }}
          onClick={handleClickOpen5}>인챈트</div>
      </div></div>
      </ThemeProvider>
  );
}

export default Home