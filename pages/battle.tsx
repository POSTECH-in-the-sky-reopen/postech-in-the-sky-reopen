import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextAnimation from "react-animate-text";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MonsterInfo } from 'src/entity/MonsterInfo'
import { Log } from 'src/interfaces/Log'
import { EquipableItem, Item } from 'src/entity/Item'
import 'animate.css';
import { Equipments } from "src/interfaces/Equipments";
import { EquipableItemInfo } from 'src/entity/ItemInfo';
import { ItemType } from 'src/enums/ItemType';
import { Cell } from 'src/entity/Cell'
import Profile2 from './profile2';

function battle_type(monsterInfo: MonsterInfo | undefined) {
  if (monsterInfo !== undefined) {
    let type = monsterInfo.battleType
    if (type === 0) {
      return (
        <img src={'/static/장신구/기본장신구 친화.png'}
          style={{
            width: '100%',
            objectFit: "cover",
          }} />
      )
    }
    else if (type === 1) {
      return (
        <img src={'/static/장신구/기본장신구 감성.png'}
          style={{
            width: '100%',
            objectFit: "cover",
          }} />
      )
    }
    else if (type === 2) {
      return (
        <img src={'/static/장신구/기본장신구 계산.png'}
          style={{
            width: '100%',
            objectFit: "cover",
          }} />
      )
    }
    else if (type === 3) {
      return (
        <img src={'/static/장신구/기본장신구 논리.png'}
          style={{
            width: '100%',
            objectFit: "cover",
          }} />
      )
    }
    else if (type === 4) {
      return (
        <img src={'/static/장신구/기본장신구 암기.png'}
          style={{
            width: '100%',
            objectFit: "cover",
          }} />
      )
    }
    else {
      return (
        ""
      )
    }
  }
  else {
    return ("")
  }
}

function battle_type_player(equipments: Equipments | undefined) {
  if (equipments !== undefined) {
    if (equipments.Weapon !== undefined) {
      let type = (equipments.Weapon.itemInfo as EquipableItemInfo).battleType
      if (type === 0) {
        return (
          <img src={'/static/장신구/기본장신구 친화.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 1) {
        return (
          <img src={'/static/장신구/기본장신구 감성.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 2) {
        return (
          <img src={'/static/장신구/기본장신구 계산.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 3) {
        return (
          <img src={'/static/장신구/기본장신구 논리.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 4) {
        return (
          <img src={'/static/장신구/기본장신구 암기.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else {
        return (
          ""
        )
      }
    }
    else {
      return ("")
    }
  }
  else {
    return ("")
  }
}

function battle_type_player_acc(equipments: Equipments | undefined) {
  if (equipments !== undefined) {
    if (equipments.Accessory !== undefined) {
      let type = (equipments.Accessory.itemInfo as EquipableItemInfo).battleType
      if (type === 0) {
        return (
          <img src={'/static/장신구/기본장신구 친화.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 1) {
        return (
          <img src={'/static/장신구/기본장신구 감성.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 2) {
        return (
          <img src={'/static/장신구/기본장신구 계산.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 3) {
        return (
          <img src={'/static/장신구/기본장신구 논리.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 4) {
        return (
          <img src={'/static/장신구/기본장신구 암기.png'}
            style={{
              width: '100%',
              objectFit: "cover",
            }} />
        )
      }
      else {
        return (
          ""
        )
      }
    }
    else {
      return ("")
    }
  }
  else {
    return ("")
  }
}

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

export default function Battle() {

  const [logopen, setLogopen] = React.useState(false);
  const [itemopen, setItemopen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  let [equipments, setEquipments] = React.useState<Equipments | undefined>(
    undefined
  );
  let [monsterInfo, setMonsterInfo] = React.useState<MonsterInfo | undefined>(undefined)
  let [isPlayerWin, setIsPlayerWin] = React.useState<boolean | undefined>(undefined)
  let [dropItem, setDropItem] = React.useState<Item[] | undefined>(undefined)
  let [battleLog, setBattleLog] = React.useState<Log[][] | undefined>(undefined)
  let [fatigueIncreased, setFatigueIncreased] = React.useState<number | undefined>(undefined)
  let [moneyReceived, setMoneyReceived] = React.useState<number | undefined>(undefined)
  let [playermaxhp, setPlayermaxhp] = React.useState<number | undefined>(undefined)
  let [playerhp, setPlayerhp] = React.useState<number | undefined>(undefined)
  let [monstermaxhp, setMonstermaxhp] = React.useState<number | undefined>(undefined)
  let [monsterhp, setMonsterhp] = React.useState<number | undefined>(undefined)
  let [start, setStart] = React.useState<boolean | undefined>(false)
  let [player, setPlayer] = React.useState<string | undefined>(undefined)
  let [monster, setMonster] = React.useState<string | undefined>(undefined)
  let [cell, setCell] = React.useState<Cell | undefined>(undefined)
  let [brokenItems, setBrokenItems] = React.useState<Item[] | undefined>(undefined)
  let [itemCollections, setItemCollections] = React.useState<string[] | undefined>(undefined)

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setLogopen(true);
    setScroll(scrollType);
  };

  const handleClickClose = () => {
    setLogopen(false);
  };

  const handleOpen = () => {
    setItemopen(true);
    sessionStorage.clear();
  }

  const winhandleClose = () => {
    if (itemCollections !== undefined && itemCollections.length !== 0) {
      for (let i = 0; i < itemCollections.length; i++) {
        if (itemCollections[i] !== "") {
          alert('"' + itemCollections[i] + '"' + ' 아이템 컬렉션에 아이템이 추가되었습니다!')
        }
      }
    }
    setItemopen(false);
  };

  const handleClose = () => {
    setItemopen(false);
  };

  const scrollBottom = () => {
    let div = document.getElementById("id");
    div ? div.scrollTop = div.scrollHeight : null;
  };

  let [monsterPrevAnime, setMonsterPrevAnime] = React.useState('')
  let [playerPrevAnime, setPlayerPrevAnime] = React.useState('')

  function animateCSS_player_start(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      setPlayerPrevAnime(animationName)

      node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  function animateCSS_monster_start(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      setMonsterPrevAnime(animationName)

      node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  function animateCSS_player(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, playerPrevAnime);
      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      setPlayerPrevAnime(animationName)

      node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  function animateCSS_monster(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, monsterPrevAnime);
      node.classList.add(`${prefix}animated`, animationName);

      // When the animation ends, we clean the classes and resolve the Promise
      function handleAnimationEnd(event: any) {
        event.stopPropagation();
        node.classList.remove(`${prefix}animated`, animationName);
        resolve('Animation ended');
      }

      setMonsterPrevAnime(animationName)

      node !== undefined ? node.addEventListener('animationend', handleAnimationEnd, { once: true }) : undefined;
    });
  }

  function animateCSS_player_win(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, playerPrevAnime);
      node.classList.add(`${prefix}animated`, animationName, `${prefix}infinite`);
    });
  }
  function animateCSS_monster_win(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, monsterPrevAnime);
      node.classList.add(`${prefix}animated`, animationName, `${prefix}infinite`);
    });
  }

  function animateCSS_player_lose(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, playerPrevAnime);
      node.classList.add(`${prefix}animated`, animationName, `${prefix}lose`);
    });
  }
  function animateCSS_monster_lose(element: any, animation: any, prefix: string = 'animate__') {
    // We create a Promise and return it
    new Promise((resolve, reject) => {
      const animationName = `${prefix}${animation}`;
      const node = typeof document ? document.querySelector(element) : undefined;
      node.classList.remove(`${prefix}animated`, monsterPrevAnime);
      node.classList.add(`${prefix}animated`, animationName, `${prefix}lose`);
    });
  }

  function no_back() {
    if (typeof window !== undefined)
      window.history.forward();
  }
  React.useEffect(no_back, []);

  function no_reload() {
    if (sessionStorage.length === 0)
      location.href = '/adventure'
  }
  React.useEffect(no_reload, []);

  React.useEffect(function () {
    fetch("/api/player/location/current", {method: 'POST'}).then(async (response) => {
      const data = await response.json()
      setCell(data.cell)
    })
  }, [])

  React.useEffect(function () {
    if (typeof window !== 'undefined') {
      let name = window.sessionStorage.getItem('name')
      let rawdata = window.sessionStorage.getItem('data')
      let equipmentrawdata = window.sessionStorage.getItem('equipments')

      if (equipmentrawdata !== null) {
        let equipmentdata = JSON.parse(equipmentrawdata)
        setEquipments(equipmentdata.equipments)
      }
      if (rawdata !== null) {
        let data = JSON.parse(rawdata)
        setMonsterInfo(data.data.monsterInfo)
        setIsPlayerWin(data.data.isPlayerWin)
        setDropItem(data.data.dropItem)
        setBrokenItems(data.data.brokenItems)
        setBattleLog(data.data.eventLog)
        setFatigueIncreased(data.data.fatigueIncreased)
        setMoneyReceived(data.data.moneyReceived)
        setItemCollections(data.data.itemCollections)

        if (data.data.eventLog !== undefined) {
          setMonstermaxhp(data.data.eventLog[0][0].MonsterStatus.hpmax)
          setPlayermaxhp(data.data.eventLog[0][0].PlayerStatus.hpmax)
          setMonsterhp(data.data.eventLog[0][0].MonsterStatus.hpmax)
          setPlayerhp(data.data.eventLog[0][0].PlayerStatus.hpmax)
        }
        if (name !== null) {
          if (data.data.playerEquipedInfo.enchantItemInfo !== undefined)
            setPlayer(data.data.playerEquipedInfo.enchantItemInfo.name + " " + name)
          else
            setPlayer(name)
        }
        if (data.data.monsterInfo !== undefined) {
          if (data.data.monsterEquipedInfo.enchantItemInfo !== undefined)
            setMonster(data.data.monsterEquipedInfo.enchantItemInfo.name + " " + data.data.monsterInfo.name)
          else
            setMonster(data.data.monsterInfo.name)
        }
      }
    }
  }, [])

  let printmessage = []
  let [logmessage, setLogmessage] = React.useState<React.ReactNode[]>([])
  let [logCheck, setLogCheck] = React.useState<React.ReactNode[]>([])
  let [resultmessage, setResultmessage] = React.useState<React.ReactNode[]>([])
  let printdialog: any[] = []
  let itemlog: any[] = []
  let brokenitemlog: any[] = []

  if (brokenItems !== undefined && brokenItems.length) {
    for (let i = 0; i < brokenItems.length; i++) {
      switch (brokenItems[i].itemType) {
        case ItemType.WEAPON:
          brokenitemlog.push(
            <Box
              key='broken-weapon'
              sx={{
                width: 1,
              }}
            >
              <Stack
                direction='column'
                alignItems='center'
                justifyContent='center'
                spacing={1}
                sx={{
                  width: '100%',
                }}
              >
                <img
                  src={"/static/무기 아이콘/" + brokenItems[i].itemInfo.name + ".png"}
                  style={{
                    border: "solid",
                    borderColor: "#000000",
                    borderRadius: "2rem",
                    backgroundColor: "rgba(192,192,192, 0.6)",
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "inline",
                    filter: 'brightness(0.5)',
                  }}
                />
                <Typography
                  align="center"
                  sx={{
                    color: 'red',
                  }}
                >
                  {brokenItems[i].itemInfo.name}이/가 부서졌다!
                </Typography>
              </Stack>
            </Box>
          )
          break
        case ItemType.ACCESSORY:
          brokenitemlog.push(
            <Box
              key='broken-accessory'
              sx={{
                width: 1,
              }}
            >
              <Stack
                direction='column'
                justifyContent='center'
                alignItems='center'
                spacing={1}
              >
                <img
                  src={"/static/장신구/" + brokenItems[i].itemInfo.name + ".png"}
                  style={{
                    border: "solid",
                    borderColor: "#000000",
                    borderRadius: "2rem",
                    backgroundColor: "rgba(192,192,192, 0.6)",
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "inline",
                    filter: 'brightness(0.5)',
                  }}
                />
                <Typography
                  align="center"
                  sx={{
                    color: 'red',
                    width: '100%',
                  }}
                >
                  {brokenItems[i].itemInfo.name}이/가 부서졌다!
                </Typography>
              </Stack>
            </Box>
          )
          break
      }
    }
  }

  printmessage.push(
    <Typography
      key='emergence1'
      display="inline"
      sx={{
        my: 1,
        color: 'red',
      }}
    >
      {monster !== undefined ? monster : ""}
    </Typography>
  )
  printmessage.push(
    <Typography
      key='emergence2'
      display="inline"
      sx={{
        my: 1,
      }}
    >
      이/가 나타났다!
    </Typography>
  )
  printmessage.push(
    <Typography
      key='emergence3'
      sx={{
        my: 1,
      }}
    >
      {""}
    </Typography>
  )

  let [turn, setTurn] = React.useState(1)


  const clickBox = () => {
    //printlog
    if (battleLog !== undefined) {
      if (turn < battleLog[0].length) {
        let temporarylogmessage = []
        switch (battleLog[0][turn].LogType) {
          case "Attack":
            let attacker = battleLog[0][turn].IsPlayerAttack ? player : monster;
            let defender = battleLog[0][turn].IsPlayerAttack ? monster : player;
            if (battleLog[0][turn].IsPlayerAttack === true) {
              if (battleLog[0][turn].IsDodge) {
                temporarylogmessage.push(
                  <Typography
                    key={'avoid1' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                      color: '#0000FF',
                    }}
                  >
                    {attacker}
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid2' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                    }}
                  >
                    의 공격! 하지만
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid3' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                      color: 'red',
                    }}
                  >
                    {" " + defender}
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid4' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                    }}
                  >
                    은/는 피했다!
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid5' + turn}
                    sx={{
                      my: 1,
                    }}
                  >
                    {""}
                  </Typography>
                )
              }
              else {
                if (battleLog[0][turn].IsCritical) {
                  temporarylogmessage.push(
                    <Typography
                      key={'crit1' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: '#0000FF',
                        fontWeight: 'bold',
                      }}
                    >
                      {attacker}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit2' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      의 치명타 공격!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit3' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit4' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {defender}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit5' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      의 체력이 {battleLog[0][turn].Damage}만큼 감소했다!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit6' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                }
                else {
                  temporarylogmessage.push(
                    <Typography
                      key={'atk1' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: '#0000FF',
                      }}
                    >
                      {attacker}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk2' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                      }}
                    >
                      의 공격!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk3' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk4' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: 'red',
                      }}
                    >
                      {defender}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk5' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                      }}
                    >
                      의 체력이 {battleLog[0][turn].Damage}만큼 감소했다!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk6' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                }
                temporarylogmessage.push(
                  <Typography
                    key={'atk-effect0' + turn}
                    sx={{
                      my: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    {battleLog[0][turn].EffectMessage}
                  </Typography>
                )
              }
            }
            else {
              if (battleLog[0][turn].IsDodge) {
                temporarylogmessage.push(
                  <Typography
                    key={'avoid-mon1' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                      color: 'red',
                    }}
                  >
                    {attacker}
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid-mon2' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                    }}
                  >
                    의 공격! 하지만
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid-mon3' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                      color: '#0000FF',
                    }}
                  >
                    {" " + defender}
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid-mon4' + turn}
                    display="inline"
                    sx={{
                      my: 1,
                    }}
                  >
                    은/는 피했다!
                  </Typography>
                )
                temporarylogmessage.push(
                  <Typography
                    key={'avoid-mon5' + turn}
                    sx={{
                      my: 1,
                    }}
                  >
                    {""}
                  </Typography>
                )
              }
              else {
                if (battleLog[0][turn].IsCritical) {
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon1' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {attacker}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon2' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      의 치명타 공격!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon3' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon4' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: '#0000FF',
                        fontWeight: 'bold',
                      }}
                    >
                      {defender}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon5' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        fontWeight: 'bold',
                      }}
                    >
                      의 체력이 {battleLog[0][turn].Damage}만큼 감소했다!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'crit-mon6' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                }
                else {
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon1' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: 'red',
                      }}
                    >
                      {attacker}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon2' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                      }}
                    >
                      의 공격!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon3' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon4' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                        color: '#0000FF',
                      }}
                    >
                      {defender}
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon5' + turn}
                      display="inline"
                      sx={{
                        my: 1,
                      }}
                    >
                      의 체력이 {battleLog[0][turn].Damage}만큼 감소했다!
                    </Typography>
                  )
                  temporarylogmessage.push(
                    <Typography
                      key={'atk-mon6' + turn}
                      sx={{
                        my: 1,
                      }}
                    >
                      {""}
                    </Typography>
                  )
                }
                temporarylogmessage.push(
                  <Typography
                    key={'monsteratk-effect' + turn}
                    sx={{
                      my: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {battleLog[0][turn].EffectMessage}
                  </Typography>
                )
              }
            }
            break
          case "Effect":
            let EffectOn = battleLog[0][turn].IsEffectOnPlayer ? player : monster;
            if (battleLog[0][turn].IsEffectOnPlayer) {
              temporarylogmessage.push(
                <Typography
                  key={'effecton1' + turn}
                  display="inline"
                  sx={{
                    my: 1,
                    color: '#0000FF',
                    fontWeight: 'bold',
                  }}
                >
                  {EffectOn}
                </Typography>
              )
              temporarylogmessage.push(
                <Typography
                  key={'effecton2' + turn}
                  display="inline"
                  sx={{
                    my: 1,
                    fontWeight: 'bold',
                  }}
                >
                  이/가 {battleLog[0][turn].EffectMessage}
                </Typography>
              )
              temporarylogmessage.push(
                <Typography
                  key={'effecton3' + turn}
                  sx={{
                    my: 1,
                  }}
                >
                  {""}
                </Typography>
              )
            }
            else {
              temporarylogmessage.push(
                <Typography
                  key={'effecton-mon1' + turn}
                  display="inline"
                  sx={{
                    my: 1,
                    color: 'red',
                    fontWeight: 'bold',
                  }}
                >
                  {EffectOn}
                </Typography>
              )
              temporarylogmessage.push(
                <Typography
                  key={'effecton-mon2' + turn}
                  display="inline"
                  sx={{
                    my: 1,
                    fontWeight: 'bold',
                  }}
                >
                  이/가 {battleLog[0][turn].EffectMessage}
                </Typography>
              )
              temporarylogmessage.push(
                <Typography
                  key={'effecton-mon3' + turn}
                  sx={{
                    my: 1,
                  }}
                >
                  {""}
                </Typography>
              )
            }
            break
        }
        if (battleLog[0][turn].LogType === "Effect") {
          if (battleLog[0][turn].IsEffectOnPlayer) {
            animateCSS_player('.player', 'shakeY')
          }
          else {
            animateCSS_monster('.monster', 'shakeY')
          }
        }
        else {
          if (battleLog[0][turn].IsPlayerAttack) {
            if (battleLog[0][turn].IsDodge) {
              animateCSS_monster('.monster', 'flip')
              animateCSS_player('.player', 'tada')
            }
            else {
              if (battleLog[0][turn].IsCritical) {
                animateCSS_monster('.monster', 'wobble')
                animateCSS_player('.player', 'heartBeat')
                setMonsterhp(Math.max(battleLog[0][turn].DefenderStatus.hpmax, 0))
              }
              else {
                animateCSS_monster('.monster', 'shakeX')
                animateCSS_player('.player', 'tada')
                setMonsterhp(Math.max(battleLog[0][turn].DefenderStatus.hpmax, 0))
              }
            }
          }
          else {
            if (battleLog[0][turn].IsDodge) {
              animateCSS_monster('.monster', 'tada')
              animateCSS_player('.player', 'flip')
            }
            else {
              if (battleLog[0][turn].IsCritical) {
                animateCSS_monster('.monster', 'heartBeat')
                animateCSS_player('.player', 'wobble')
                setPlayerhp(Math.max(battleLog[0][turn].DefenderStatus.hpmax, 0))
              }
              else {
                animateCSS_monster('.monster', 'tada')
                animateCSS_player('.player', 'shakeX')
                setPlayerhp(Math.max(battleLog[0][turn].DefenderStatus.hpmax, 0))
              }
            }
          }
        }
        setLogmessage([...logmessage,
        <TextAnimation
          charInterval={30}
          onNextChar={scrollBottom}
        >
          {temporarylogmessage}
        </TextAnimation>])
        setLogCheck([...logCheck, temporarylogmessage])
      }
      else if (turn == battleLog[0].length) {
        let temporarylogmessage = []
        if (isPlayerWin) {
          temporarylogmessage.push(
            < Typography
              key='win1'
              display="inline"
              sx={{
                my: 1,
                color: 'red',
              }
              }
            >
              {monster}
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='win2'
              display="inline"
              sx={{
                my: 1,
              }
              }
            >
              이/가 쓰러졌다!
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='win3'
              sx={{
                my: 1,
              }
              }
            >
              {""}
            </Typography >
          )
        }
        else {
          temporarylogmessage.push(
            < Typography
              key='lose1'
              display='inline'
              sx={{
                my: 1,
                color: '#0000FF',
              }
              }
            >
              {player}
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='lose2'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography >
          )
          temporarylogmessage.push(
            < Typography
              key='lose3'
              sx={{
                my: 1,
              }}
            >
              {""}
            </Typography >
          )
        }
        if (isPlayerWin !== undefined && isPlayerWin) {
          setMonsterhp(0)
          animateCSS_monster_lose('.monster', 'backOutLeft')
          animateCSS_player_win('.player', 'bounce')
        }
        else {
          setPlayerhp(0)
          animateCSS_monster_win('.monster', 'bounce')
          animateCSS_player_lose('.player', 'backOutRight')
        }
        setLogmessage([...logmessage,
        <TextAnimation
          charInterval={30}
          onNextChar={scrollBottom}
        >
          {temporarylogmessage}
        </TextAnimation>])
        setLogCheck([...logCheck, temporarylogmessage])
      }
      else if (turn == battleLog[0].length + 1) {
        let temporaryresultmessage = []
        if (isPlayerWin) {
          temporaryresultmessage.push(
            <Typography
              key='win-result'
              display="inline"
              sx={{
                my: 1,
              }}
            >
              전투 결과,
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win-result1'
              display="inline"
              sx={{
                my: 1,
                color: 'red',
              }}
            >
              {" " + monster}
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win-result2'
              display="inline"
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='win!'
              sx={{
                my: 1,
                fontWeight: 'bold',
              }}
            >
              승리!
            </Typography>
          )
        }
        else {
          temporaryresultmessage.push(
            <Typography
              key='lose-result1'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              전투 결과,
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose-result2'
              display='inline'
              sx={{
                my: 1,
                color: '#0000FF',
              }}
            >
              {" " + player}
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose-result3'
              display='inline'
              sx={{
                my: 1,
              }}
            >
              이/가 쓰러졌다!
            </Typography>
          )
          temporaryresultmessage.push(
            <Typography
              key='lose!'
              sx={{
                my: 1,
                fontWeight: 'bold',
              }}
            >
              패배!
            </Typography>
          )
        }
        setResultmessage([...resultmessage,
        <TextAnimation
          charInterval={30}
          onNextChar={scrollBottom}
        >
          {temporaryresultmessage}
        </TextAnimation>])
      }
      else {
        handleOpen()
      }
    }
    setTurn(turn + 1)
  }
  
  if (isPlayerWin !== undefined && isPlayerWin) {
    if (dropItem !== undefined) {
      if (dropItem?.length === 0) {
        itemlog.push(
          <Typography
            key='no-item'
            align="center"
          >
            아이템을 획득하지 못했다...
          </Typography>
        )
        itemlog.push(
          <Stack
            key='gold1'
            direction='row'
            alignItems='center'
            justifyContent='flex-start'
            spacing={0}
          >
            <img
              src='/static/UI 아이콘/코인.png'
              style={{
                width: '1rem',
                objectFit: "cover",
              }}
            />
            <Typography
              align="center"
            >
              {moneyReceived}골드 획득!
            </Typography>
          </Stack>
        )
      }
      else {
        for (let i = 0; i < dropItem?.length; i++) {
          switch (dropItem[i]?.itemType) {
            case ItemType.WEAPON:
              itemlog.push(
                <img
                  key={'dropweapon' + i}
                  src={"/static/무기 아이콘/" + dropItem[i]?.itemInfo.name + ".png"}
                  style={{
                    border: "solid",
                    borderColor: "#000000",
                    borderRadius: "4rem",
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "inline",
                  }}
                />
              )
              break
            case ItemType.ACCESSORY:
              itemlog.push(
                <img
                  key={'dropaccessory' + i}
                  src={"/static/장신구/" + dropItem[i]?.itemInfo.name + ".png"}
                  style={{
                    border: "solid",
                    borderColor: "#000000",
                    borderRadius: "4rem",
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "inline",
                  }}
                />
              )
              break
            case ItemType.ENCHANT:
              itemlog.push(
                <img
                  key={'dropenchant' + i}
                  src={"/static/UI 아이콘/인챈트북.png"}
                  style={{
                    border: "solid",
                    borderColor: "#000000",
                    borderRadius: "4rem",
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    display: "inline",
                  }}
                />
              )
              break
          }
        }
        for (let i = 0; i < dropItem?.length; i++) {
          itemlog.push(
            <Typography
              key={'item' + i}
              align="center"
            >
              {dropItem[i]?.itemInfo.name}{(dropItem[i] as EquipableItem).level !== undefined ? '(Lv.' + (dropItem[i] as EquipableItem).level + ')' : ""} 획득!
            </Typography>
          )
        }
        itemlog.push(
          <Stack
            key='gold2'
            direction='row'
            alignItems='center'
            justifyContent='center'
            spacing={0}
          >
            <img
              src='/static/UI 아이콘/코인.png'
              style={{
                width: '2rem',
                objectFit: "cover",
              }}
            />
            <Typography
              align="center"
            >
              {moneyReceived}골드 획득!
            </Typography>
          </Stack>
        )
      }
      printdialog.push(
        <Dialog
          key='fatigue1'
          open={itemopen}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">승리</DialogTitle>
          <DialogContent>
            {itemlog}
            <Stack
              direction='row'
              alignItems='flex-start'
              justifyContent='center'
              spacing={1}
            >
              {brokenitemlog}
            </Stack>
            <Typography
              align="center"
              sx={{
                color: 'red',
                mt: 5,
                fontsize: 6,
              }}
            >
              피로도 {fatigueIncreased} 증가!
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClickOpen('paper')}
              sx={{
                width: 0.5,
                bgcolor: '#CCCCCC',
                color: '#000000',
              }}

            >전투 로그 보기</Button>
            <Dialog
              open={logopen}
              onClose={handleClickClose}
              scroll={scroll}
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              <DialogTitle id="scroll-dialog-title">전투 로그</DialogTitle>
              <DialogContent dividers={scroll === 'paper'}>
                {logCheck}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClickClose}
                  sx={{
                    width: 1,
                    bgcolor: '#CCCCCC',
                    color: '#000000',
                  }}
                >확인</Button>
              </DialogActions>
            </Dialog>
            <Button
              onClick={winhandleClose}
              sx={{
                width: 0.5,
                bgcolor: '#CCCCCC',
                color: '#000000',
              }}
              href={
                brokenItems !== undefined && brokenItems.length ?
                  "/myinfo" :
                  "/adventure"
              }
            >확인</Button>
          </DialogActions>
        </Dialog>
      )
    }
  }
  else {
    printdialog.push(
      <Dialog
        key='fatigue2'
        open={itemopen}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">패배</DialogTitle>
        <DialogContent>
          {brokenitemlog}
          <Typography
            align="center"
            sx={{
              fontSize: 24,
              mb: 2,
              color: '#FF3333',
            }}
          >
            패배하였습니다!
          </Typography>
          <Typography
            align="center"
          >
            피로도 {fatigueIncreased} 증가
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClickOpen('paper')}
            sx={{
              width: 0.5,
              bgcolor: '#CCCCCC',
              color: '#000000',
            }}

          >전투 로그 보기</Button>
          <Dialog
            open={logopen}
            onClose={handleClickClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">전투 로그</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              {logCheck}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClickClose}
                sx={{
                  width: 1,
                  bgcolor: '#CCCCCC',
                  color: '#000000',
                }}
              >확인</Button>
            </DialogActions>
          </Dialog>
          <Button
            onClick={handleClose}
            sx={{
              width: 0.5,
              bgcolor: '#CCCCCC',
              color: '#000000',
            }}
            href={
              brokenItems !== undefined && brokenItems.length ?
                "/myinfo" :
                "/adventure"
            }
          >확인</Button>
        </DialogActions>
      </Dialog>
    )
  }

  React.useEffect(function () {
    animateCSS_monster_start('.monster', 'zoomIn')
    animateCSS_player_start('.player', 'zoomIn')
  }, [])

  let mycell = cell !== undefined ? "/static/배경/" + cell.name + ".jpg" : undefined

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Container
          sx={{
            backgroundImage: `url("${mycell}")`,
            height: '100vh',
            width: 'auto',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            p: 0,
            overflow: "hidden",
            position: 'relative',
          }}
        >
          <Container
            sx={{
              height: 1,
              width: 'auto',
              backgroundColor: 'rgba(0,0,0,0.5)',
              p: 0,
            }}
          >
            <Stack
              direction="column"
              spacing={0.5}
              sx={{
                width: '100%',
                position: 'absolute',
                top: '5%',
              }}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={(monsterhp !== undefined ? monsterhp : 100) / (monstermaxhp !== undefined ? monstermaxhp : 100) * 100}
                  color="inherit"
                  sx={{
                    width: '80%',
                    color: '#FF3333',
                    bgcolor: '#E0E0E0',
                    position: 'absolute',
                  }}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2" color="text.secondary" align="center"
                  sx={{
                    color: 'white',
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  }}
                >
                  {monsterhp !== undefined ? monsterhp : monstermaxhp} / {monstermaxhp}
                </Typography>
              </Box>
            </Stack>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1.2}
              sx={{
                width: '100%',
                position: 'absolute',
                top: '10%',
                right: '33%',
              }}
            >
              <Box sx={{ width: '10%' }}>
                <Box sx={{ width: '100%' }}>
                  {battle_type(monsterInfo)}
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/atk.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].MonsterStatus.attack : undefined}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/def.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].MonsterStatus.defense : undefined}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/luk.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].MonsterStatus.luck : undefined}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <img
              className="monster"
              src={monsterInfo !== undefined ? "/static/몬스터/" + monsterInfo.name + ".png" : undefined}
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                position: 'absolute',
                top: '10%',
                right: '30%',
              }}
            />
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1.2}
              sx={{
                width: '100%',
                position: 'absolute',
                top: '10%',
                left: '25%',
              }}
            >
              <Box sx={{ width: '10%' }}>
                <Box sx={{ width: '100%' }}>
                  {battle_type_player(equipments)}
                </Box>
              </Box>
              <Box sx={{ width: '10%' }}>
                <Box sx={{ width: '100%' }}>
                  {battle_type_player_acc(equipments)}
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/atk.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].PlayerStatus.attack : undefined}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/def.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].PlayerStatus.defense : undefined}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ width: '5%' }}>
                <Box sx={{ width: '100%' }}>
                  <img
                    src={"/static/luk.png"}
                    width="100%"
                    object-fit="cover"
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography
                    align="center"
                    sx={{
                      fontSize: 10,
                      color: 'white',
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    {battleLog !== undefined ? battleLog[0][0].PlayerStatus.luck : undefined}
                  </Typography>
                </Box>
              </Box>
            </Stack>
            <div
              className='player'
              style={{
                width: '100%',
                position: "absolute",
                top: '20%',
                left: '30%',
              }}
            >
              <Profile2
                equipments={equipments}
                width={90}
                unit='vw'
              />
            </div>
            <Stack
              direction='column'
              spacing={0.5}
              sx={{
                width: '100%',
                position: 'absolute',
                bottom: '35%'
              }}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  variant="determinate"
                  value={(playerhp !== undefined ? playerhp : 100) / (playermaxhp !== undefined ? playermaxhp : 100) * 100}
                  color="inherit"
                  sx={{
                    width: '80%',
                    color: '#FF3333',
                    bgcolor: '#E0E0E0',
                    position: 'absolute',
                    right: '0%',
                  }}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2" color="text.secondary" align="center"
                  sx={{
                    color: 'white',
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  }}
                >
                  {playerhp !== undefined ? playerhp : playermaxhp} / {playermaxhp}
                </Typography>
              </Box>
            </Stack>

            <Container
              id="id"
              className='box'
              onClick={clickBox}
              sx={{
                width: 1,
                height: 0.3,
                border: 1,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.7)',
                overflow: 'scroll',
                position: 'absolute',
                bottom: '0%',
              }}
            >
              <TextAnimation
                charInterval={30}
                onNextChar={scrollBottom}
              >
                {printmessage}
              </TextAnimation>
              {logmessage}
              {resultmessage}
              {printdialog}
            </Container>
          </Container>
        </Container>
      </React.Fragment>
    </ThemeProvider >
  );
}