import type { NextPage } from 'next'
import React, { SetStateAction } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EquipableItem, Item } from 'src/entity/Item';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { CoordiItemInfo } from 'src/entity/ItemInfo'
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { ItemType } from 'src/enums/ItemType';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Confetti from 'react-confetti'
import { ItemInfo } from 'src/entity/ItemInfo'

type Anchor = 'top' | 'left' | 'bottom' | 'right';




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
})

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}


const Home: NextPage = () => {
  let [gotten, setGotten] = React.useState<ItemInfo | undefined>(undefined)
  const [open, setOpen] = React.useState(false)
  let [faces, setFaces] = React.useState<CoordiItemInfo[] | undefined>(undefined)
  let [hairs, setHairs] = React.useState<CoordiItemInfo[] | undefined>(undefined)
  let [suits, setSuits] = React.useState<CoordiItemInfo[] | undefined>(undefined)
  let [decos, setDecos] = React.useState<CoordiItemInfo[] | undefined>(undefined)
  let [imgname, setImgname] = React.useState<string | undefined>(undefined)
  let [imgname2, setImgname2] = React.useState<string | undefined>(undefined)
  let [collect, setCollect] = React.useState<string | undefined>(undefined)
  let [imgtype, setImgtype] = React.useState("")
  const [value, setValue] = React.useState(0);
  let [money, setMoney] = React.useState(0)
  let [moneyneed, setMoneyneed] = React.useState<number[] | undefined>(undefined)
  const handleChange = (event: React.SyntheticEvent, newValue: SetStateAction<number>) => {
    setValue(newValue);
  };

  React.useEffect(function () {
    fetch("/api/player/money/current", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setMoney(data.money);
    });
  }, []);

  React.useEffect(function () {
    fetch("/api/shop/gacha-cost", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setMoneyneed(data.gachaCost);
    });
  }, []);

  React.useEffect(function () {
    if (navigator.userAgent.match(/Android/i)) {
      window.scrollTo(0, 1);
    }
    else if (navigator.userAgent.match(/iPhone/i)) {
      window.scrollTo(0, 1);
    }
  }, [])

  const handleClose = () => {
    setOpen(false);
    window.location.reload()
  }
  const handleToggleFace = () => {
    let coordiType = ItemType.FACE
    fetch("/api/shop/gacha-coordi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      if (data !== undefined && data.gachaItemInfo !== undefined) {
        setGotten(data.gachaItemInfo)
        setImgname2("/static/??????/??????_" + data.gachaItemInfo.name + ".png")
        setImgname(undefined)
        setImgtype("item-img-box-face")
        if (data.itemCollection !== undefined && data.itemCollection !== null && data.itemCollection != "") {
          alert("?????? ????????? ????????? <" + data.itemCollection + ">??? '" + data.gachaItemInfo.name + "'??? ?????? ?????????????????????!")
        }
      }
      else {
        alert(data.message)
        window.location.reload()
      }
    })

    setOpen(!open);
  }


  React.useEffect(function () {
    let coordiType = ItemType.FACE
    fetch("/api/shop/gacha-list", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      setFaces(data.coordiItemInfos)
    })
  }, [])

  const handleToggleHair = () => {

    let coordiType = ItemType.HAIR
    fetch("/api/shop/gacha-coordi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      if (data.gachaItemInfo !== undefined) {
        setGotten(data.gachaItemInfo)
        if (data.gachaItemInfo.name == "?????? ????????? ??????" || data.gachaItemInfo.name == "?????? ????????? ??????" || data.gachaItemInfo.name == "?????? ????????? ??????" || data.gachaItemInfo.name == "?????? ?????? ??????" || data.gachaItemInfo.name == "?????? ?????? ??????" || data.gachaItemInfo.name == "?????? ?????? ??????") {
          setImgname2("/static/transparent.png")
        }
        else {
          setImgname2("/static/??????/?????????_" + data.gachaItemInfo.name + ".png")
        }
        setImgname("/static/??????/?????????_" + data.gachaItemInfo.name + ".png")

        setImgtype("item-img-box-hair")
        if (data.itemCollection !== undefined && data.itemCollection !== null && data.itemCollection != "") {
          alert("?????? ????????? ????????? <" + data.itemCollection + ">??? '" + data.gachaItemInfo.name + "'??? ?????? ?????????????????????!")
        }
      }
      else {
        alert(data.message)
        window.location.reload()
      }
    })

    setOpen(!open);
  }



  React.useEffect(function () {
    let coordiType = ItemType.HAIR
    fetch("/api/shop/gacha-list", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      setHairs(data.coordiItemInfos)
    })
  }, [])



  const handleToggleSuit = () => {

    let coordiType = ItemType.SUIT
    fetch("/api/shop/gacha-coordi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      if (data.gachaItemInfo !== undefined) {
        setGotten(data.gachaItemInfo)
        setImgname2("/static/??????/???_" + data.gachaItemInfo.name + ".png")
        setImgname(undefined)
        setImgtype("item-img-box-suit")
        if (data.itemCollection !== undefined && data.itemCollection !== null && data.itemCollection != "") {
          alert("?????? ????????? ????????? <" + data.itemCollection + ">??? '" + data.gachaItemInfo.name + "'??? ?????? ?????????????????????!")
        }
      }
      else {
        alert(data.message)
        window.location.reload()
      }
    })

    setOpen(!open);
  }


  React.useEffect(function () {
    let coordiType = ItemType.SUIT
    fetch("/api/shop/gacha-list", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      setSuits(data.coordiItemInfos)
    })
  }, [])


  const handleToggleDeco = () => {

    let coordiType = ItemType.DECO
    fetch("/api/shop/gacha-coordi", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      if (data.gachaItemInfo !== undefined) {
        setGotten(data.gachaItemInfo)
        if (data.gachaItemInfo.layers[0] === "1") { setImgname2("/static/??????/??????_" + data.gachaItemInfo.name + ".png") }
        else {
          setImgname2("/static/??????/????????????_" + data.gachaItemInfo.name + ".png")
        }
        setImgtype("item-img-box-suit2")
        setImgname(undefined)
        if (data.itemCollection !== undefined && data.itemCollection !== null && data.itemCollection != "") {
          alert("?????? ????????? ????????? <" + data.itemCollection + ">??? '" + data.gachaItemInfo.name + "'??? ?????? ?????????????????????!")
        }
      }
      else {
        alert(data.message)
        window.location.reload()
      }
    })

    setOpen(!open);
  }


  React.useEffect(function () {
    let coordiType = ItemType.DECO
    fetch("/api/shop/gacha-list", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ coordiType: coordiType }),
    }).then(async (res) => {
      const data = await res.json()
      setDecos(data.coordiItemInfos)
    })
  }, [])

  function result() {
    if (imgname2 == undefined) {
      <div style={{ width: "54vw", height: "27vw", backgroundColor: "lavender", display: "flex", justifyContent: "center", alignItems: "center", }}>
        ?????????
      </div>
    }

    else {
      return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", }}

        >
          <Confetti />
          <div style={{ width: "54vw", height: "27vw", backgroundColor: "lavender", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px" }}>
            <div style={{ width: "18vw", height: "18vw", margin: "4.5vw", marginRight: "0", borderRadius: "8px", backgroundColor: "snow", position: "relative" }}>
              {imgname2 !== undefined ? <img src={imgname2} className={imgtype} style={{ backgroundColor: "transparent", position: "absolute" }} /> : ""}
              {imgname !== undefined ? <img src={imgname} className={imgtype} style={{ position: "absolute", backgroundColor: "transparent" }} /> : ""}
            </div>
            <div style={{ width: "31vw", color: "black", paddingLeft: "3vw" }}>
              {gotten !== undefined ? gotten.name : ""}
            </div>

          </div>
        </div>
      )
    }
  }

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };



  function balloon() {
    let randNum = Math.floor(Math.random() * (200 - 1 + 1)) + 1
    if (randNum > 180) {
      return (
        "??? ????????? ????????? ?????? ????????? ???????????? ?????????????????????"
      )
    }
    else if (randNum > 170) {
      return (
        "????????? ????????? ??????????????????? ????????? ????????? ????????? ???????????????.(??????)"
      )
    }
    else if (randNum > 100) {
      return (
        "?????? ???????????? ?????? ????????? ???????????? ?????? ??? ??????????????? ???????????? ????????????."
      )
    }
    else if (randNum > 97) {
      return (
        "?????? ??????!"
      )
    }
    else if (randNum > 10) {
      return (
        "????????? ????????? ???????????? ?????? ?????? ????????????..?"
      )
    }
    else if (randNum > 10) {
      return (
        "????????? ???????????? ?????? ????????? ?????????"
      )
    }
    else {
      return (
        "????????? ?????????????????? ????????????"
      )
    }
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: "#e4ab5c", width: "100vw", height: "100vh" }} className='all'>
        <div style={{
          height: "2.5rem",
          backgroundColor: "#dcedf8",
          textAlign: "center",
          padding: "0.8rem"
        }}>
          <b>??????</b>
        </div> <div style={{ position: "absolute", marginLeft: "2vw", marginTop: "-2rem" }}
          onClick={function () {
            window.location.href = "/main";
          }}
        ><ArrowBackIcon /></div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >{result()}
        </Backdrop>

        <div style={{ position: "absolute", top: "2.5rem", width: "100vw", overflow: "hidden", height: "100vh", display: "flex", justifyContent: "center" }}>

          <img style={{ objectFit: "cover", width: "100vw", position: "absolute" }} src='/static/?????? ?????????2.png' />
          <img src="/static/?????????_NPC.png"
            style={{ width: "45vw", objectFit: "contain", position: "absolute", bottom: "7vh", left: "50vw" }} />
          <img className='store-front' style={{ objectFit: "cover", width: "103vw", position: "absolute", bottom: "7vh", left: "-2vw" }} src='/static/?????? ?????????.png' />
          <div className='balloon_03'><div>{balloon()}</div></div>
          <div className='store-buttons' style={{ display: "flex", width: "100vw", flexWrap: "wrap", position: "absolute" }}>
            <img src='/static/????????????.png' onClick={handleToggleFace} style={{ width: "22vw", marginRight: "4vw", fontSize: "4vw", objectFit: "cover" }} />
            <img src='/static/????????????.png' onClick={handleToggleHair} style={{ width: "22vw", marginRight: "4vw", fontSize: "4vw", objectFit: "cover" }} />
            <img src='/static/????????????.png' onClick={handleToggleSuit} style={{ width: "22vw", marginRight: "4vw", fontSize: "4vw", objectFit: "cover" }} />
            <img src='/static/????????????.png' onClick={handleToggleDeco} style={{ width: "22vw", fontSize: "4vw", objectFit: "cover" }} />
          </div>
          <div className='store-money' style={{ display: "flex", justifyContent: "center", width: "28vw", height: "12vw", position: "absolute", alignItems: "center" }}>
            <div style={{ textAlign: "center", color: "snow" }}>
              {money !== undefined ? money + "??????" : "?????????"}</div>
          </div>

          <div className='skew4' style={{ position: "absolute" }}>{moneyneed !== undefined ? moneyneed + "??????!!" : "."}</div>
        </div>


      </div>
    </ThemeProvider>
  )
}

export default Home

