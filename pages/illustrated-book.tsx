import type { NextPage } from 'next'
import React, { SetStateAction } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { BattleType } from 'src/enums/BattleType';
import { ItemType, Layer } from 'src/enums/ItemType';

const theme = createTheme({
  typography: {
    fontFamily: 'MaplestoryLight',
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
    secondary: {
      main: '#9987e7'
    }
  },
})


const Home: NextPage = () => {

  interface SimpleMonsterInfo {
    encountered: boolean,
    name?: string,
    battleType?: BattleType,
    silhouetteId: string,
  }
  interface SimpleEquipableItemInfo {
    encountered: boolean,
    name?: string,
    description?: string,
    battleType: BattleType,
    silhouetteId: string,
  }

  interface SimpleCoordiItemInfo {
    encountered: boolean,
    coordiType: ItemType,
    name?: string,
    silhouetteId: string,
    layers?: Layer[]
  }

  let [monsters2, setMonsters2] = React.useState<SimpleMonsterInfo[] | undefined>(undefined)
  let [accessorys, setAccessorys] = React.useState<SimpleEquipableItemInfo[] | undefined>(undefined)
  let [weapons, setWeapons] = React.useState<SimpleEquipableItemInfo[] | undefined>(undefined)
  let [coordis, setCoordis] = React.useState<SimpleCoordiItemInfo[] | undefined>(undefined)
  let [m_zIndex, setM_zIndex] = React.useState(10)
  let [w_zIndex, setW_zIndex] = React.useState(3)
  let [a_zIndex, setA_zIndex] = React.useState(2)
  let [c_zIndex, setC_zIndex] = React.useState(1)
  React.useEffect(function () {
    if (navigator.userAgent.match(/Android/i)) {
      window.scrollTo(0, 1);
    }
    else if (navigator.userAgent.match(/iPhone/i)) {
      window.scrollTo(0, 1);
    }
  }, [])
  let socislot = []
  let sensslot = []
  let calcslot = []
  let logcslot = []
  let memrslot = []
  let w_socislot = []
  let w_sensslot = []
  let w_calcslot = []
  let w_logcslot = []
  let w_memrslot = []
  let a_socislot = []
  let a_sensslot = []
  let a_calcslot = []
  let a_logcslot = []
  let a_memrslot = []
  let faceSlots = []
  let hairSlots = []
  let suitSlots = []
  let decoSlots = []
  let seen = 0
  let w_seen = 0
  let a_seen = 0
  let c_seen = 0
  React.useEffect(function () {
    fetch("/api/player/encountered-accessory", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setAccessorys(data.items);
      //console.log(data.items);
      //console.log(data.message);
    })
  }, []);
  React.useEffect(function () {
    fetch("/api/player/encountered-coordi", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setCoordis(data.items);
      //console.log(data.items);
      //console.log(data.message);
    })
  }, []);
  React.useEffect(function () {
    fetch("/api/player/encountered-monsters", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setMonsters2(data.monsters);
      //console.log(monsters2);
      //console.log(data.monsters);
      //console.log(data.message);
    })
  }, []);
  React.useEffect(function () {
    fetch("/api/player/encountered-weapon", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      setWeapons(data.items);
      //console.log(data.items);
      //console.log(data.message);
    })
  }, []);

  function change_zIndex(chosen_one: number): void {
    if (chosen_one === 1) {
      setM_zIndex(10)
      setW_zIndex(3)
      setA_zIndex(2)
      setC_zIndex(1)
    }
    else if (chosen_one === 2) {
      setM_zIndex(3)
      setW_zIndex(10)
      setA_zIndex(3)
      setC_zIndex(2)
    }
    else if (chosen_one === 3) {
      setM_zIndex(2)
      setW_zIndex(3)
      setA_zIndex(10)
      setC_zIndex(3)
    }
    else {
      setM_zIndex(1)
      setW_zIndex(2)
      setA_zIndex(3)
      setC_zIndex(10)
    }
  }

  function index_color(zIndex: number): string {
    if (zIndex === 10) {
      return (
        "#F9FFFF"
      )
    }
    else if (zIndex === 3) {
      return (
        "#c9dddd"
      )
    }
    else if (zIndex === 2) {
      return (
        "#b2c6c6"
      )
    }
    else {
      return (
        "#92a9a9"
      )
    }
  }

  function index_text_color(zIndex: number): string {
    if (zIndex === 10) {
      return (
        "black"
      )
    }
    else {
      return (
        "snow"
      )
    }
  }

  if (coordis !== undefined) {
    for (let i = 0; i < coordis?.length; i++) {
      if (coordis[i].coordiType === ItemType.FACE) {
        let colr = ""
        let mon_name = "/static/코디 실루엣/" + coordis[i].silhouetteId + ".png"
        if (coordis[i].name !== undefined) {
          colr = "#aed5d5"
          mon_name = "/static/코디/얼굴_" + coordis[i].name + ".png"
          c_seen++
        }
        faceSlots.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' style={{ width: "86vw", height: "86vw", marginTop: "-21vw", marginLeft: "-34vw" }} />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{coordis[i].name !== undefined ? coordis[i].name : "???"}</div>
          </div>
        )
      }
      else if (coordis[i].coordiType === ItemType.HAIR) {
        let colr = ""
        let mon_name = "/static/코디 실루엣/" + coordis[i].silhouetteId + ".png"
        let mon_name2 = "/static/코디 실루엣/" + coordis[i].silhouetteId + ".png"
        if (coordis[i].name !== undefined) {
          colr = "#aed5d5"
          mon_name = "/static/코디/앞머리_" + coordis[i].name + ".png"
          mon_name2 = "/static/코디/뒷머리_" + coordis[i].name + ".png"
          c_seen++
        }
        hairSlots.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name2} className='ill-mon-img' style={{ width: "56vw", height: "56vw", marginTop: "-12vw", marginLeft: "-18.5vw", position: "absolute" }} />
            <img src={mon_name} className='ill-mon-img' style={{ width: "56vw", height: "56vw", marginTop: "-12vw", marginLeft: "-18.5vw", position: "absolute" }} />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{coordis[i].name !== undefined ? coordis[i].name : "???"}</div>
          </div>
        )
      }
      else if (coordis[i].coordiType === ItemType.SUIT) {
        let colr = ""
        let mon_name = "/static/코디 실루엣/" + coordis[i].silhouetteId + ".png"
        if (coordis[i].name !== undefined) {
          colr = "#aed5d5"
          mon_name = "/static/코디/옷_" + coordis[i].name + ".png"
          c_seen++
        }
        suitSlots.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' style={{ width: "46vw", height: "46vw", marginTop: "-16vw", marginLeft: "-13vw" }} />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{coordis[i].name !== undefined ? coordis[i].name : "???"}</div>
          </div>
        )
      }
      else if (coordis[i].coordiType === ItemType.DECO) {
        let colr = ""
        let cc = coordis[i]
        let mon_name = "/static/코디 실루엣/" + cc.silhouetteId + ".png"
        if (cc.name !== undefined) {
          colr = "#aed5d5"
          if (cc!==undefined && cc.layers !== undefined && cc.layers.length > 0 && cc.layers[0] !== undefined && cc.layers[0] === '7') {
            mon_name = "/static/코디/오버레이_" + cc.name + ".png"
          }
          else {
            mon_name = "/static/코디/망토_" + cc.name + ".png"
          }
          c_seen++
        }
        decoSlots.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{coordis[i].name !== undefined ? coordis[i].name : "???"}</div>
          </div>
        )
      }
    }
  }

  for (let i = 0; i < 1; i++) {
    hairSlots.push(
      <div
        key={"코디_머리" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }

  for (let i = 0; i < 3; i++) {
    faceSlots.push(
      <div
        key={"코디_얼굴" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }

  for (let i = 0; i < 2; i++) {
    suitSlots.push(
      <div
        key={"코디_옷" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }

  for (let i = 0; i < 3; i++) {
    decoSlots.push(
      <div
        key={"코디_데코" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }

  if (monsters2 !== undefined) {
    for (let i = 0; i < monsters2?.length; i++) {
      if (monsters2[i].battleType === BattleType.SOCI) {//친화
        let colr = ""
        let mon_name = "/static/몬스터 실루엣/" + monsters2[i].silhouetteId + ".png"
        if (monsters2[i].name !== undefined) {
          colr = "#c7d7f9"
          mon_name = "/static/몬스터/" + monsters2[i].name + ".png"
          seen++
        }
        socislot.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{monsters2[i].name !== undefined ? monsters2[i].name : "???"}</div>
          </div>
        )
      }
      else if (monsters2[i].battleType === BattleType.SENS) {//감성
        let colr = ""
        let mon_name = "/static/몬스터 실루엣/" + monsters2[i].silhouetteId + ".png"
        if (monsters2[i].name !== undefined) {
          colr = "#cdf8c3"
          mon_name = "/static/몬스터/" + monsters2[i].name + ".png"
          seen++
        }
        sensslot.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{monsters2[i].name !== undefined ? monsters2[i].name : "???"}</div>
          </div>
        )
      }
      else if (monsters2[i].battleType === BattleType.CALC) {//계산
        let colr = ""
        let mon_name = "/static/몬스터 실루엣/" + monsters2[i].silhouetteId + ".png"
        if (monsters2[i].name !== undefined) {
          colr = "#f6b5b5"
          mon_name = "/static/몬스터/" + monsters2[i].name + ".png"
          seen++
        }
        calcslot.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{monsters2[i].name !== undefined ? monsters2[i].name : "???"}</div>
          </div>
        )
      }
      else if (monsters2[i].battleType === BattleType.LOGC) {//논리
        let colr = ""
        let mon_name = "/static/몬스터 실루엣/" + monsters2[i].silhouetteId + ".png"
        if (monsters2[i].name !== undefined) {
          colr = "#cabff6"
          mon_name = "/static/몬스터/" + monsters2[i].name + ".png"
          seen++
        }
        logcslot.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{monsters2[i].name !== undefined ? monsters2[i].name : "???"}</div>
          </div>
        )
      }
      else if (monsters2[i].battleType === BattleType.MEMR) {//암기
        let colr = ""
        let mon_name = "/static/몬스터 실루엣/" + monsters2[i].silhouetteId + ".png"
        if (monsters2[i].name !== undefined) {
          colr = "#f8eebe"
          mon_name = "/static/몬스터/" + monsters2[i].name + ".png"
          seen++
        }
        memrslot.push(
          <div
            key={i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-mon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{monsters2[i].name !== undefined ? monsters2[i].name : "???"}</div>
          </div>
        )
      }
    }
  }


  if (accessorys !== undefined) {
    for (let i = 0; i < accessorys?.length; i++) {
      if (accessorys[i].battleType === BattleType.SOCI) {//친화
        let colr = ""
        let mon_name = "/static/장신구 실루엣/" + accessorys[i].silhouetteId + ".png"
        if (accessorys[i].name !== undefined) {
          colr = "#c7d7f9"
          mon_name = "/static/장신구/" + accessorys[i].name + ".png"
          a_seen++
        }
        a_socislot.push(
          <div
            key={"장신구" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{accessorys[i].name !== undefined ? accessorys[i].name : "???"}</div>
          </div>
        )
      }
      else if (accessorys[i].battleType === BattleType.SENS) {//감성
        let colr = ""
        let mon_name = "/static/장신구 실루엣/" + accessorys[i].silhouetteId + ".png"
        if (accessorys[i].name !== undefined) {
          colr = "#cdf8c3"
          mon_name = "/static/장신구/" + accessorys[i].name + ".png"
          a_seen++
        }
        a_sensslot.push(
          <div
            key={"장신구" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{accessorys[i].name !== undefined ? accessorys[i].name : "???"}</div>
          </div>
        )
      }
      else if (accessorys[i].battleType === BattleType.CALC) {//계산
        let colr = ""
        let mon_name = "/static/장신구 실루엣/" + accessorys[i].silhouetteId + ".png"
        if (accessorys[i].name !== undefined) {
          colr = "#f6b5b5"
          mon_name = "/static/장신구/" + accessorys[i].name + ".png"
          a_seen++
        }
        a_calcslot.push(
          <div
            key={"장신구" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{accessorys[i].name !== undefined ? accessorys[i].name : "???"}</div>
          </div>
        )
      }
      else if (accessorys[i].battleType === BattleType.LOGC) {//논리
        let colr = ""
        let mon_name = "/static/장신구 실루엣/" + accessorys[i].silhouetteId + ".png"
        if (accessorys[i].name !== undefined) {
          colr = "#cabff6"
          mon_name = "/static/장신구/" + accessorys[i].name + ".png"
          a_seen++
        }
        a_logcslot.push(
          <div
            key={"장신구" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{accessorys[i].name !== undefined ? accessorys[i].name : "???"}</div>
          </div>
        )
      }
      else if (accessorys[i].battleType === BattleType.MEMR) {//암기
        let colr = ""
        let mon_name = "/static/장신구 실루엣/" + accessorys[i].silhouetteId + ".png"
        if (accessorys[i].name !== undefined) {
          colr = "#f8eebe"
          mon_name = "/static/장신구/" + accessorys[i].name + ".png"
          a_seen++
        }
        a_memrslot.push(
          <div
            key={"장신구" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{accessorys[i].name !== undefined ? accessorys[i].name : "???"}</div>
          </div>
        )
      }
    }
  }

  for (let i = 10; i < 12; i++) {
    a_socislot.push(
      <div
        key={"장신구" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    a_sensslot.push(
      <div
        key={"장신구" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    a_calcslot.push(
      <div
        key={"장신구" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    a_logcslot.push(
      <div
        key={"장신구" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    a_memrslot.push(
      <div
        key={"장신구" + i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }

  if (weapons !== undefined) {
    for (let i = 0; i < weapons?.length; i++) {
      if (weapons[i].battleType === BattleType.SOCI) {//친화
        let colr = ""
        let mon_name = "/static/무기 아이콘 실루엣/" + weapons[i].silhouetteId + ".png"
        if (weapons[i].name !== undefined) {
          colr = "#c7d7f9"
          mon_name = "/static/무기 아이콘/" + weapons[i].name + ".png"
          w_seen++
        }
        w_socislot.push(
          <div
            key={"무기" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{weapons[i].name !== undefined ? weapons[i].name : "???"}</div>
          </div>
        )
      }
      else if (weapons[i].battleType === BattleType.SENS) {//감성
        let colr = ""
        let mon_name = "/static/무기 아이콘 실루엣/" + weapons[i].silhouetteId + ".png"
        if (weapons[i].name !== undefined) {
          colr = "#cdf8c3"
          mon_name = "/static/무기 아이콘/" + weapons[i].name + ".png"
          w_seen++
        }
        w_sensslot.push(
          <div
            key={"무기" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{weapons[i].name !== undefined ? weapons[i].name : "???"}</div>
          </div>
        )
      }
      else if (weapons[i].battleType === BattleType.CALC) {//계산
        let colr = ""
        let mon_name = "/static/무기 아이콘 실루엣/" + weapons[i].silhouetteId + ".png"
        if (weapons[i].name !== undefined) {
          colr = "#f6b5b5"
          mon_name = "/static/무기 아이콘/" + weapons[i].name + ".png"
          w_seen++
        }
        w_calcslot.push(
          <div
            key={"무기" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{weapons[i].name !== undefined ? weapons[i].name : "???"}</div>
          </div>
        )
      }
      else if (weapons[i].battleType === BattleType.LOGC) {//논리
        let colr = ""
        let mon_name = "/static/무기 아이콘 실루엣/" + weapons[i].silhouetteId + ".png"
        if (weapons[i].name !== undefined) {
          colr = "#cabff6"
          mon_name = "/static/무기 아이콘/" + weapons[i].name + ".png"
          w_seen++
        }
        w_logcslot.push(
          <div
            key={"무기" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{weapons[i].name !== undefined ? weapons[i].name : "???"}</div>
          </div>
        )
      }
      else if (weapons[i].battleType === BattleType.MEMR) {//암기
        let colr = ""
        let mon_name = "/static/무기 아이콘 실루엣/" + weapons[i].silhouetteId + ".png"
        if (weapons[i].name !== undefined) {
          colr = "#f8eebe"
          mon_name = "/static/무기 아이콘/" + weapons[i].name + ".png"
          w_seen++
        }
        w_memrslot.push(
          <div
            key={"무기" + i}
            className='ill-mon-box'
          >
            <img src={mon_name} className='ill-weapon-img' />
            <div className='ill-mon-name' style={{ backgroundColor: colr }}>{weapons[i].name !== undefined ? weapons[i].name : "???"}</div>
          </div>
        )
      }
    }
  }
  for (let i = 10; i < 12; i++) {
    w_socislot.push(
      <div
        key={i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    w_sensslot.push(
      <div
        key={i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    w_calcslot.push(
      <div
        key={i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    w_logcslot.push(
      <div
        key={i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
    w_memrslot.push(
      <div
        key={i}
        className='ill-mon-box' style={{ backgroundColor: "transparent" }}
      >
      </div>
    )
  }


  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: "#aed5d5", width: "100%" }} className='all3'>
        <div style={{
          height: "2.5rem",
          backgroundColor: "#dcedf8",
          textAlign: "center",
          padding: "0.8rem",
          width: "100vw",
          position: "absolute",
          top: "0",
          zIndex: "100",
        }}>
          <b>도감</b>
        </div>
        <div style={{ position: "absolute", marginLeft: "2vw", top: "0.5rem", zIndex: "101" }}
          onClick={function () {
            window.location.href = "/main";
          }}
        ><ArrowBackIcon /></div>
        <div style={{
          height: "2.5rem",
          backgroundColor: "#dcedf8",
          textAlign: "center",
          padding: "0.8rem",
          width: "100vw"
        }}>
        </div>

        <div className='ill-big-box-index' style={{ zIndex: m_zIndex, backgroundColor: index_color(m_zIndex), color: index_text_color(m_zIndex) }} onClick={function () { change_zIndex(1) }}>몬<br />스<br />터</div>
        <div className='ill-big-box-index2' style={{ zIndex: w_zIndex, backgroundColor: index_color(w_zIndex), color: index_text_color(w_zIndex) }} onClick={function () { change_zIndex(2) }}>무<br />기</div>
        <div className='ill-big-box-index3' style={{ zIndex: a_zIndex, backgroundColor: index_color(a_zIndex), color: index_text_color(a_zIndex) }} onClick={function () { change_zIndex(3) }}>장<br />신<br />구</div>
        <div className='ill-big-box-index4' style={{ zIndex: c_zIndex, backgroundColor: index_color(c_zIndex), color: index_text_color(c_zIndex) }} onClick={function () { change_zIndex(4) }}>코<br />디</div>
        <div className='ill-big-box'
          //몬스터
          style={{ zIndex: m_zIndex }}>

          <div className='ill-how-much'>발견한 몬스터: {seen}/40</div>
          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type0'>친화</div>
            <div className='ill-slot'>
              {socislot}

            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type1'>감성</div>
            <div className='ill-slot'>
              {sensslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type2'>계산</div>
            <div className='ill-slot'>
              {calcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type3'>논리</div>
            <div className='ill-slot'>
              {logcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type4'>암기</div>
            <div className='ill-slot'>
              {memrslot}
            </div>
          </div>

        </div>



        <div className='ill-big-box'
          //무기
          style={{ zIndex: w_zIndex }}
        >
          <div className='ill-how-much'>획득한 무기: {w_seen}/30</div>
          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type0'>친화</div>
            <div className='ill-slot'>
              {w_socislot}

            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type1'>감성</div>
            <div className='ill-slot'>
              {w_sensslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type2'>계산</div>
            <div className='ill-slot'>
              {w_calcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type3'>논리</div>
            <div className='ill-slot'>
              {w_logcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type4'>암기</div>
            <div className='ill-slot'>
              {w_memrslot}
            </div>
          </div>

        </div>

        <div className='ill-big-box'
          //장신구
          style={{ zIndex: a_zIndex }}
        >

          <div className='ill-how-much'>획득한 장신구: {a_seen}/30</div>
          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type0'>친화</div>
            <div className='ill-slot'>
              {a_socislot}

            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type1'>감성</div>
            <div className='ill-slot'>
              {a_sensslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type2'>계산</div>
            <div className='ill-slot'>
              {a_calcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type3'>논리</div>
            <div className='ill-slot'>
              {a_logcslot}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type4'>암기</div>
            <div className='ill-slot'>
              {a_memrslot}
            </div>
          </div>
        </div>

        <div className='ill-big-box2'
          //코디
          style={{ zIndex: c_zIndex }}
        >

          <div className='ill-how-much'>획득한 코디: {c_seen}/62</div>
          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type5'>헤어</div>
            <div className='ill-slot' style={{ height: "125vw" }}>
              {hairSlots}

            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type5'>얼굴</div>
            <div className='ill-slot' style={{ height: "94w" }}>
              {faceSlots}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type5'>의상</div>
            <div className='ill-slot' style={{ height: "187vw" }}>
              {suitSlots}
            </div>
          </div>

          <div style={{ marginBottom: "5vw" }}>
            <div className='ill-type5'>데코</div>
            <div className='ill-slot' style={{ height: "156vw" }}>
              {decoSlots}
            </div>
          </div>
        </div>




      </div>
    </ThemeProvider>
  )
}

export default Home
