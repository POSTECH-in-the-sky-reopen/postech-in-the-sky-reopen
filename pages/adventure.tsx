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
  let [cell, setCell] = React.useState<Cell | undefined>(undefined)
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
    if (cell !== undefined)
      setLv(cell.region.level)
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
      setCell(data.cell)
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

  const moveEast = () => {
    if (cell !== undefined && cell.adjEast !== null) {
      let cardinalDirection = 0
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

        setCell(data.movedTo)

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
  }

  const moveWest = () => {
    if (cell !== undefined && cell.adjWest !== null) {
      let cardinalDirection = 1
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

        setCell(data.movedTo)

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
  }

  const moveSouth = () => {
    if (cell !== undefined && cell.adjSouth !== null) {
      let cardinalDirection = 2
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

        setCell(data.movedTo)

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
  }

  const moveNorth = () => {
    if (cell !== undefined && cell.adjNorth !== null) {
      let cardinalDirection = 3
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

        setCell(data.movedTo)

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

      if (data.isSupply)
        location.href = "/supply"
      else
        location.href = "/battle"
      sessionStorage.setItem('data', JSON.stringify({ data: data }))
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

      location.href = "/siege-war"
      sessionStorage.setItem('data', JSON.stringify({ data: data }))

    }).catch(err => {
      console.log(err.message)
      alert(err.message)
    })
  }

  function group() {
    if (cell !== undefined && cell.group !== null && cell.group.num >= 1 && cell.group.num <= 15) {
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
          여기는 {cell.group.num}분반의 점령지 입니다!
        </Typography>
      )
    }
  }

  const data1 = {
    nodes: [
      { id: "78계단 3", x: 250, y: 460 },
      { id: "지곡연못 2", x: 100, y: 390 },
      { id: "지곡연못 3", x: 150, y: 410 },
      { id: "78계단 2", x: 250, y: 410 },
      { id: "대학원아파트 2", x: 350, y: 410 },
      { id: "대학원아파트 3", x: 400, y: 390 },
      { id: "지곡연못 1", x: 100, y: 340 },
      { id: "78계단 1", x: 250, y: 360 },
      { id: "대학원아파트 1", x: 350, y: 360 },
      { id: "지곡회관 3", x: 100, y: 290 },
      { id: "지곡회관 2", x: 150, y: 310 },
      { id: "지곡회관 1", x: 200, y: 290 },
      { id: "해동78타워 5", x: 250, y: 310 },
      { id: "교수아파트 1", x: 300, y: 290 },
      { id: "교수아파트 2", x: 350, y: 310 },
      { id: "교수아파트 3", x: 400, y: 290 },
      { id: "해동78타워 4", x: 250, y: 260 },
      { id: "해동78타워 3", x: 250, y: 210 },
      { id: "RC 20동 1", x: 300, y: 190 },
      { id: "RC 20동 2", x: 350, y: 210 },
      { id: "RC 20동 3", x: 400, y: 190 },
      { id: "해동78타워 2", x: 250, y: 160 },
      { id: "해동78타워 1", x: 250, y: 110 },
      { id: "RC 21동 3", x: 300, y: 90 },
      { id: "RC 21동 2", x: 350, y: 110 },
      { id: "RC 21동 1", x: 400, y: 90 },
    ],
    links: [
      { source: "78계단 3", target: "78계단 2" },
      { source: "지곡연못 2", target: "지곡연못 3" },
      { source: "지곡연못 2", target: "지곡연못 1" },
      { source: "지곡연못 3", target: "지곡연못 2" },
      { source: "78계단 2", target: "78계단 3" },
      { source: "78계단 2", target: "78계단 1" },
      { source: "대학원아파트 2", target: "대학원아파트 3" },
      { source: "대학원아파트 2", target: "대학원아파트 1" },
      { source: "대학원아파트 3", target: "대학원아파트 2" },
      { source: "지곡연못 1", target: "지곡연못 2" },
      { source: "지곡연못 1", target: "지곡회관 3" },
      { source: "78계단 1", target: "78계단 2" },
      { source: "78계단 1", target: "해동78타워 5" },
      { source: "대학원아파트 1", target: "대학원아파트 2" },
      { source: "대학원아파트 1", target: "교수아파트 2" },
      { source: "지곡회관 3", target: "지곡회관 2" },
      { source: "지곡회관 3", target: "지곡연못 1" },
      { source: "지곡회관 2", target: "지곡회관 1" },
      { source: "지곡회관 2", target: "지곡회관 3" },
      { source: "지곡회관 1", target: "해동78타워 5" },
      { source: "지곡회관 1", target: "지곡회관 2" },
      { source: "해동78타워 5", target: "교수아파트 1" },
      { source: "해동78타워 5", target: "지곡회관 1" },
      { source: "해동78타워 5", target: "78계단 1" },
      { source: "해동78타워 5", target: "해동78타워 4" },
      { source: "교수아파트 1", target: "교수아파트 2" },
      { source: "교수아파트 1", target: "해동78타워 5" },
      { source: "교수아파트 2", target: "교수아파트 3" },
      { source: "교수아파트 2", target: "교수아파트 1" },
      { source: "교수아파트 2", target: "대학원아파트 1" },
      { source: "교수아파트 3", target: "교수아파트 2" },
      { source: "해동78타워 4", target: "해동78타워 5" },
      { source: "해동78타워 4", target: "해동78타워 3" },
      { source: "해동78타워 3", target: "RC 20동 1" },
      { source: "해동78타워 3", target: "해동78타워 4" },
      { source: "해동78타워 3", target: "해동78타워 2" },
      { source: "RC 20동 1", target: "RC 20동 2" },
      { source: "RC 20동 1", target: "해동78타워 3" },
      { source: "RC 20동 2", target: "RC 20동 3" },
      { source: "RC 20동 2", target: "RC 20동 1" },
      { source: "RC 20동 3", target: "RC 20동 2" },
      { source: "해동78타워 2", target: "해동78타워 3" },
      { source: "해동78타워 2", target: "해동78타워 1" },
      { source: "해동78타워 1", target: "RC 21동 3" },
      { source: "해동78타워 1", target: "해동78타워 2" },
      { source: "RC 21동 3", target: "RC 21동 2" },
      { source: "RC 21동 3", target: "해동78타워 1" },
      { source: "RC 21동 2", target: "RC 21동 1" },
      { source: "RC 21동 2", target: "RC 21동 3" },
      { source: "RC 21동 1", target: "RC 21동 2" },
    ],
  };

  const data2 = {
    nodes: [
      { id: "철강대학원 3", x: 900, y: 440 },
      { id: "체인지업그라운드 3", x: 600, y: 390 },
      { id: "체인지업그라운드 2", x: 650, y: 410 },
      { id: "생명공학연구센터 2", x: 750, y: 410 },
      { id: "생명공학연구센터 3", x: 800, y: 390 },
      { id: "철강대학원 2", x: 900, y: 390 },
      { id: "체인지업그라운드 1", x: 650, y: 360 },
      { id: "생명공학연구센터 1", x: 750, y: 360 },
      { id: "철강대학원 1", x: 900, y: 340 },
      { id: "박태준학술정보관 3", x: 600, y: 290 },
      { id: "박태준학술정보관 2", x: 650, y: 310 },
      { id: "박태준학술정보관 1", x: 700, y: 290 },
      { id: "동문 1", x: 750, y: 310 },
      { id: "한국로봇융합연구원 1", x: 800, y: 290 },
      { id: "한국로봇융합연구원 2", x: 850, y: 310 },
      { id: "한국로봇융합연구원 3", x: 900, y: 290 },
      { id: "동문 2", x: 750, y: 260 },
      { id: "C5 2", x: 650, y: 210 },
      { id: "C5 1", x: 700, y: 190 },
      { id: "동문 3", x: 750, y: 210 },
      { id: "C5 3", x: 650, y: 160 },
      { id: "동문 4", x: 750, y: 160 },
      { id: "지곡연구동 3", x: 850, y: 160 },
      { id: "동문 5", x: 750, y: 110 },
      { id: "지곡연구동 1", x: 800, y: 90 },
      { id: "지곡연구동 2", x: 850, y: 110 },
    ],
    links: [
      { source: "철강대학원 3", target: "철강대학원 2" },
      { source: "체인지업그라운드 3", target: "체인지업그라운드 2" },
      { source: "체인지업그라운드 2", target: "체인지업그라운드 3" },
      { source: "체인지업그라운드 2", target: "체인지업그라운드 1" },
      { source: "생명공학연구센터 2", target: "생명공학연구센터 3" },
      { source: "생명공학연구센터 2", target: "생명공학연구센터 1" },
      { source: "생명공학연구센터 3", target: "생명공학연구센터 2" },
      { source: "철강대학원 2", target: "철강대학원 3" },
      { source: "철강대학원 2", target: "철강대학원 1" },
      { source: "체인지업그라운드 1", target: "체인지업그라운드 2" },
      { source: "체인지업그라운드 1", target: "박태준학술정보관 2" },
      { source: "생명공학연구센터 1", target: "생명공학연구센터 2" },
      { source: "생명공학연구센터 1", target: "동문 1" },
      { source: "철강대학원 1", target: "철강대학원 2" },
      { source: "철강대학원 1", target: "한국로봇융합연구원 3" },
      { source: "박태준학술정보관 3", target: "박태준학술정보관 2" },
      { source: "박태준학술정보관 2", target: "박태준학술정보관 1" },
      { source: "박태준학술정보관 2", target: "박태준학술정보관 3" },
      { source: "박태준학술정보관 2", target: "체인지업그라운드 1" },
      { source: "박태준학술정보관 1", target: "동문 1" },
      { source: "박태준학술정보관 1", target: "박태준학술정보관 2" },
      { source: "동문 1", target: "한국로봇융합연구원 1" },
      { source: "동문 1", target: "박태준학술정보관 1" },
      { source: "동문 1", target: "생명공학연구센터 1" },
      { source: "동문 1", target: "동문 2" },
      { source: "한국로봇융합연구원 1", target: "한국로봇융합연구원 2" },
      { source: "한국로봇융합연구원 1", target: "동문 1" },
      { source: "한국로봇융합연구원 2", target: "한국로봇융합연구원 3" },
      { source: "한국로봇융합연구원 2", target: "한국로봇융합연구원 1" },
      { source: "한국로봇융합연구원 3", target: "한국로봇융합연구원 2" },
      { source: "한국로봇융합연구원 3", target: "철강대학원 1" },
      { source: "동문 2", target: "동문 1" },
      { source: "동문 2", target: "동문 3" },
      { source: "C5 2", target: "C5 1" },
      { source: "C5 2", target: "C5 3" },
      { source: "C5 1", target: "동문 3" },
      { source: "C5 1", target: "C5 2" },
      { source: "동문 3", target: "C5 1" },
      { source: "동문 3", target: "동문 2" },
      { source: "동문 3", target: "동문 4" },
      { source: "C5 3", target: "C5 2" },
      { source: "동문 4", target: "동문 3" },
      { source: "동문 4", target: "동문 5" },
      { source: "지곡연구동 3", target: "지곡연구동 2" },
      { source: "동문 5", target: "지곡연구동 1" },
      { source: "동문 5", target: "동문 4" },
      { source: "지곡연구동 1", target: "지곡연구동 2" },
      { source: "지곡연구동 1", target: "동문 5" },
      { source: "지곡연구동 2", target: "지곡연구동 1" },
      { source: "지곡연구동 2", target: "지곡연구동 3" },
    ],
  };

  const data3 = {
    nodes: [
      { id: "수리과학관 1", x: 1100, y: 440 },
      { id: "수리과학관 2", x: 1150, y: 460 },
      { id: "제1공학관 2", x: 1350, y: 460 },
      { id: "제1공학관 1", x: 1400, y: 440 },
      { id: "대강당 2", x: 1100, y: 390 },
      { id: "무은재기념관 2", x: 1400, y: 390 },
      { id: "대강당 1", x: 1100, y: 340 },
      { id: "무은재기념관 1", x: 1400, y: 340 },
      { id: "제3공학관 2", x: 1100, y: 290 },
      { id: "제3공학관 1", x: 1150, y: 310 },
      { id: "제2공학관 1", x: 1350, y: 310 },
      { id: "제2공학관 2", x: 1400, y: 290 },
      { id: "제5공학관 2", x: 1150, y: 260 },
      { id: "제5공학관 1", x: 1200, y: 240 },
      { id: "학생회관 1", x: 1250, y: 260 },
      { id: "제4공학관 1", x: 1300, y: 240 },
      { id: "제4공학관 2", x: 1350, y: 260 },
      { id: "학생회관 2", x: 1250, y: 210 },
      { id: "학생회관 3", x: 1250, y: 160 },
      { id: "학생회관 4", x: 1250, y: 110 },
      { id: "국제관 1", x: 1300, y: 90 },
      { id: "국제관 2", x: 1350, y: 110 },
      { id: "국제관 3", x: 1400, y: 90 },
      { id: "대운동장 3", x: 1150, y: 60 },
      { id: "대운동장 2", x: 1200, y: 40 },
      { id: "대운동장 1", x: 1250, y: 60 },
    ],
    links: [
      { source: "수리과학관 1", target: "수리과학관 2" },
      { source: "수리과학관 1", target: "대강당 2" },
      { source: "수리과학관 2", target: "수리과학관 1" },
      { source: "제1공학관 2", target: "제1공학관 1" },
      { source: "제1공학관 1", target: "제1공학관 2" },
      { source: "제1공학관 1", target: "무은재기념관 2" },
      { source: "대강당 2", target: "수리과학관 1" },
      { source: "대강당 2", target: "대강당 1" },
      { source: "무은재기념관 2", target: "제1공학관 1" },
      { source: "무은재기념관 2", target: "무은재기념관 1" },
      { source: "대강당 1", target: "대강당 2" },
      { source: "대강당 1", target: "제3공학관 2" },
      { source: "무은재기념관 1", target: "무은재기념관 2" },
      { source: "무은재기념관 1", target: "제2공학관 2" },
      { source: "제3공학관 2", target: "제3공학관 1" },
      { source: "제3공학관 2", target: "대강당 1" },
      { source: "제3공학관 1", target: "제3공학관 2" },
      { source: "제3공학관 1", target: "제5공학관 2" },
      { source: "제2공학관 1", target: "제2공학관 2" },
      { source: "제2공학관 1", target: "제4공학관 2" },
      { source: "제2공학관 2", target: "제2공학관 1" },
      { source: "제2공학관 2", target: "무은재기념관 1" },
      { source: "제5공학관 2", target: "제5공학관 1" },
      { source: "제5공학관 2", target: "제3공학관 1" },
      { source: "제5공학관 1", target: "학생회관 1" },
      { source: "제5공학관 1", target: "제5공학관 2" },
      { source: "학생회관 1", target: "제4공학관 1" },
      { source: "학생회관 1", target: "제5공학관 1" },
      { source: "학생회관 1", target: "학생회관 2" },
      { source: "제4공학관 1", target: "제4공학관 2" },
      { source: "제4공학관 1", target: "학생회관 1" },
      { source: "제4공학관 2", target: "제4공학관 1" },
      { source: "제4공학관 2", target: "제2공학관 1" },
      { source: "학생회관 2", target: "학생회관 1" },
      { source: "학생회관 2", target: "학생회관 3" },
      { source: "학생회관 3", target: "학생회관 2" },
      { source: "학생회관 3", target: "학생회관 4" },
      { source: "학생회관 4", target: "국제관 1" },
      { source: "학생회관 4", target: "학생회관 3" },
      { source: "학생회관 4", target: "대운동장 1" },
      { source: "국제관 1", target: "국제관 2" },
      { source: "국제관 1", target: "학생회관 4" },
      { source: "국제관 2", target: "국제관 3" },
      { source: "국제관 2", target: "국제관 1" },
      { source: "국제관 3", target: "국제관 2" },
      { source: "대운동장 3", target: "대운동장 2" },
      { source: "대운동장 2", target: "대운동장 1" },
      { source: "대운동장 2", target: "대운동장 3" },
      { source: "대운동장 1", target: "대운동장 2" },
      { source: "대운동장 1", target: "학생회관 4" },
    ],
  };

  const data4 = {
    nodes: [
      { id: "RIST 4", x: 1700, y: 440 },
      { id: "RIST 3", x: 1750, y: 460 },
      { id: "RIST 5", x: 1800, y: 440 },
      { id: "노벨동산 4", x: 1550, y: 410 },
      { id: "노벨동산 2", x: 1650, y: 410 },
      { id: "RIST 2", x: 1750, y: 410 },
      { id: "노벨동산 3", x: 1550, y: 360 },
      { id: "노벨동산 1", x: 1650, y: 360 },
      { id: "RIST 1", x: 1750, y: 360 },
      { id: "대학본관 4", x: 1900, y: 340 },
      { id: "인공지능연구원 4", x: 1550, y: 310 },
      { id: "인공지능연구원 3", x: 1600, y: 290 },
      { id: "인공지능연구원 2", x: 1650, y: 310 },
      { id: "인공지능연구원 1", x: 1700, y: 290 },
      { id: "LG연구동 1", x: 1750, y: 310 },
      { id: "대학본관 1", x: 1800, y: 290 },
      { id: "대학본관 2", x: 1850, y: 310 },
      { id: "대학본관 3", x: 1900, y: 290 },
      { id: "LG연구동 2", x: 1750, y: 260 },
      { id: "LG연구동 4", x: 1700, y: 190 },
      { id: "LG연구동 3", x: 1750, y: 210 },
      { id: "LG연구동 5", x: 1800, y: 190 },
      { id: "환경공학동 1", x: 1750, y: 160 },
      { id: "환경공학동 3", x: 1700, y: 90 },
      { id: "환경공학동 2", x: 1750, y: 110 },
      { id: "환경공학동 4", x: 1800, y: 90 },
    ],
    links: [
      { source: "RIST 4", target: "RIST 3" },
      { source: "RIST 3", target: "RIST 5" },
      { source: "RIST 3", target: "RIST 4" },
      { source: "RIST 3", target: "RIST 2" },
      { source: "RIST 5", target: "RIST 3" },
      { source: "노벨동산 4", target: "노벨동산 3" },
      { source: "노벨동산 2", target: "노벨동산 1" },
      { source: "RIST 2", target: "RIST 3" },
      { source: "RIST 2", target: "RIST 1" },
      { source: "노벨동산 3", target: "노벨동산 4" },
      { source: "노벨동산 3", target: "인공지능연구원 4" },
      { source: "노벨동산 1", target: "노벨동산 2" },
      { source: "노벨동산 1", target: "인공지능연구원 2" },
      { source: "RIST 1", target: "RIST 2" },
      { source: "RIST 1", target: "LG연구동 1" },
      { source: "대학본관 4", target: "대학본관 3" },
      { source: "인공지능연구원 4", target: "인공지능연구원 3" },
      { source: "인공지능연구원 4", target: "노벨동산 3" },
      { source: "인공지능연구원 3", target: "인공지능연구원 2" },
      { source: "인공지능연구원 3", target: "인공지능연구원 4" },
      { source: "인공지능연구원 2", target: "인공지능연구원 1" },
      { source: "인공지능연구원 2", target: "인공지능연구원 3" },
      { source: "인공지능연구원 2", target: "노벨동산 1" },
      { source: "인공지능연구원 1", target: "LG연구동 1" },
      { source: "인공지능연구원 1", target: "인공지능연구원 2" },
      { source: "LG연구동 1", target: "대학본관 1" },
      { source: "LG연구동 1", target: "인공지능연구원 1" },
      { source: "LG연구동 1", target: "RIST 1" },
      { source: "LG연구동 1", target: "LG연구동 2" },
      { source: "대학본관 1", target: "대학본관 2" },
      { source: "대학본관 1", target: "LG연구동 1" },
      { source: "대학본관 2", target: "대학본관 3" },
      { source: "대학본관 2", target: "대학본관 1" },
      { source: "대학본관 3", target: "대학본관 2" },
      { source: "대학본관 3", target: "대학본관 4" },
      { source: "LG연구동 2", target: "LG연구동 1" },
      { source: "LG연구동 2", target: "LG연구동 3" },
      { source: "LG연구동 4", target: "LG연구동 3" },
      { source: "LG연구동 3", target: "LG연구동 5" },
      { source: "LG연구동 3", target: "LG연구동 4" },
      { source: "LG연구동 3", target: "LG연구동 2" },
      { source: "LG연구동 3", target: "환경공학동 1" },
      { source: "LG연구동 5", target: "LG연구동 3" },
      { source: "환경공학동 1", target: "LG연구동 3" },
      { source: "환경공학동 1", target: "환경공학동 2" },
      { source: "환경공학동 3", target: "환경공학동 2" },
      { source: "환경공학동 2", target: "환경공학동 4" },
      { source: "환경공학동 2", target: "환경공학동 3" },
      { source: "환경공학동 2", target: "환경공학동 1" },
      { source: "환경공학동 4", target: "환경공학동 2" },
    ],
  };

  const data5 = {
    nodes: [
      { id: "포스플렉스 1", x: 2250, y: 460 },
      { id: "포스플렉스 2", x: 2300, y: 440 },
      { id: "포스플렉스 3", x: 2350, y: 460 },
      { id: "테니스장 3", x: 2100, y: 390 },
      { id: "체육관 3", x: 2250, y: 410 },
      { id: "테니스장 1", x: 2050, y: 360 },
      { id: "테니스장 2", x: 2100, y: 340 },
      { id: "체육관 2", x: 2250, y: 360 },
      { id: "화학관 2", x: 2350, y: 360 },
      { id: "풋살구장 3", x: 2050, y: 310 },
      { id: "체육관 1", x: 2250, y: 310 },
      { id: "화학관 1", x: 2350, y: 310 },
      { id: "풋살구장 2", x: 2050, y: 260 },
      { id: "풋살구장 1", x: 2100, y: 240 },
      { id: "통나무집 2", x: 2150, y: 260 },
      { id: "통나무집 1", x: 2200, y: 240 },
      { id: "나노융합기술원 1", x: 2250, y: 260 },
      { id: "생명과학관 1", x: 2300, y: 240 },
      { id: "생명과학관 2", x: 2350, y: 260 },
      { id: "기계실험동 1", x: 2400, y: 240 },
      { id: "기계실험동 2", x: 2450, y: 260 },
      { id: "통나무집 3", x: 2150, y: 210 },
      { id: "나노융합기술원 2", x: 2250, y: 210 },
      { id: "나노융합기술원 3", x: 2250, y: 160 },
      { id: "나노융합기술원 4", x: 2250, y: 110 },
      { id: "포항가속기연구소", x: 2250, y: 60 },
    ],
    links: [
      { source: "포스플렉스 1", target: "포스플렉스 2" },
      { source: "포스플렉스 1", target: "체육관 3" },
      { source: "포스플렉스 2", target: "포스플렉스 3" },
      { source: "포스플렉스 2", target: "포스플렉스 1" },
      { source: "포스플렉스 3", target: "포스플렉스 2" },
      { source: "테니스장 3", target: "테니스장 2" },
      { source: "체육관 3", target: "포스플렉스 1" },
      { source: "체육관 3", target: "체육관 2" },
      { source: "테니스장 1", target: "테니스장 2" },
      { source: "테니스장 1", target: "풋살구장 3" },
      { source: "테니스장 2", target: "테니스장 1" },
      { source: "테니스장 2", target: "테니스장 3" },
      { source: "체육관 2", target: "체육관 3" },
      { source: "체육관 2", target: "체육관 1" },
      { source: "화학관 2", target: "화학관 1" },
      { source: "풋살구장 3", target: "테니스장 1" },
      { source: "풋살구장 3", target: "풋살구장 2" },
      { source: "체육관 1", target: "체육관 2" },
      { source: "체육관 1", target: "나노융합기술원 1" },
      { source: "화학관 1", target: "화학관 2" },
      { source: "화학관 1", target: "생명과학관 2" },
      { source: "풋살구장 2", target: "풋살구장 1" },
      { source: "풋살구장 2", target: "풋살구장 3" },
      { source: "풋살구장 1", target: "통나무집 2" },
      { source: "풋살구장 1", target: "풋살구장 2" },
      { source: "통나무집 2", target: "통나무집 1" },
      { source: "통나무집 2", target: "풋살구장 1" },
      { source: "통나무집 2", target: "통나무집 3" },
      { source: "통나무집 1", target: "나노융합기술원 1" },
      { source: "통나무집 1", target: "통나무집 2" },
      { source: "나노융합기술원 1", target: "생명과학관 1" },
      { source: "나노융합기술원 1", target: "통나무집 1" },
      { source: "나노융합기술원 1", target: "체육관 1" },
      { source: "나노융합기술원 1", target: "나노융합기술원 2" },
      { source: "생명과학관 1", target: "생명과학관 2" },
      { source: "생명과학관 1", target: "나노융합기술원 1" },
      { source: "생명과학관 2", target: "기계실험동 1" },
      { source: "생명과학관 2", target: "생명과학관 1" },
      { source: "생명과학관 2", target: "화학관 1" },
      { source: "기계실험동 1", target: "기계실험동 2" },
      { source: "기계실험동 1", target: "생명과학관 2" },
      { source: "기계실험동 2", target: "기계실험동 1" },
      { source: "통나무집 3", target: "통나무집 2" },
      { source: "나노융합기술원 2", target: "나노융합기술원 1" },
      { source: "나노융합기술원 2", target: "나노융합기술원 3" },
      { source: "나노융합기술원 3", target: "나노융합기술원 2" },
      { source: "나노융합기술원 3", target: "나노융합기술원 4" },
      { source: "나노융합기술원 4", target: "나노융합기술원 3" },
      { source: "나노융합기술원 4", target: "포항가속기연구소" },
      { source: "포항가속기연구소", target: "나노융합기술원 4" },
    ],
  };

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

  for (let i = 0; i < data1.nodes.length; i++) {
    if (cell !== undefined) {
      if (visitableCell !== undefined) {
        for (let k = 0; k < visitableCell.length; k++) {
          if (visitableCell[k].name === data1.nodes[i].id) {
            data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'lightgreen' })
            for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
              if (data1.nodes[i].id === siegeCell[j].name) {
                data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'blue' })
              }
            }
            if (data1.nodes[i].id === cell.name) {
              data1.nodes[i] = Object.assign(data1.nodes[i], { color: 'red' })
            }
          }
        }
      }
    }
  }
  for (let i = 0; i < data2.nodes.length; i++) {
    if (cell !== undefined) {
      if (visitableCell !== undefined) {
        for (let k = 0; k < visitableCell.length; k++) {
          if (visitableCell[k].name === data2.nodes[i].id) {
            data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'lightgreen' })
            for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
              if (data2.nodes[i].id === teleportableTo[j].name) {
                data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'lightblue' })
              }
            }
            for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
              if (data2.nodes[i].id === siegeCell[j].name) {
                data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'blue' })
              }
            }
            if (data2.nodes[i].id === cell.name) {
              data2.nodes[i] = Object.assign(data2.nodes[i], { color: 'red' })
            }
          }
        }
      }
    }
    data2.nodes[i] = Object.assign(data2.nodes[i], { x: data2.nodes[i].x - 500 })
  }
  for (let i = 0; i < data3.nodes.length; i++) {
    if (cell !== undefined) {
      if (visitableCell !== undefined) {
        for (let k = 0; k < visitableCell.length; k++) {
          if (visitableCell[k].name === data3.nodes[i].id) {
            data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'lightgreen' })
            for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
              if (data3.nodes[i].id === teleportableTo[j].name) {
                data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'lightblue' })
              }
            }
            for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
              if (data3.nodes[i].id === siegeCell[j].name) {
                data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'blue' })
              }
            }
            if (data3.nodes[i].id === cell.name) {
              data3.nodes[i] = Object.assign(data3.nodes[i], { color: 'red' })
            }
          }
        }
      }
    }
    data3.nodes[i] = Object.assign(data3.nodes[i], { x: data3.nodes[i].x - 1000 })
  }
  for (let i = 0; i < data4.nodes.length; i++) {
    if (cell !== undefined) {
      if (visitableCell !== undefined) {
        for (let k = 0; k < visitableCell.length; k++) {
          if (visitableCell[k].name === data4.nodes[i].id) {
            data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'lightgreen' })
            for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
              if (data4.nodes[i].id === teleportableTo[j].name) {
                data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'lightblue' })
              }
            }
            for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
              if (data4.nodes[i].id === siegeCell[j].name) {
                data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'blue' })
              }
            }
            if (data4.nodes[i].id === cell.name) {
              data4.nodes[i] = Object.assign(data4.nodes[i], { color: 'red' })
            }
          }
        }
      }
    }
    data4.nodes[i] = Object.assign(data4.nodes[i], { x: data4.nodes[i].x - 1500 })
  }
  for (let i = 0; i < data5.nodes.length; i++) {
    if (cell !== undefined) {
      if (visitableCell !== undefined) {
        for (let k = 0; k < visitableCell.length; k++) {
          if (visitableCell[k].name === data5.nodes[i].id) {
            data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'lightgreen' })
            for (let j = 0; teleportableTo !== undefined && j < teleportableTo.length; j++) {
              if (data5.nodes[i].id === teleportableTo[j].name) {
                data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'lightblue' })
              }
            }
            for (let j = 0; siegeCell !== undefined && j < siegeCell.length; j++) {
              if (data5.nodes[i].id === siegeCell[j].name) {
                data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'blue' })
              }
            }
            if (data5.nodes[i].id === cell.name) {
              data5.nodes[i] = Object.assign(data5.nodes[i], { color: 'red' })
            }
          }
        }
      }
    }
    data5.nodes[i] = Object.assign(data5.nodes[i], { x: data5.nodes[i].x - 2000 })
  }

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

  function map_print() {
    if (lv === 1) {
      return (
        <Graph
          id="graph-id" // id is mandatory
          data={data1}
          config={myConfig}
          onClickNode={onClickNode}
        />
      )
    }
    else if (lv === 2) {
      return (
        <Graph
          id="graph-id" // id is mandatory
          data={data2}
          config={myConfig}
          onClickNode={onClickNode}
        />
      )
    }
    else if (lv === 3) {
      return (
        <Graph
          id="graph-id" // id is mandatory
          data={data3}
          config={myConfig}
          onClickNode={onClickNode}
        />
      )
    }
    else if (lv === 4) {
      return (
        <Graph
          id="graph-id" // id is mandatory
          data={data4}
          config={myConfig}
          onClickNode={onClickNode}
        />
      )
    }
    else {
      return (
        <Graph
          id="graph-id" // id is mandatory
          data={data5}
          config={myConfig}
          onClickNode={onClickNode}
        />
      )
    }
  }

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
    if (equipments !== undefined && cell !== undefined) {
      if (equipments.Weapon !== undefined) {
        let weaponType = (equipments.Weapon.itemInfo as EquipableItemInfo).battleType
        let monsterType = cell.battleType
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
    if (equipments !== undefined && cell !== undefined) {
      if (equipments.Accessory !== undefined) {
        let accType = (equipments.Accessory.itemInfo as EquipableItemInfo).battleType
        let monsterType = cell.battleType
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
    if (cell !== undefined) {
      let type = cell.battleType
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
                cell !== undefined ?
                  cell.battleType <= 4 && cell.battleType >= 0 ?
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
                  셀 Lv. {cell !== undefined ? cell.level : ""}
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
            cell !== undefined && cell.adjNorth !== null ?
              playerLevel !== undefined && cell.adjNorth.level <= playerLevel + 1 ?
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
                    {cell.adjNorth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {cell.adjNorth.level})
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
                    {cell.adjNorth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}                >
                    (Lv. {cell.adjNorth.level})
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
            cell !== undefined && cell.adjWest !== null ?
              playerLevel !== undefined && cell.adjWest.level <= playerLevel + 1 ?
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
                    {cell.adjWest.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {cell.adjWest.level})
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
                    {cell.adjWest.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    (Lv. {cell.adjWest.level})
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
            {cell !== undefined ? cell.name : ""}
          </Typography>
          {
            cell !== undefined && cell.adjEast !== null ?
              playerLevel !== undefined && cell.adjEast.level <= playerLevel + 1 ?
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
                    {cell.adjEast.name}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}>
                    (Lv. {cell.adjEast.level})
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
                    {cell.adjEast.name}
                  </Typography>
                  <Typography
                    align="center"
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}>
                    (Lv. {cell.adjEast.level})
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
            cell !== undefined && cell.adjSouth !== null ?
              playerLevel !== undefined && cell.adjSouth.level <= playerLevel + 1 ?
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
                    {cell.adjSouth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'white',
                    }}
                  >
                    (Lv. {cell.adjSouth.level})
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
                    {cell.adjSouth.name}
                  </Typography>
                  <Typography
                    align='center'
                    sx={{
                      textShadow: '1px 0px #000, -1px 0px #000, 0px 1px #000, 0px -1px #000',
                      color: 'lightgray',
                    }}
                  >
                    (Lv. {cell.adjSouth.level})
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
              cell !== undefined ?
                cell.isCapturable ?
                  <ClassRanking /> :
                  undefined :
                undefined
            }
            {
              cell !== undefined ?
                cell.isTeleportable ?
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
                  cell.isCapturable ?
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
                  siege !== undefined && cell?.isCapturable ?
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
                    {map_print()}
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
                            setCell(data.movedTo)
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