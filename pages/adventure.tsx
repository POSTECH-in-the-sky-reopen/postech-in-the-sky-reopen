import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import ArrowDownwardSharpIcon from '@mui/icons-material/ArrowDownwardSharp';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Cell } from 'src/entity/Cell'
import { Status } from 'src/interfaces/Status'
import { Equipments } from "src/interfaces/Equipments";
import { Graph } from "react-d3-graph";
import { EquipableItem } from "src/entity/Item"
import { EquipableItemInfo } from 'src/entity/ItemInfo';
import { BossMonsterInfo } from 'src/entity/MonsterInfo'
import Profile2 from './profile2';
import ClassRanking from './class-ranking';
import { Siege } from "src/entity/Siege";
import { mapData } from 'src/util/Map';

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

export default function Adventure() {
  let [open, setOpen] = React.useState(false);
  let [typeopen, setTypeOpen] = React.useState(false);
  let [teleportopen, setTeleportOpen] = React.useState(false);
  let [sureopen, setSureOpen] = React.useState(false);
  let [dangeropen, setDangerOpen] = React.useState(false);
  let [fatigueRefreshopen, setFatigueRefreshOpen] = React.useState(false);
  let [noMoneyopen, setNoMoneyOpen] = React.useState(false);
  let [fatigueZeroopen, setFatigueZeroOpen] = React.useState(false);
  let [durabilityOpen, setDurabilityOpen] = React.useState(false);
  let [teleportableToId, setTeleportableToId] = React.useState<number | undefined>(undefined);
  let [loc, setLoc] = React.useState<Cell | undefined>(undefined)
  let [fatigue, setFatigue] = React.useState<number | undefined>(undefined)
  let [status, setStatus] = React.useState<Status | undefined>(undefined)
  let [equipments, setEquipments] = React.useState<Equipments | undefined>(
    undefined
  );
  let [bossMonsterInfo, setBossMonsterInfo] = React.useState<BossMonsterInfo | undefined>(undefined)
  let [playerLevel, setPlayerLevel] = React.useState<number | undefined>(undefined)
  let [name, setName] = React.useState<string | undefined>(undefined)
  let [type, setType] = React.useState<string | undefined>(undefined)
  let [lv, setLv] = React.useState<number | undefined>(undefined)
  let [teleportableTo, setTeleportableTo] = React.useState<Cell[] | undefined>(undefined)
  let [siegeCell, setSiegeCell] = React.useState<Cell[] | undefined>(undefined)
  let [visitableCell, setVisitableCell] = React.useState<Cell[] | undefined>(undefined)
  let [siege, setSiege] = React.useState<Siege | undefined>(undefined)
  let [cost, setCost] = React.useState<Siege | undefined>(undefined)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handletypeOpen = () => {
    setTypeOpen(true);
  };
  const handletypeClose = () => {
    setTypeOpen(false);
  };

  const handleDurabilityOpen = () => {
    setDurabilityOpen(true);
  };
  const handleDurabilityClose = () => {
    setDurabilityOpen(false);
  };

  const handleTeleportOpen = () => {
    setTeleportOpen(true);
    if (loc !== undefined)
      setLv(loc.region.level)
  };

  const handleTeleportClose = () => {
    setTeleportOpen(false);
  };
  const handleSureClose = () => {
    setSureOpen(false);
  };
  const handleDangerClose = () => {
    setDangerOpen(false);
  };
  const handleFatigueRefreshClose = () => {
    setFatigueRefreshOpen(false);
    setOpen(false);
  };
  const handleNoMoneyClose = () => {
    setNoMoneyOpen(false);
  };
  const handleFatigueZeroClose = () => {
    setFatigueZeroOpen(false);
  };

  React.useEffect(function () {
    fetch("/api/player/location/current", { method: 'POST' }).then(async (response) => {
      const data = await response.json()
      setLoc(data.cell)
      if (data.cell.battleType == 0)
        setType('친화')
      else if (data.cell.battleType == 1)
        setType('감성')
      else if (data.cell.battleType == 2)
        setType('계산')
      else if (data.cell.battleType == 3)
        setType('논리')
      else
        setType('암기')
      setLv(data.cell.region.level)
      if (data.cell.isCapturable) {
        fetch("/api/map/get-bossInfo", { method: 'POST' }).then(async (response) => {
          const data = await response.json();
          setBossMonsterInfo(data.bossMonsterInfo);
        });
      }
      if (data.cell.isTeleportable) {
        fetch("/api/map/get-teleportable-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setTeleportableTo(data.cells)
        })
        fetch("/api/map/get-siege-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setSiegeCell(data.cells)
        })
        fetch("/api/map/get-visitable-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setVisitableCell(data.cells)
        })
      }
    })
  }, [])

  React.useEffect(function () {
    fetch("/api/player/status/check", { method: 'POST' }).then(async (response) => {
      const data = await response.json()
      setStatus(data.status)
    })
  }, [])

  React.useEffect(function () {
    fetch("/api/player/fatigue/current", { method: 'POST' }).then(async (response) => {
      const data = await response.json()
      setFatigue(data.fatigue)
    })
  }, [fatigueRefreshopen])

  React.useEffect(function () {
    fetch("/api/player/equipments/get", { method: 'POST' }).then(async (response) => {
      const data = await response.json();
      setEquipments(data.equipments);
      sessionStorage.setItem('equipments', JSON.stringify({ equipments: data.equipments }))
    });
  }, []);

  React.useEffect(function () {
    fetch("/api/player/level", { method: 'POST' }).then(async (response) => {
      const data = await response.json();
      setPlayerLevel(data.level);
    });
  }, []);

  React.useEffect(function () {
    fetch("/api/player/my-siege", { method: 'POST' }).then(async (response) => {
      const data = await response.json();
      setSiege(data.siege);
    });
  }, []);

  React.useEffect(function () {
    fetch("/api/player/fatigue/cost", { method: 'POST' }).then(async (response) => {
      const data = await response.json();
      setCost(data.cost);
    });
  }, []);

  let myweapon = equipments !== undefined ? equipments.Weapon !== undefined ? "/static/무기/" + equipments?.Weapon?.itemInfo.name + ".png" : undefined : undefined
  let myweaponshow = equipments !== undefined ? equipments.Weapon !== undefined ? "/static/무기 아이콘/" + equipments?.Weapon?.itemInfo.name + ".png" : undefined : undefined
  let myweaponname = equipments !== undefined ? equipments.Weapon !== undefined ? equipments?.Weapon?.itemInfo.name : undefined : undefined
  let myaccshow = equipments !== undefined && equipments !== null && equipments.Accessory !== undefined ? '/static/장신구/' + equipments.Accessory.itemInfo.name + '.png' : undefined
  let myaccname = equipments !== undefined && equipments !== null && equipments.Accessory !== undefined ? equipments.Accessory.itemInfo.name : undefined

  function move(cardinalDirection: number) {
    fetch("/api/player/location/move", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardinalDirection: cardinalDirection }),
    }).then(async (res) => {
      const data = await res.json()
      if (res.status >= 400)
        throw new Error(data.message)

      setLoc(data.movedTo)

      if (data.movedTo.battleType == 0)
        setType('친화')
      else if (data.movedTo.battleType == 1)
        setType('감성')
      else if (data.movedTo.battleType == 2)
        setType('계산')
      else if (data.movedTo.battleType == 3)
        setType('논리')
      else
        setType('암기')


      if (data.movedTo.isCapturable) {
        fetch("/api/map/get-bossInfo", { method: 'POST' }).then(async (response) => {
          const data = await response.json();
          setBossMonsterInfo(data.bossMonsterInfo);
        });
      }
      if (data.movedTo.isTeleportable) {
        fetch("/api/map/get-teleportable-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setTeleportableTo(data.cells)
        })
        fetch("/api/map/get-siege-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setSiegeCell(data.cells)
        })
        fetch("/api/map/get-visitable-cells", { method: 'POST' }).then(async (response) => {
          const data = await response.json()
          setVisitableCell(data.cells)
        })
      }
    }).catch(err => {
      console.log(err.message)
      location.reload()
    })
  }

  const moveEast = () => {
    if (loc !== undefined && loc.adjEast !== null) {
      let cardinalDirection = 0
      move(cardinalDirection)
    }
  }

  const moveWest = () => {
    if (loc !== undefined && loc.adjWest !== null) {
      let cardinalDirection = 1
      move(cardinalDirection)
    }
  }

  const moveSouth = () => {
    if (loc !== undefined && loc.adjSouth !== null) {
      let cardinalDirection = 2
      move(cardinalDirection)
    }
  }

  const moveNorth = () => {
    if (loc !== undefined && loc.adjNorth !== null) {
      let cardinalDirection = 3
      move(cardinalDirection)
    }
  }

  React.useEffect(function () {
    fetch("/api/player/name", { method: 'POST' }).then(async (response) => {
      const data = await response.json();
      sessionStorage.setItem('name', data.name)
      setName(data.name)
    });
  }, [])

  const moveToExplore = () => {
    fetch("/api/player/explore", { method: 'POST' }).then(async (res) => {
      const data = await res.json()
      if (res.status >= 400)
        throw new Error(data.message)

      sessionStorage.setItem('data', JSON.stringify({ data: data }))
      if (data.isSupply)
        location.href = "/supply"
      else
        location.href = "/battle"
    }).catch(err => {
      console.log(err.message)
      alert(err.message)
    })
  }

  const moveToSiegeWar = () => {
    fetch("/api/player/siege-war", { method: 'POST' }).then(async (res) => {
      const data = await res.json()
      if (res.status >= 400)
        throw new Error(data.message)

      sessionStorage.setItem('data', JSON.stringify({ data: data }))
      location.href = "/siege-war"

    }).catch(err => {
      console.log(err.message)
      alert(err.message)
    })
  }

  function group() {
    if (loc !== undefined && loc.group !== null && loc.group.num >= 1 && loc.group.num <= 15) {
      return (
        <Typography
          align='center'
          fontSize='x-large'
          sx={{
            width: 1,
            position: 'absolute',
            top: '30%',
            textShadow: '-2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000, 2px 2px #000, 2px -2px #000, -2px 2px #000, -2px -2px #000',
            color: 'white',
          }}
        >
          여기는 {loc.group.num}분반의 점령지 입니다!
        </Typography>
      )
    }
  }

  const data = mapData

  let [height, setHeight] = React.useState<number | undefined>(undefined)
  let [width, setWidth] = React.useState<number | undefined>(undefined)

  React.useEffect(function () {
    setHeight(window.innerHeight - 180.5)
    setWidth(window.innerWidth - 64)
  }, [])

  const myConfig = {
    height: height !== undefined ? height : 1000,
    width: width !== undefined ? width : 1000,
    node: {
      color: "lightgray",
      size: 120,
      fontSize: 8,
      labelPosition: "bottom" as const,
      fontColor: 'white',
    },
    staticGraph: true,
    initialZoom: 1,
    maxZoom: 6,
    minZoom: 0.5,
  };

  React.useEffect(function () {
    let element = document.getElementById('graph-id-graph-container-zoomable')
    element?.setAttribute('transform', `translate(${(-101.20574987219095) - (width !== undefined ? (width - 360) / 2 : 1000)}, 0) scale(1)`)
  }, [lv])

  React.useEffect(function () {
    if (loc === undefined
      || visitableCell === undefined
      || teleportableTo === undefined
      || siegeCell === undefined
    ) {
      return;
    }
    let _lv = lv ? lv : loc.region.level
    for (let region = 0; region < 5; region++) {
      for (let cell = 0; cell < data[region].nodes.length; cell++) {
        if (data[region].nodes[cell].id === loc.name) {
          data[region].nodes[cell] = Object.assign(data[region].nodes[cell], { color: 'red' })
          continue
        }
        let idx = visitableCell.findIndex(node => data[region].nodes[cell].id === node.name)
        if (idx !== -1) {
          let color = 'lightgreen'
          idx = teleportableTo.findIndex(node => data[region].nodes[cell].id === node.name)
          if (idx !== -1) {
            color = 'lightblue'
          }
          idx = siegeCell.findIndex(node => data[region].nodes[cell].id === node.name)
          if (idx !== -1) {
            color = 'blue'
          }
          data[region].nodes[cell] = Object.assign(data[region].nodes[cell], { color: color })
        }
      }
    }
    setLv(_lv)
  }, [lv, loc, visitableCell, teleportableTo, siegeCell])

  React.useEffect(function () {
    let element = document.getElementById('graph-id-graph-container-zoomable')
    element?.setAttribute('transform', `translate(0, 0) scale(1)`)
  }, [lv])

  const onClickNode = function (nodeId: any) {
    let check = false
    for (let i = 0; teleportableTo !== undefined && i < teleportableTo.length; i++) {
      if (nodeId === teleportableTo[i].name) {
        check = true
        setTeleportableToId(teleportableTo[i].id)
      }
    }
    if (check) {
      setSureOpen(true)
    }
    else {
      setDangerOpen(true)
    }
  };

  function battle_type() {
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
    }
    else {
      return ("")
    }
  }

  function weapon_type() {
    if (equipments !== undefined && loc !== undefined) {
      if (equipments.Weapon !== undefined) {
        let weaponType = (equipments.Weapon.itemInfo as EquipableItemInfo).battleType
        let monsterType = loc.battleType
        if (weaponType === 0) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
        }
        else if (weaponType === 1) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
        }
        else if (weaponType === 2) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
        }
        else if (weaponType === 3) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
        }
        else if (weaponType === 4) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
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

  function battle_type_acc() {
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
    }
    else {
      return ("")
    }
  }

  function accessory_type() {
    if (equipments !== undefined && loc !== undefined) {
      if (equipments.Accessory !== undefined) {
        let accType = (equipments.Accessory.itemInfo as EquipableItemInfo).battleType
        let monsterType = loc.battleType
        if (accType === 0) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
        }
        else if (accType === 1) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
        }
        else if (accType === 2) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
        }
        else if (accType === 3) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
        }
        else if (accType === 4) {
          if (monsterType === 0) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                유리
              </Typography>
            )
          }
          else if (monsterType === 1) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우유리
              </Typography>
            )
          }
          else if (monsterType === 2) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                매우불리
              </Typography>
            )
          }
          else if (monsterType === 3) {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                불리
              </Typography>
            )
          }
          else {
            return (
              <Typography
                variant="body2"
                align="center"
                sx={{
                  textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  color: 'white',
                }}
              >
                보통
              </Typography>
            )
          }
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

  function battle_type_map() {
    if (loc !== undefined) {
      let type = loc.battleType
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

  function battle_type_boss() {
    if (bossMonsterInfo !== undefined) {
      let type = bossMonsterInfo.battleType
      if (type === 0) {
        return (
          <img src={'/static/장신구/기본장신구 친화.png'}
            style={{
              width: '40%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 1) {
        return (
          <img src={'/static/장신구/기본장신구 감성.png'}
            style={{
              width: '40%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 2) {
        return (
          <img src={'/static/장신구/기본장신구 계산.png'}
            style={{
              width: '40%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 3) {
        return (
          <img src={'/static/장신구/기본장신구 논리.png'}
            style={{
              width: '40%',
              objectFit: "cover",
            }} />
        )
      }
      else if (type === 4) {
        return (
          <img src={'/static/장신구/기본장신구 암기.png'}
            style={{
              width: '40%',
              objectFit: "cover",
            }} />
        )
      }
      else {
        return (
          "없음"
        )
      }
    }
    else {
      return ("")
    }
  }

  let [warnItem, setWarnItem] = React.useState(false)
  let [warnNotItem, setWarnNotItem] = React.useState(false)

  const warningItemOpen = () => {
    setWarnItem(true)
  }

  const warningItemClose = () => {
    setWarnItem(false)
  }

  const warningNotItemOpen = () => {
    setWarnNotItem(true)
  }

  const warningNotItemClose = () => {
    setWarnNotItem(false)
  }

  if (typeof document !== 'undefined') {
    let btn = document.getElementById("button")

    if (btn !== undefined) {
      btn?.addEventListener("click", function (e) {
        this.setAttribute("disabled", "disabled");
      })
    }
  }

  let mycell = loc !== undefined ? "/static/배경/" + loc.name + ".jpg" : undefined

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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {group()}
          <Box
            sx={{
              width: '100%',
              position: 'fixed',
              bottom: '30%',
              left: '30%',
            }}
          >
            <Profile2
              equipments={equipments}
              width={90}
              unit='vw'
            />
          </Box>

          <Container
            sx={{
              height: "8%",
              width: 1,
              backgroundColor: "#dcedf8",
              p: 0,
            }}>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={0}
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                left: '50%',
                transform: 'translate(-50%, 0)',
                m: 0,
                p: 0,
              }}
            >
              {
                loc !== undefined ?
                  loc.battleType <= 4 && loc.battleType >= 0 ?
                    <Button
                      onClick={handletypeOpen}
                      sx={{
                        width: '15%',
                        m: 0,
                        p: 0,
                      }}
                    >
                      {battle_type_map()}
                    </Button> :
                    "" :
                  undefined
              }
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={0.5}
              >
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  셀 Lv. {loc !== undefined ? loc.level : ""}
                </Typography>
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  내 모험 Lv. {playerLevel !== undefined ? playerLevel : ""}
                </Typography>
              </Stack>
            </Stack>
            <Button
              href="main"
              sx={{
                height: '5vh',
                position: 'absolute',
                left: '3%',
                top: '1.5%',
                color: 'black',
                p: 0,
                m: 0,
              }}
            >
              <ArrowBackSharpIcon />
              <Typography
                sx={{
                  ml: 1,
                  color: 'black',
                }}
              >
                메인으로
              </Typography>
            </Button>
            <Button
              href="myinfo"
              sx={{
                height: '5vh',
                position: 'absolute',
                right: '3%',
                top: '1.5%',
                p: 0,
                m: 0,
              }}
            >
              <img
                src={"/static/UI 아이콘/내 정보.png"}
                height="100%"
                object-fit="cover"
              />
              <Typography
                sx={{
                  color: 'black',
                }}
              >
                내 정보
              </Typography>
            </Button>
          </Container>

          <Dialog
            onClose={handletypeClose}
            open={typeopen}
            fullWidth={true}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">속성 간 상성</DialogTitle>
            <DialogContent>
              <DialogContentText
                id="scroll-dialog-description"
              >
                <Typography>
                  현재 맵에서 등장하는 몬스터 속성: {type}
                </Typography>

                <img
                  src="/static/type.png"
                  width='100%'
                  object-fit="cover"
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handletypeClose}
                sx={{
                  width: 0.5,
                  bgcolor: '#CCCCCC',
                  color: '#000000',
                }}
              >확인</Button>
            </DialogActions>
          </Dialog>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
            sx={{
              width: '100%',
              position: 'absolute',
              top: '10%',
            }}
          >
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                {battle_type()}
              </Box>
              <Box sx={{ width: '100%' }}>
                {weapon_type()}
              </Box>
            </Box>
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                {battle_type_acc()}
              </Box>
              <Box sx={{ width: '100%' }}>
                {accessory_type()}
              </Box>
            </Box>
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                <img
                  src={"/static/hp.png"}
                  width="100%"
                  object-fit="cover"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    color: 'white',
                  }}
                >
                  {status?.hpmax}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                <img
                  src={"/static/atk.png"}
                  width="100%"
                  object-fit="cover"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    color: 'white',
                  }}
                >
                  {status?.attack}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                <img
                  src={"/static/def.png"}
                  width="100%"
                  object-fit="cover"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    color: 'white',
                  }}
                >
                  {status?.defense}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ width: '15%' }}>
              <Box sx={{ width: '100%' }}>
                <img
                  src={"/static/luk.png"}
                  width="100%"
                  object-fit="cover"
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    color: 'white',
                  }}
                >
                  {status?.luck}
                </Typography>
              </Box>
            </Box>
          </Stack>
          {
            loc !== undefined && loc.adjNorth !== null ?
              playerLevel !== undefined && loc.adjNorth.level <= playerLevel + 1 ?
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'fixed',
                    top: '22%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disableRipple
                    sx={{
                      bgcolor: '#dce4f9',
                      color: 'black',
                      borderRadius: 100,
                      zIndex: '100',
                    }}
                    onClick={moveNorth}
                  >
                    <ArrowUpwardSharpIcon />
                  </IconButton>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    {loc.adjNorth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {loc.adjNorth.level})
                  </Typography>
                </Stack>
                :
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'fixed',
                    top: '22%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disabled
                  >
                    <ArrowUpwardSharpIcon />
                  </IconButton>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}                >
                    {loc ? loc.adjNorth.name : ''}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}                >
                    (Lv. {loc ? loc.adjNorth.level : ''})
                  </Typography>
                </Stack>
              :
              <IconButton
                disabled
                sx={{
                  position: 'absolute',
                  top: '22%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  zIndex: '100',
                }}
              >
                <ArrowUpwardSharpIcon />
              </IconButton>
          }
          {
            loc !== undefined && loc.adjWest !== null ?
              playerLevel !== undefined && loc.adjWest.level <= playerLevel + 1 ?
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'absolute',
                    top: '42%',
                    left: '3%',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disableRipple
                    sx={{
                      bgcolor: '#dce4f9',
                      color: 'black',
                      borderRadius: 100,
                      zIndex: '100',
                    }}
                    onClick={moveWest}
                  >
                    <ArrowBackSharpIcon />
                  </IconButton>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    {loc.adjWest.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {loc.adjWest.level})
                  </Typography>
                </Stack>
                :
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-start"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'absolute',
                    top: '42%',
                    left: '3%',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disabled
                  >
                    <ArrowBackSharpIcon />
                  </IconButton>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    {loc.adjWest.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    (Lv. {loc.adjWest.level})
                  </Typography>
                </Stack>
              :
              <IconButton
                disabled
                sx={{
                  position: 'absolute',
                  top: '42%',
                  left: '3%',
                  zIndex: '100',
                }}
              >
                <ArrowBackSharpIcon />
              </IconButton>
          }
          <Typography
            fontSize="xx-large"
            align="center"
            sx={{
              position: 'absolute',
              top: '42%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              textShadow: '-2px 0 #000, 0 2px #000, 2px 0 #000, 0 -2px #000, 2px 2px #000, 2px -2px #000, -2px 2px #000, -2px -2px #000',
              color: 'white',
            }}
          >
            {loc !== undefined ? loc.name : ""}
          </Typography>
          {
            loc !== undefined && loc.adjEast !== null ?
              playerLevel !== undefined && loc.adjEast.level <= playerLevel + 1 ?
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-end"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'absolute',
                    top: '42%',
                    right: '3%',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disableRipple
                    sx={{
                      bgcolor: '#dce4f9',
                      color: 'black',
                      borderRadius: 100,
                    }}
                    onClick={moveEast}
                  >
                    <ArrowForwardSharpIcon />
                  </IconButton>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    {loc.adjEast.name}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {loc.adjEast.level})
                  </Typography>
                </Stack>
                :
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="flex-end"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'absolute',
                    top: '42%',
                    right: '3%',
                    zIndex: '100',
                  }}
                >
                  <IconButton
                    disabled
                  >
                    <ArrowForwardSharpIcon />
                  </IconButton>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    {loc.adjEast.name}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    (Lv. {loc.adjEast.level})
                  </Typography>
                </Stack>
              :
              <IconButton
                disabled
                sx={{
                  position: 'absolute',
                  top: '42%',
                  right: '3%',
                }}
              >
                <ArrowForwardSharpIcon />
              </IconButton>
          }
          {
            loc !== undefined && loc.adjSouth !== null ?
              playerLevel !== undefined && loc.adjSouth.level <= playerLevel + 1 ?
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'fixed',
                    top: '62%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: '200',
                  }}
                >
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}
                  >
                    {loc.adjSouth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}
                  >
                    (Lv. {loc.adjSouth.level})
                  </Typography>
                  <IconButton
                    disableRipple
                    sx={{
                      bgcolor: '#dce4f9',
                      color: 'black',
                      borderRadius: 100,
                    }}
                    onClick={moveSouth}
                  >
                    <ArrowDownwardSharpIcon />
                  </IconButton>
                </Stack>
                :
                <Stack
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  spacing={0}
                  sx={{
                    width: '30%',
                    position: 'fixed',
                    top: '62%',
                    left: '50%',
                    transform: 'translate(-50%, 0)',
                    zIndex: '100',
                  }}
                >
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}
                  >
                    {loc.adjSouth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}
                  >
                    (Lv. {loc.adjSouth.level})
                  </Typography>
                  <IconButton
                    disabled
                  >
                    <ArrowDownwardSharpIcon />
                  </IconButton>
                </Stack>
              :
              <IconButton
                disabled
                sx={{
                  position: 'absolute',
                  top: '62%',
                  left: '50%',
                  transform: 'translate(-50%, 0)',
                  zIndex: '100',
                }}
              >
                <ArrowDownwardSharpIcon />
              </IconButton>
          }
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{
              width: '50%',
              maxWidth: 'sm',
              position: 'fixed',
              bottom: '3%',
              left: '3%',
              zIndex: '100',
            }}
          >
            {
              loc !== undefined ?
                loc.isCapturable ?
                  <ClassRanking /> :
                  undefined :
                undefined
            }
            {
              loc !== undefined ?
                loc.isTeleportable ?
                  <Button
                    variant="contained"
                    fullWidth={true}
                    size="large"
                    sx={{
                      bgcolor: '#bdb6f1',
                      color: '#000000',
                    }}
                    onClick={handleTeleportOpen}
                  >
                    텔레포트 할 수 있다!
                  </Button> :
                  loc.isCapturable ?
                    myweaponshow !== undefined && myaccshow !== undefined ?
                      <Button
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        sx={{
                          bgcolor: '#bdb6f1',
                          color: '#000000',
                        }}
                        onClick={warningItemOpen}
                      >
                        점령전 입장
                      </Button> :
                      <Button
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        sx={{
                          bgcolor: '#bdb6f1',
                          color: '#000000',
                        }}
                        onClick={warningNotItemOpen}
                      >
                        점령전 입장
                      </Button> :
                    fatigue !== undefined && fatigue < 80 ?
                      (equipments !== undefined && equipments.Accessory !== undefined && (equipments.Accessory as EquipableItem).durability <= 10) || (equipments !== undefined && equipments.Weapon !== undefined && (equipments.Weapon as EquipableItem).durability <= 10) ?
                        <Button
                          variant="contained"
                          fullWidth={true}
                          size="large"
                          sx={{
                            bgcolor: '#bdb6f1',
                            color: '#000000',
                          }}
                          onClick={handleDurabilityOpen}
                        >
                          탐색
                        </Button> :
                        <Button
                          id="button"
                          variant="contained"
                          fullWidth={true}
                          size="large"
                          sx={{
                            bgcolor: '#bdb6f1',
                            color: '#000000',
                          }}
                          onClick={moveToExplore}
                        >
                          탐색
                        </Button> :
                      <Button
                        variant="contained"
                        fullWidth={true}
                        size="large"
                        sx={{
                          bgcolor: '#bdb6f1',
                          color: '#000000',
                        }}
                        onClick={handleClickOpen}
                      >
                        탐색
                      </Button> :
                ""
            }
            <Dialog
              onClose={warningItemClose}
              open={warnItem}
              fullWidth={true}
              maxWidth='md'
              aria-labelledby="scroll-dialog-title"
              aria-describedby="scroll-dialog-description"
            >
              <DialogTitle id="scroll-dialog-title">정말 입장하시겠습니까?</DialogTitle>
              <DialogContent>
                <Stack
                  direction='row'
                  sx={{
                    width: '100%',
                  }}>
                  <Stack
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                    sx={{
                      width: '100%',
                    }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                      }}
                    >
                      {bossMonsterInfo !== undefined ? bossMonsterInfo.name : ""}
                    </Typography>
                    <img
                      src={bossMonsterInfo !== undefined ? "/static/몬스터/" + bossMonsterInfo.name + ".png" : ""}
                      width='100%'
                      object-fit="cover"
                    />
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='center'
                      spacing={0.5}
                      sx={{
                        width: '100%',
                      }}>
                      <Typography>
                        속성:
                      </Typography>
                      {battle_type_boss()}
                    </Stack>
                  </Stack>
                  <Stack
                    direction='column'
                    alignItems='center'
                    justifyContent='center'
                    spacing={2}
                    sx={{
                      width: '100%',
                    }}>
                    <Typography
                      sx={{
                        fontSize: 12,
                      }}
                    >
                      착용 아이템
                    </Typography>
                    <Stack
                      direction='row'
                      alignItems='center'
                      justifyContent='center'
                      spacing={1}
                      sx={{
                        width: '100%',
                      }}>
                      <Stack
                        direction='column'
                        alignItems='center'
                        justifyContent='center'
                        spacing={0.5}
                        sx={{
                          width: '100%',
                        }}>
                        <Typography
                          sx={{
                            color: 'black',
                            fontSize: 6,
                          }}
                        >
                          무기
                        </Typography>
                        <img
                          src={myweaponshow}
                          width='100%'
                          object-fit="cover"
                        />
                        <Typography
                          align='center'
                          sx={{
                            color: 'black',
                            fontSize: 6,
                          }}
                        >
                          {myweaponname}
                        </Typography>
                        {battle_type()}
                      </Stack>
                      <Stack
                        direction='column'
                        alignItems='center'
                        justifyContent='center'
                        spacing={0.5}
                        sx={{
                          width: '100%',
                        }}>
                        <Typography
                          sx={{
                            color: 'black',
                            fontSize: 6,
                          }}
                        >
                          장신구
                        </Typography>
                        <img
                          src={myaccshow}
                          width='100%'
                          object-fit="cover"
                        />
                        <Typography
                          align='center'
                          sx={{
                            color: 'black',
                            fontSize: 6,
                          }}
                        >
                          {myaccname}
                        </Typography>
                        {battle_type_acc()}
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                {
                  siege !== undefined && loc?.isCapturable ?
                    <Typography
                      align="center"
                      sx={{
                        fontSize: 8,
                        color: "red",
                        mt: 2,
                      }}
                    >
                      원래 가지고 있던 점령전 공격 정보가 초기화 될 수 있습니다!
                    </Typography> :
                    ""
                }
                {
                  (equipments !== undefined && equipments.Accessory !== undefined && (equipments.Accessory as EquipableItem).durability < 100) || (equipments !== undefined && equipments.Weapon !== undefined && (equipments.Weapon as EquipableItem).durability < 100) ?
                    <Typography
                      align="center"
                      sx={{
                        fontSize: 8,
                        color: "red",
                        mt: 2,
                      }}
                    >
                      장비가 파괴될 수 있습니다! 정말 입장하시겠습니까?
                    </Typography> :
                    ""
                }
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{
                    bgcolor: '#CCCCCC',
                    color: '#000000',
                  }}
                  onClick={moveToSiegeWar}
                >들어간다!</Button>
                <Button
                  onClick={warningItemClose}
                  sx={{
                    bgcolor: '#CCCCCC',
                    color: '#000000',
                  }}
                >잠시 후퇴한다!</Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={warnNotItem}
              onClose={warningNotItemClose}
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  아이템을 착용하고 있지 않습니다!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={warningNotItemClose} autoFocus>
                  확인
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={teleportopen}
              onClose={handleTeleportClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"텔레포트!"}
              </DialogTitle>
              <DialogContent
                sx={{
                  p: 0,
                  overflow: 'hidden',
                }}
              >
                <DialogContentText id="alert-dialog-description">
                  {
                    lv !== undefined && lv >= 2 ?
                      <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        spacing={0}
                        sx={{
                          width: '30%',
                          position: 'absolute',
                          top: '50%',
                          translate: 'transition(0,-50%)',
                          left: '0%',
                        }}
                      >
                        <IconButton
                          sx={{
                            color: '#000000',
                          }}
                          onClick={() => {
                            if (lv !== undefined)
                              setLv(lv - 1)
                          }}
                        >
                          <ArrowBackSharpIcon />
                        </IconButton>
                        <Typography
                          align='center'
                          sx={{
                            color: 'white',
                            textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                          }}
                        >
                          지역 {lv !== undefined ? lv - 1 : ""}
                        </Typography>
                      </Stack> :
                      <IconButton
                        disabled
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          translate: 'transition(0,-50%)',
                          left: '0%',
                        }}
                      >
                        <ArrowBackSharpIcon />
                      </IconButton>
                  }
                  {
                    lv !== undefined && lv <= 4 ?
                      <Stack
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-end"
                        spacing={0}
                        sx={{
                          width: '30%',
                          position: 'absolute',
                          top: '50%',
                          translate: 'transition(0,-50%)',
                          right: '0%',
                        }}
                      >
                        <IconButton
                          sx={{
                            color: '#000000',
                          }}
                          onClick={() => {
                            if (lv !== undefined)
                              setLv(lv + 1)
                          }}
                        >
                          <ArrowForwardSharpIcon />
                        </IconButton>
                        <Typography
                          align='center'
                          sx={{
                            color: 'white',
                            textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                          }}
                        >
                          지역 {lv !== undefined ? lv + 1 : ""}
                        </Typography>
                      </Stack> :
                      <IconButton
                        disabled
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          translate: 'transition(0,-50%)',
                          right: '0%',
                        }}
                      >
                        <ArrowForwardSharpIcon />
                      </IconButton>
                  }
                  <Stack
                    direction="column"
                    spacing={0.5}
                    sx={{
                      width: '100%',
                      position: 'absolute',
                      top: '10%',
                      left: '2%',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={0.5}
                      sx={{
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'red',
                          width: '0.5rem',
                          height: '0.5rem',
                        }}
                      />
                      <Typography
                        sx={{
                          color: 'white',
                          textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        현재 위치
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={0.5}
                      sx={{
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'lightblue',
                          width: '0.5rem',
                          height: '0.5rem',
                        }}
                      />
                      <Typography
                        sx={{
                          color: 'white',
                          textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        텔레포트 가능한 셀
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-start"
                      spacing={0.5}
                      sx={{
                        width: '100%',
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: 'blue',
                          width: '0.5rem',
                          height: '0.5rem',
                        }}
                      />
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          color: 'white',
                          textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                        }}
                      >
                        점령전 셀
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                    }}
                  >
                    <Graph
                      id={`graph-${lv ? lv - 1 : 0}`}
                      data={data[lv ? lv - 1 : 0]}
                      config={myConfig}
                      onClickNode={onClickNode}
                    />
                  </Typography>
                  <Dialog
                    open={dangeropen}
                    onClose={handleDangerClose}
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        텔레포트 할 수 없는 곳입니다!
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDangerClose} autoFocus>
                        확인
                      </Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog
                    open={sureopen}
                    onClose={handleSureClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      {"텔레포트!"}
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        이 지역으로 텔레포트 하시겠습니까?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          fetch("/api/player/location/teleport", {
                            method: "POST",
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ teleportableToId: teleportableToId }),
                          }).then(async (res) => {
                            const data = await res.json()
                            if (res.status >= 400)
                              throw new Error(data.message)

                            setSureOpen(false)
                            setTeleportOpen(false)
                            setLoc(data.movedTo)
                          }).catch(err => {
                            console.log(err.message)
                            alert(err.message)
                          })
                        }}
                      >이동한다!</Button>
                      <Button onClick={handleSureClose} autoFocus>
                        이동하지 않는다.
                      </Button>
                    </DialogActions>
                  </Dialog>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleTeleportClose} autoFocus>
                  확인
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <Typography
                  align='center'
                >
                  {name !== undefined ? name : ""}은/는 피로감에 휩싸여있습니다!
                </Typography>
                <Typography
                  align='center'
                  sx={{
                    fontSize: 10,
                    color: 'red',
                  }}
                >
                  (피로도를 회복하는 데 {cost}의 재화가 소모됩니다!)
                </Typography>

              </DialogContent>
              <DialogActions>
                <Button
                  onClick={function () {
                    fetch("/api/player/fatigue/refresh", { method: 'POST' })
                      .then(async (res) => {
                        if (res.status >= 400) {
                          setNoMoneyOpen(true)
                        }
                        else if (fatigue !== undefined && fatigue == 0) {
                          setFatigueZeroOpen(true)
                        }
                        else
                          setFatigueRefreshOpen(true)
                      })
                  }}
                  sx={{
                    color: 'black',
                  }}
                >
                  피로도 회복하기
                </Button>
                <Dialog
                  open={fatigueRefreshopen}
                  onClose={handleFatigueRefreshClose}
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      성공적으로 회복되었습니다!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleFatigueRefreshClose}
                      autoFocus
                      sx={{
                        color: 'black',
                      }}
                    >
                      확인
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={noMoneyopen}
                  onClose={handleNoMoneyClose}
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      재화가 부족합니다!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleNoMoneyClose}
                      autoFocus
                      sx={{
                        color: 'black',
                      }}
                    >
                      확인
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={fatigueZeroopen}
                  onClose={handleFatigueZeroClose}
                  aria-describedby="alert-dialog-description"
                >
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      피로도가 0입니다!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleFatigueZeroClose}
                      autoFocus
                      sx={{
                        color: 'black',
                      }}
                    >
                      확인
                    </Button>
                  </DialogActions>
                </Dialog>
                <Button onClick={handleClose} autoFocus
                  sx={{
                    color: 'black',
                  }}
                >
                  확인
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={durabilityOpen}
              onClose={handleDurabilityClose}
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <Typography
                  align='center'
                  sx={{
                    fontSize: 12,
                  }}
                >
                  내구도가 10 이하인 장비가 파괴될 수 있습니다.
                </Typography>
                <Typography
                  align='center'
                  sx={{
                    color: 'red',
                    mt: 2,
                    fontSize: 10,
                  }}
                >
                  정말 입장하시겠습니까?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={moveToExplore}
                  sx={{
                    color: 'black',
                  }}
                >
                  들어간다!
                </Button>
                <Button
                  onClick={handleDurabilityClose}
                  sx={{
                    color: 'black',
                  }}
                >
                  돌아간다
                </Button>
              </DialogActions>
            </Dialog>
            <Button
              variant="contained"
              fullWidth={true}
              sx={{
                bgcolor: 'lavender',
                color: '#000000',
              }}
              href="/map"
            >
              <img
                src={"/static/UI 아이콘/지도.png"}
                width="15%"
                object-fit="cover"
                style={{
                  marginRight: 4,
                }}
              />
              <Typography
                sx={{
                  color: 'black',
                }}
              >
                맵 보기
              </Typography>
            </Button>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                {
                  fatigue !== undefined ?
                    <LinearProgress
                      variant="determinate"
                      value={fatigue}
                      color="inherit"
                      sx={{
                        width: '100%',
                        color: '#FFFF00',
                        bgcolor: '#999999',
                      }}
                    /> :
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      color="inherit"
                      sx={{
                        width: '100%',
                        color: '#FFFF00',
                        bgcolor: '#999999',
                      }}
                    />
                }
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: 'white',
                    textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                  }}>
                  {fatigue !== undefined ? fatigue : 100} / 100
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </React.Fragment>
    </ThemeProvider >
  );
}