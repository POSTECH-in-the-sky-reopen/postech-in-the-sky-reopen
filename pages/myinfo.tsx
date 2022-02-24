import type { NextPage } from 'next'
import React, { SetStateAction } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MuiThemeProvider} from '@material-ui/core/styles';
import { AccessoryEquipableItem, EquipableItem, Item, WeaponEquipableItem } from 'src/entity/Item';
import { Status } from 'src/interfaces/Status';
import { Equipments } from 'src/interfaces/Equipments';
import { EquipableItemInfo, WeaponEquipableItemInfo, CoordiItemInfo } from 'src/entity/ItemInfo';
import { ItemType } from 'src/enums/ItemType';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Backdrop from '@mui/material/Backdrop';
import { ArrowBack } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Profile2 from './profile2';
import InfoIcon from '@mui/icons-material/Info';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { positions } from '@mui/system';
import { REPAIR_COST } from 'src/constants/durability';


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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
let w_num=0
let a_num = 0

const Home: NextPage = () => {
  //let [equipment, setEquipment] = React.useState<string | undefined>(undefined)
  let [item2, setItem2] = React.useState<Item[] | undefined>(undefined)
  const [value, setValue] = React.useState(0);
  let [status, setStatus] = React.useState<Status | undefined>(undefined)
  let [equipments, setEquipments] = React.useState<Equipments | undefined>(undefined)
  let [swapweapon, setSwapweapon] = React.useState<Equipments | undefined>(undefined)
  let [tp, setTp] = React.useState(0)
  const handleChange = (event: React.SyntheticEvent, newValue: SetStateAction<number>) => {
    setValue(newValue);
  };
  let [currstat, setCurrstat] = React.useState(0)
  let [en_name, setEn_name] = React.useState("")
  let [al, setAl] = React.useState("DESC")
  let [w_stat, setW_stat] = React.useState<Status | undefined>(undefined)
  let [a_stat, setA_stat] = React.useState<Status | undefined>(undefined)
  let [previous, setPrevious] = React.useState<Item | undefined>(undefined)
  const [open, setOpen] = React.useState(false)
  const [money, setMoney] = React.useState(0)
  let [typeopen, setTypeOpen] = React.useState(false);

  const handletypeOpen = () => {
    setTypeOpen(true);
  };
  const handletypeClose = () => {
    setTypeOpen(false);
  };


  const handleClose = () => {
    setOpen(false);
  }
  function handleToggleOpen() {
    setOpen(!open);
  }
  let [age, setAge] = React.useState("획득 순");

  const handleChanging = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
let [ally, setAlly] = React.useState(false)

const [alignment, setAlignment] = React.useState('right');

const handleChanging2 = (
  event: React.MouseEvent<HTMLElement>,
  newAlignment: string,
) => {
  setAlignment(newAlignment);
};

let children = [
  <ToggleButton value="left" key="left" onClick={function(){setAl("ASC")}}>
    <KeyboardArrowUpIcon />
  </ToggleButton>,
  <ToggleButton value="right" key="right" onClick={function(){setAl("DESC")}}>
    <KeyboardArrowDownIcon />
  </ToggleButton>
];

const control = {
  value: alignment,
  onChange: handleChanging2,
  exclusive: true,
};

const [open2, setOpen2] = React.useState(false);

  const handleClickOpen = () => {
    setOpen2(true);
  };

  const handleClickOpen5 = () => {
    setOpen5(true);
  };

  const handleClosing = () => {
    setOpen2(false);
  };

  const handleClosing5 = () => {
    setOpen5(false);
  };

  const [open3, setOpen3] = React.useState(false);
  const [open5, setOpen5] = React.useState(false);
  const handleClickOpen2 = () => {
    setOpen3(true);
  };

  const handleClosing2 = () => {
    setOpen3(false);
  };

  React.useEffect(function () {
    let ag=0
    
    if(age==="획득 순"){
      ag=0
    }
    else if(age==="속성 순"){
      ag=1
    }
    else if(age==="레벨 순"){
      ag=2
    }
    fetch("/api/player/inventory/items", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({sortType:ag, sortDir: al}),
    }).then(async (response) => {
      const data = await response.json()
      setItem2(data.items)
      //console.log(data.message)
    })
  }, [swapweapon, age, al, equipments, previous])

  React.useEffect(function () {
    if (navigator.userAgent.match(/Android/i)) {
      window.scrollTo(0, 1);
    }
    else if (navigator.userAgent.match(/iPhone/i)) {
      window.scrollTo(0, 1);
    }
  }, [])

  React.useEffect(function () {
    fetch("/api/player/money/current", {method: 'POST'}).then(async (response) => {
      const data = await response.json();
      //console.log(setMoney(data.money));
    });
  }, [swapweapon]);

  React.useEffect(function () {
    fetch("/api/player/equipments/get", {method: 'POST'}).then(async (response) => {
      const data = await response.json()
      setEquipments(data.equipments)
      //console.log(data.equipments)
      if (data.equipments !== undefined && data.equipments.Weapon !== undefined && data.equipments.Weapon.id !== undefined) {
        fetch("/api/item/get-one", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: data.equipments.Weapon.id }),
        }).then(async (res) => {
          const data = await res.json()
          //console.log(data.message)
          if (data.status !== undefined) {
            //console.log(data.status)
            setW_stat(data.status)
          }
          if (data.item !== undefined) {
            if (data.item.enchantItemInfo !== undefined) {
              if (data.item.enchantItemInfo !== null) {
                setEn_name(data.item.enchantItemInfo.name)
              }
              else {
                setEn_name("")
              }
            }
            else {
              setEn_name("")
            }
          }
          else {
            setEn_name("")
          }
        }
        )
      }

      if (data.equipments !== undefined && data.equipments.Accessory !== undefined) {
        fetch("/api/item/get-one", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemId: data.equipments.Accessory.id }),
        }).then(async (res) => {
          const data = await res.json()
          //console.log(data.message)
          if (data.status !== undefined) {
            //console.log(data.status)
            setA_stat(data.status)
          }
        }
        )
      }
      else {
        setA_stat(undefined)
      }
    })
  }, [swapweapon, previous])


  React.useEffect(function () {
    fetch("/api/player/status/check", {method: 'POST'}).then(async (response) => {
      const data = await response.json()
      setStatus(data.status)
    })
  }, [currstat, previous, equipments])


  let itemSlots = []
  let weaponSlots = []
  let accessorySlots = []
  let accessorySlots2 = []
  let faceSlots = []
  let hairSlots = []
  let suitSlots = []
  let decoSlots = []
  let enchantSlots = []
  let [atk, setAtk] = React.useState(0)
  let [laz, setLaz] = React.useState(0)
  let [wpninven, setWpninven] = React.useState(20)
  let w = 0
  let a = 0
  let f = 0
  let h = 0
  let s = 0
  let e = 0
  let d = 0

  if (item2 !== undefined) {
    for (let i = 0; i < item2?.length; i++) {
      if (item2[i].itemType === ItemType.WEAPON) {
        w++
      }
      else if (item2[i].itemType === ItemType.ACCESSORY) {
        a++
      }
      else if (item2[i].itemType === ItemType.FACE) {
        f++
      }
      else if (item2[i].itemType === ItemType.HAIR) {
        h++
      }
      else if (item2[i].itemType === ItemType.SUIT) {
        s++
      }
      else if (item2[i].itemType === ItemType.ENCHANT) {
        e++
      }
      else if (item2[i].itemType === ItemType.DECO) {
        d++
      }
    }
  }

  let addWslots = w % 4
  let addAslots = a % 4
  let addFslots = f % 4
  let addHslots = h % 4
  let addSslots = s % 4
  let addEslots = e % 4
  let addDslots = d % 4




  if (item2 !== undefined) {
    let ww = 0
    let aa = 0
    let ff = 0
    let hh = 0
    let ss = 0
    let ee = 0
    let dd = 0
    for (let i = 0; i < item2?.length; i++) {
      if (item2[i].itemType === ItemType.WEAPON) {
        w_num++
        let eq = ""
        let barlength = 0
        let colr = ""
        let type = -1
        let lv = -1
        if (equipments !== undefined && equipments.Weapon !== undefined && item2[i].id === equipments.Weapon.id) {
          eq = "snow"
        }
        if ((item2[i] as EquipableItem) !== undefined && (item2[i].itemInfo as EquipableItemInfo) !== undefined) {
          barlength = (item2[i] as EquipableItem).durability / (item2[i].itemInfo as EquipableItemInfo).durability * 15
          type = (item2[i].itemInfo as EquipableItemInfo).battleType
          lv = (item2[i] as EquipableItem).level
          if (barlength > 7.5) {
            colr = "#82F9B7"
          }
          else if (barlength > 3) {
            colr = "#FFE65A"
          }
          else {
            colr = "#FF5A5A"
          }

        }
        let bar_length = ""
        bar_length = barlength + "vw"
        weaponSlots.push(
          <div
            key={i}
            onClick={function () {
              if (item2 !== undefined) {
                if (equipments?.Weapon === undefined || item2[i].id !== equipments.Weapon.id) {
                  fetch("/api/player/equipments/equip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: item2[i].id }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    if (swapweapon !== undefined) {
                      swapweapon.Weapon = data.current
                      if (item2 !== undefined) {
                        setCurrstat(item2[i].id)
                      }
                    }
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  }

                  )
                  if (item2[i] !== undefined) {
                    fetch("/api/item/get-one", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemId: item2[i].id }),
                    }).then(async (res) => {
                      const data = await res.json()
                      //console.log(data.message)
                      if (data.item !== undefined) {
                        if (data.item.enchantItemInfo !== undefined) {
                          if (data.item.enchantItemInfo !== null) {
                            //console.log(data.item.enchantItemInfo.name)
                            setEn_name(data.item.enchantItemInfo.name)
                            //console.log(en_name)
                          }
                          else {
                            setEn_name("")
                          }
                        }
                      }
                      else {
                        setEn_name("")
                      }
                    }
                    )
                  }
                }
                else {
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.WEAPON }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    setEn_name("")
                    if (swapweapon !== undefined) {
                      swapweapon.Face = undefined
                      if (item2 !== undefined) {
                        //setCurrstat(-2)
                      }
                    }
                    //console.log(data.message)
                    //console.log(data.previous)
                    setW_stat(undefined)
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  }

                  )
                }
              }

            }}
            style={{ position: "relative"}}
            className={'item-box-' + type}
          >{equipments !== undefined && equipments.Weapon !== undefined && item2[i].id === equipments.Weapon.id?<div className='item-box-inside'></div>:""}
            {item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/무기 아이콘/' + item2[i].itemInfo.name + '.png'} className='item-img-box'
              style={{ backgroundColor: "transparent", position: "absolute", borderRadius: "6px", width: "18vw", height: "18vw" }} /> : ""
            }
            {item2[i] !== undefined ? <div
              className='durability-bar'
              style={{ marginTop: "16vw", position: "absolute" }}>
              <div
                className='durability-bar-dynamic'
                style={{ zIndex: "1000", width: bar_length, backgroundColor: colr }}

              ></div>
            </div> : ""}
            <div style={{ position: "absolute", backgroundColor: "rgba(30,30,30,0.6)", width: "8vw", height: "4vw", color: "white", right: "0", textAlign: "center", fontSize: "2vw", paddingBottom: "1vw",borderRadius:"4px" }}>Lv.{lv}</div>
          </div>
        )
        ww++
      }
      else if (item2[i].itemType === ItemType.ACCESSORY) {
        a_num++
        let eq = ""
        let barlength = 0
        let colr = ""
        let type = -1
        let lv = -1
        if (equipments !== undefined && equipments.Accessory !== undefined && item2[i].id === equipments.Accessory.id) {
          eq = "snow"
        }
        if ((item2[i] as EquipableItem) !== undefined && (item2[i].itemInfo as EquipableItemInfo) !== undefined) {
          barlength = (item2[i] as EquipableItem).durability / (item2[i].itemInfo as EquipableItemInfo).durability * 15
          type = (item2[i].itemInfo as EquipableItemInfo).battleType
          lv = (item2[i] as EquipableItem).level
          if (barlength > 7.5) {
            colr = "#82F9B7"
          }
          else if (barlength > 3) {
            colr = "#FFE65A"
          }
          else {
            colr = "#FF5A5A"
          }

        }
        let bar_length = ""
        bar_length = barlength + "vw"
        accessorySlots2.push(
          <div
            key={item2[i].id}
            onClick={function () {
              if (item2 !== undefined) {
                if (equipments?.Accessory === undefined || item2[i].id !== equipments.Accessory.id) {
                  fetch("/api/player/equipments/equip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: item2[i].id }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    if (swapweapon !== undefined) {
                      swapweapon.Accessory = data.current
                      if (item2 !== undefined) {
                        setCurrstat(item2[i].id)
                      }
                    }
                    //alert(swapweapon.Accessory.id!==undefined?swapweapon.Accessory.id:"??")
                  })
                }
                else {
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.ACCESSORY }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    if (swapweapon !== undefined) {
                      swapweapon.Face = undefined
                      if (item2 !== undefined) {
                        //setCurrstat(-2)
                      }
                    }
                    //console.log(data.message)
                    //console.log(data.previous)
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  }

                  )
                }
              }
            }}
            style={{ position: "relative"}}
            className={'item-box-' + type}
          >
            {equipments !== undefined && equipments.Accessory !== undefined && item2[i].id === equipments.Accessory.id?<div className='item-box-inside'></div>:""}
            {item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/장신구/' + item2[i].itemInfo.name + '.png'} className='item-img-box'
            style={{ backgroundColor: "transparent", position: "absolute", borderRadius: "6px", width: "18vw", height: "18vw" }} /> : ""
            }
            {item2[i] !== undefined ? <div
              className='durability-bar'
              style={{ marginTop: "16vw", position: "absolute" }}>
              <div
                className='durability-bar-dynamic'
                style={{ zIndex: "1000", width: bar_length, backgroundColor: colr }}

              ></div>
            </div> : ""}
            <div style={{ position: "absolute", backgroundColor: "rgba(30,30,30,0.6)", width: "8vw", height: "4vw", color: "white", right: "0", textAlign: "center", fontSize: "2vw", paddingBottom: "1vw", borderRadius:"4px" }}>Lv.{lv}</div>
          </div>
        )
        aa++
      }
      else if (item2[i].itemType === ItemType.FACE) {
        faceSlots.push(
          <div
            key={item2[i].id}
            onClick={function () {
              if (item2 !== undefined) {
                if (equipments?.Face === undefined || item2[i].id !== equipments.Face.id) {
                  fetch("/api/player/equipments/equip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: item2[i].id }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    if (swapweapon !== undefined) {
                      swapweapon.Face = data.current
                    }
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  })
                }
                else {
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.FACE }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    if (swapweapon !== undefined) {
                      swapweapon.Face = undefined
                      if (item2 !== undefined) {
                        //setCurrstat(-2)
                      }
                    }
                    //console.log(data.message)
                    //console.log(data.previous)
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  }

                  )
                }
              }

            }}
            className={equipments !== undefined && equipments.Face !== undefined && item2[i].id === equipments.Face.id ? 'item-box2' : 'item-box'}
          >{item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/코디/얼굴_' + item2[i].itemInfo.name + '.png'} className='item-img-box-face'
            style={{ backgroundColor: "transparent" }} /> : ""
            }
            {//item2[i]!==undefined?<img src={'/static/'+item2[i].itemInfo.name+'.png'} className='item-img-box'/>:""
            }
          </div>
        )
        ff++
      }
      else if (item2[i].itemType === ItemType.HAIR) {
        hairSlots.push(
          <div
            key={item2[i].id}
            onClick={function () {
              if (item2 !== undefined) {
                if (equipments?.Hair === undefined || item2[i].id !== equipments.Hair.id) {
                  fetch("/api/player/equipments/equip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: item2[i].id }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    if (swapweapon !== undefined) {
                      swapweapon.Hair = data.current
                    }
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  })
                }
                else {
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.HAIR }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    if (swapweapon !== undefined) {
                      swapweapon.Deco = undefined
                      if (item2 !== undefined) {
                        //setCurrstat(-2)
                      }
                    }
                    //console.log(data.message)
                    //console.log(data.previous)
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  }

                  )
                }
              }
            }}
            className={equipments !== undefined && equipments.Hair !== undefined && item2[i].id === equipments.Hair.id ? 'item-box2' : 'item-box'}
            style={{ position: "relative" }}
          >{item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/코디/뒷머리_' + item2[i].itemInfo.name + '.png'} className='item-img-box-hair'
            style={{ backgroundColor: "transparent", position: "absolute" }} /> : ""
            }
            {item2[i] !== undefined && item2[i].itemInfo !== undefined ?
              <img src={'/static/코디/앞머리_' + item2[i].itemInfo.name + '.png'} className='item-img-box-hair'
                style={{ backgroundColor: "transparent", position: "absolute" }} /> : ""
            }
            {//item2[i]!==undefined?<img src={'/static/'+item2[i].itemInfo.name+'.png'} className='item-img-box'/>:""
            }
          </div>
        )
        hh++
      }
      else if (item2[i].itemType === ItemType.SUIT) {
        suitSlots.push(
          <div
            key={item2[i].id}
            onClick={function () {
              if (item2 !== undefined) {
                if (equipments?.Suit === undefined || item2[i].id !== equipments.Suit.id) {
                  fetch("/api/player/equipments/equip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemId: item2[i].id }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    if (swapweapon !== undefined) {
                      swapweapon.Suit = data.current
                      //console.log(data.message)
                    }
                    else {
                      //console.log(data.message)
                    }
                    //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                  })
                }
                else {
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.SUIT }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    if (swapweapon !== undefined) {
                      swapweapon.Deco = undefined
                      if (item2 !== undefined) {
                      }
                    }
                    //console.log(data.message)
                    //console.log(data.previous)
                  }

                  )
                }
              }
            }}
            className={equipments !== undefined && equipments.Suit !== undefined && item2[i].id === equipments.Suit.id ? 'item-box2' : 'item-box'}
          >{item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/코디/옷_' + item2[i].itemInfo.name + '.png'} className='item-img-box-suit'
            style={{ backgroundColor: "transparent" }} /> : ""
            }
          </div>
        )
        ss++
      }
      else if (item2[i].itemType === ItemType.DECO) {
        if ((item2[i].itemInfo as CoordiItemInfo) !== undefined && (item2[i].itemInfo as CoordiItemInfo).layers[0] === "1") {
          decoSlots.push(
            <div
              key={item2[i].id}
              onClick={function () {
                if (item2 !== undefined) {
                  if (equipments?.Deco === undefined || item2[i].id !== equipments.Deco.id) {
                    fetch("/api/player/equipments/equip", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemId: item2[i].id }),
                    }).then(async (res) => {
                      const data = await res.json()
                      setSwapweapon(equipments)
                      if (swapweapon !== undefined) {
                        swapweapon.Deco = data.current
                      }
                      //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                    })
                  }
                  else {
                    fetch("/api/player/equipments/unequip", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemType: ItemType.DECO }),
                    }).then(async (res) => {
                      const data = await res.json()
                      setSwapweapon(equipments)
                      setPrevious(data.previous)
                      if (swapweapon !== undefined) {
                        swapweapon.Deco = undefined
                        if (item2 !== undefined) {
                        }
                      }
                      //console.log(data.message)
                      //console.log(data.previous)
                    }

                    )
                  }
                }
              }}
              className={equipments !== undefined && equipments.Deco !== undefined && item2[i].id === equipments.Deco.id ? 'item-box2' : 'item-box'}
            >{item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/코디/망토_' + item2[i].itemInfo.name + '.png'} className='item-img-box-suit'
              style={{ backgroundColor: "transparent", marginTop: "-8vw", marginLeft: "-8.7vw" }} /> : ""
              }
            </div>
          )
        }
        else if ((item2[i].itemInfo as CoordiItemInfo) !== undefined && (item2[i].itemInfo as CoordiItemInfo).layers[0] === "7") {
          decoSlots.push(
            <div
              key={item2[i].id}
              onClick={function () {
                if (item2 !== undefined) {
                  if (equipments?.Deco === undefined || item2[i].id !== equipments.Deco.id) {
                    fetch("/api/player/equipments/equip", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemId: item2[i].id }),
                    }).then(async (res) => {
                      const data = await res.json()
                      setSwapweapon(equipments)
                      if (swapweapon !== undefined) {
                        swapweapon.Deco = data.current
                      }
                      //alert(swapweapon.Weapon.id!==undefined?swapweapon.Weapon.id:"??")
                    })
                  }
                  else {
                    fetch("/api/player/equipments/unequip", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemType: ItemType.DECO }),
                    }).then(async (res) => {
                      const data = await res.json()
                      setSwapweapon(equipments)
                      setPrevious(data.previous)
                      if (swapweapon !== undefined) {
                        swapweapon.Deco = undefined
                        if (item2 !== undefined) {
                        }
                      }
                      //console.log(data.message)
                      //console.log(data.previous)
                    }

                    )
                  }
                }
              }}
              className={equipments !== undefined && equipments.Deco !== undefined && item2[i].id === equipments.Deco.id ? 'item-box2' : 'item-box'}
            >{item2[i] !== undefined && item2[i].itemInfo !== undefined ? <img src={'/static/코디/오버레이_' + item2[i].itemInfo.name + '.png'} className='item-img-box-suit'
              style={{ backgroundColor: "transparent", marginTop: "-6.5vw", marginLeft: "-8.7vw" }} /> : ""
              }
            </div>
          )
        }
        
      }
      
      else if (item2[i].itemType === ItemType.ENCHANT) {
        enchantSlots.push(
          <div
            key={"인챈트"+i}
            style={{ display: "flex", width: "84vw" }}
          >
            <div
              className='item-box'
              style={{ textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw"}}
            >
              <div><img src="/static/UI 아이콘/인챈트북.png"
                className='item-img-box' style={{backgroundColor:"snow"}}/></div></div>
            <div className='item-box-e-detail' style={{width:"64vw",height:"18vw", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", padding: "1vw", backgroundColor: "#efefef",marginTop:"2vw",borderRadius:"7px" }}>
              <div><b>{item2[i] !== undefined && item2[i].itemInfo !== undefined ? item2[i].itemInfo.name : ""}</b>
              <br/><a>{item2[i] !== undefined && item2[i].itemInfo.description !== undefined ? item2[i].itemInfo.description : ""}</a>
              </div></div></div>
        )
      }


    }
    if (addWslots !== 0) {
      for (let i = 0; i < (4 - addWslots); i++) {
        weaponSlots.push(
          <div
            key={10000+ww}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        ww++
      }
    }
    if (addAslots !== 0) {
      for (let i = 0; i < (4 - addAslots); i++) {
        accessorySlots2.push(
          <div
            key={200 + aa}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        aa++
      }
    }
    if (addFslots !== 0) {
      for (let i = 0; i < (4 - addFslots); i++) {
        faceSlots.push(
          <div
            key={400 + ff}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        ff++
      }
    }
    if (addHslots !== 0) {
      for (let i = 0; i < (4 - addHslots); i++) {
        hairSlots.push(
          <div
            key={600 + hh}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        hh++
      }
    }
    if (addSslots !== 0) {
      for (let i = 0; i < (4 - addSslots); i++) {
        suitSlots.push(
          <div
            key={800 + ss}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        ss++
      }
    }
    if (addDslots !== 0) {
      for (let i = 0; i < (4 - addDslots); i++) {
        decoSlots.push(
          <div
            key={1000 + dd}
            className='item-box'
            style={{ backgroundColor: "lightgray" }}
          ><img src='/static/transparent.png' className='item-img-box'
            style={{ backgroundColor: "transparent" }} /></div>)
        dd++
      }
    }
  }


  function battle_type() {
    if (equipments !== undefined) {
      if (equipments.Weapon !== undefined) {
        let type = (equipments.Weapon.itemInfo as EquipableItemInfo).battleType
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

  function battle_type_acc() {
    if (equipments !== undefined) {
      if (equipments.Accessory !== undefined) {
        let type = (equipments.Accessory.itemInfo as EquipableItemInfo).battleType
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

function star(sharpness:number):string{
  let stars =""
  for(let i=0;i<sharpness;i++){
    stars=stars+"★"
  }
  return(
    stars
  )
}

  function detailbox() {
    if (value === 0) {
      return (<div className='detail-box'>
        <div className='toenchant-item-info2' style={{ top: "0", right: "0" }}
          onClick={function () { handleToggleOpen() }}>
          <InfoIcon fontSize='medium'
          /></div>
        {equipments !== undefined && equipments !== null ?
          <p style={{ margin: "6px", color: "white" }}><b>{
            equipments?.Weapon !== undefined ? "Lv." + (equipments.Weapon as EquipableItem).level+" " : ""
            }<a style={{ color: "#bdb6f1" }}>{en_name}</a>
            {equipments !== undefined && equipments.Weapon !== undefined ? " " + equipments.Weapon.itemInfo.name : "선택된 아이템이 없습니다"} {battle_type() != undefined ? "(" + battle_type() + ")" : ""}
          </b>
            <br /><a style={{ fontSize: "13px", color: "#ad7af4", position:"absolute", top:"-15px" }}>{
            //equipments.Weapon !== undefined ? "내구도: " + (equipments.Weapon as EquipableItem).durability + "/" : ""
            }
              {
             // equipments.Weapon !== undefined ? (equipments.Weapon.itemInfo as EquipableItemInfo).durability : ""
            }
              {
              equipments?.Weapon !== undefined ?" "+star((equipments.Weapon as EquipableItem).sharpness) : ""}
              </a><a style={{fontSize: "13px",color:"salmon"}}>{w_stat!==undefined?"체력: "+w_stat?.hpmax+" ":""}</a>
              <a style={{fontSize: "13px",color:"orange"}}>{w_stat!==undefined?"공격력: "+w_stat?.attack+" ":""}</a>
              <a style={{fontSize: "13px",color:"yellowgreen"}}>{w_stat!==undefined?"방어력: "+w_stat?.defense+" ":""}</a>
              <a style={{fontSize: "13px",color:"skyblue"}}>{w_stat!==undefined?"행운: "+w_stat?.luck+" ":""}</a>
              <a style={{fontSize: "13px",color:"#e0e0e0"}}>
              {
            equipments.Weapon !== undefined ? "내구도: " + (equipments.Weapon as EquipableItem).durability + "/" : ""
            }
              {
             equipments.Weapon !== undefined ? (equipments.Weapon.itemInfo as EquipableItemInfo).durability : ""
            }
              </a>
            <br /><a style={{ fontSize: "15px", color: "snow" }}>{equipments !== undefined && equipments?.Weapon !== undefined ? equipments.Weapon.itemInfo.description : ""}</a>
          </p> :
          ""
        }
        <div style={{ position: "absolute", bottom: "1vw", right: "1vw", width: "125px" }}>
          <a style={{ color: "white" }}
             onClick={handleClickOpen5}>{equipments !== undefined && equipments.Weapon !== undefined ? "· 버리기" : ""
            }

          </a>
          <a> </a>
          <a style={{ color: "white" }}
          onClick={handleClickOpen}
          >{equipments !== undefined && equipments.Weapon !== undefined ? "· 수리하기" : ""
          }</a>
        </div>
      </div>)
    }
    else if (value === 1) {
      return (<div className='detail-box' >
        <div className='toenchant-item-info2' style={{ top: "0", right: "0" }}
          onClick={function () { handleToggleOpen() }}>
          <InfoIcon fontSize='medium'
          /></div>
        {equipments !== undefined && equipments !== null ?
          <p style={{ margin: "6px", color: "white" }}><b>{
            equipments?.Accessory !== undefined ? "Lv." + (equipments.Accessory as EquipableItem).level : ""
            }
            {equipments !== undefined && equipments.Accessory !== undefined ? " " + equipments.Accessory.itemInfo.name : "선택된 아이템이 없습니다"} {battle_type_acc() != undefined ? "(" + battle_type_acc() + ")" : ""}
          </b>
            <br /><a style={{ fontSize: "13px", color: "#ad7af4", position:"absolute", top:"-15px" }}>
              {
              equipments?.Accessory !== undefined ?" "+star((equipments.Accessory as EquipableItem).sharpness) : ""}
              </a><a style={{fontSize: "13px",color:"salmon"}}>{a_stat!==undefined?"체력: "+a_stat?.hpmax+" ":""}</a>
              <a style={{fontSize: "13px",color:"orange"}}>{a_stat!==undefined?"공격력: "+a_stat?.attack+" ":""}</a>
              <a style={{fontSize: "13px",color:"yellowgreen"}}>{a_stat!==undefined?"방어력: "+a_stat?.defense+" ":""}</a>
              <a style={{fontSize: "13px",color:"skyblue"}}>{a_stat!==undefined?"행운: "+a_stat?.luck+" ":""}</a>
              <a style={{fontSize: "13px",color:"#e0e0e0"}}>
              {
            equipments.Accessory !== undefined ? "내구도: " + (equipments.Accessory as EquipableItem).durability + "/" : ""
            }
              {
             equipments.Accessory !== undefined ? (equipments.Accessory.itemInfo as EquipableItemInfo).durability : ""
            }
              </a>
            <br /><a style={{ fontSize: "15px", color: "snow" }}>{equipments !== undefined && equipments?.Accessory !== undefined ? equipments.Accessory.itemInfo.description : ""}</a>
          </p> :
          ""
        }
        <div style={{ position: "absolute", bottom: "1vw", right: "1vw", width: "125px" }}>
          <a style={{ color: "white" }}
            onClick={handleClickOpen5}>{equipments !== undefined && equipments.Accessory !== undefined ? "· 버리기" : ""
            }</a><a> </a>
          <a style={{ color: "white" }}
          onClick={handleClickOpen2}
          >{equipments !== undefined && equipments.Accessory !== undefined ? "· 수리하기" : ""
          }</a>
        </div>
      </div>)
    }
  }



  function statinfo() {

    return (
      <div>
        <div className='balloon_01' style={{ width: "50vw", backgroundColor: "white", position: "absolute", top: "3.5rem", marginTop: "0.25rem" }}>
          <div style={{ color: " black", fontSize: "3vw" }}>
            <a style={{ color: "black" }}>기본: 500 </a><a style={{ color: "red" }}>무기: {w_stat !== undefined ? w_stat.hpmax : "0"}</a><a style={{ color: "green" }}> 장신구: {a_stat !== undefined ? a_stat.hpmax : "0"}</a>
          </div>
        </div>
        <div className='balloon_01' style={{ width: "50vw", backgroundColor: "white", position: "absolute", top: "6.4rem", marginTop: "0.25rem" }}>
          <div style={{ color: " black", fontSize: "3vw" }}>
            <a style={{ color: "black" }}>기본: 200 </a><a style={{ color: "red" }}> 무기: {w_stat !== undefined ? w_stat.attack : "0"}</a><a style={{ color: "green" }}> 장신구: {a_stat !== undefined ? a_stat.attack : "0"}</a>
          </div>
        </div>
        <div className='balloon_01' style={{ width: "50vw", backgroundColor: "white", position: "absolute", top: "9.3rem", marginTop: "0.25rem" }}>
          <div style={{ color: " black", fontSize: "3vw" }}>
            <a style={{ color: "black" }}>기본: 200 </a><a style={{ color: "red" }}> 무기: {w_stat !== undefined ? w_stat.defense : "0"}</a><a style={{ color: "green" }}> 장신구: {a_stat !== undefined ? a_stat.defense : "0"}</a>
          </div>
        </div>
        <div className='balloon_01' style={{ width: "50vw", backgroundColor: "white", position: "absolute", top: "12.2rem", marginTop: "0.25rem" }}>
          <div style={{ color: " black", fontSize: "3vw" }}>
            <a style={{ color: "black" }}>기본: 0</a><a style={{ color: "red" }}> 무기: {w_stat !== undefined ? w_stat.luck : "0"}</a><a style={{ color: "green" }}> 장신구: {a_stat !== undefined ? a_stat.luck : "0"}</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <div style={{ backgroundColor: "#F9FFFF", width: "100%", position:"relative", height:"100vh" }} className='all'>
        <div style={{
          height: "2.5rem",
          backgroundColor: "#dcedf8",
          textAlign: "center",
          padding: "0.8rem",
          width:"100vw"
        }}>
          <b>내 정보</b>
        </div>
        <div style={{ position: "absolute", marginLeft: "2vw", marginTop: "-2rem" }}
          onClick={function () {
            window.location.href = "/main";
          }}
        ><ArrowBackIcon /></div>
        <div style={{position:"absolute", top:"0.5rem", left:"2.5rem"}}><Typography
                sx={{
                  color: 'black',
                }}
              >
                메인으로
              </Typography></div>
              <div style={{position:"absolute", top:"0.5rem", right:"2.5rem"}}><Typography
                sx={{
                  color: 'black',
                }}
              >
                모험하기
              </Typography></div>
        <div style={{ width: "2rem", height: "2rem", overflow: "hidden", position: "absolute", top:"0.25rem", right:"2vw",}}>
          <img onClick={function () { window.location.href = "/adventure" }} style={{ width: "2rem", height: "2rem", objectFit: "cover" }} src='/static/UI 아이콘/모험.png' />
        </div>
        <div style={{width:"4rem", height:"2rem", borderRadius:"1rem", backgroundColor:"#afafee", position:"absolute", top:"3.5rem", right:"1rem",
                display: "flex",
                justifyContent: "center",fontSize:"13px",
                alignItems: "center", color:"white", zIndex:"10"}}
                onClick={handletypeOpen}
                
                >상성 관계</div>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >{statinfo()}
        </Backdrop>
        <Dialog
          open={open2}
          onClose={handleClosing}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            { (equipments?.Weapon)
              ? (equipments?.Weapon as WeaponEquipableItem).level * REPAIR_COST + " 골드를 소모하여 현재 장착 중인 무기를 수리하시겠습니까?"
              : ''
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              현재 보유 골드: {money}<br/>  
              남은 수리 가능 횟수는 {equipments?.Weapon?5-(equipments?.Weapon as AccessoryEquipableItem).repairCount:""}회 입니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosing}>아니오</Button>
            <Button onClick={
            function(){
              if(equipments!==undefined&&equipments.Weapon!==undefined)
            {
              fetch("/api/player/inventory/repair", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ itemId: equipments?.Weapon.id }),
            }).then(async (res) => {
              const data = await res.json()
              //console.log(data.message)
              setSwapweapon(equipments)
              if(data.message!==undefined){
                alert(data.message)
              }
              setOpen2(false);
              //window.location.reload()
            }
            )}}} autoFocus>
              예
            </Button>
          </DialogActions>
        </Dialog>

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


          <Dialog
          open={open5}
          onClose={handleClosing5}
          aria-labelledby="alert-dialog-title2"
          aria-describedby="alert-dialog-description2"
        >
          <DialogTitle id="alert-dialog-title2">
            정말 이 아이템을 버리시겠습니까?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description2">
              버려진 아이템은 복구할 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosing5}>아니오</Button>
            <Button onClick={
            function(){
              if(value===0){
              if (equipments?.Weapon !== undefined) {
                let stid = equipments?.Weapon.id
                //console.log(stid)
                fetch("/api/player/equipments/unequip", {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ itemType: ItemType.WEAPON }),
                }).then(async (res) => {
                  const data = await res.json()
                  setSwapweapon(equipments)
                  setPrevious(data.previous)
                  if (swapweapon !== undefined) {
                    swapweapon.Weapon = undefined
                    fetch("/api/player/inventory/remove", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ itemId: stid }),
                    }).then(async (res) => {
                      const data = await res.json()
                      //console.log(data.message)
                      setEn_name("")
                      setW_stat(undefined)
                      setOpen5(false);
                    }
                    )
                  }
                }
                )

              }}
              else if(value===1){
                if (equipments?.Accessory !== undefined) {
                  let stid = equipments?.Accessory.id
                  //console.log(stid)
                  fetch("/api/player/equipments/unequip", {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ itemType: ItemType.ACCESSORY }),
                  }).then(async (res) => {
                    const data = await res.json()
                    setSwapweapon(equipments)
                    setPrevious(data.previous)
                    if (swapweapon !== undefined) {
                      swapweapon.Accessory = undefined
                      fetch("/api/player/inventory/remove", {
                        method: "POST",
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ itemId: stid }),
                      }).then(async (res) => {
                        const data = await res.json()
                        //console.log(data.message)
                        setEn_name("")
                        setW_stat(undefined)
                        setOpen5(false);
                      }
                      )
                    }
                  }
                  )
              }
              }}} autoFocus>
              예
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={open3}
          onClose={handleClosing2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            { (equipments?.Accessory)
              ? (equipments?.Accessory as AccessoryEquipableItem).level * REPAIR_COST + " 골드를 소모하여 현재 장착 중인 장신구를 수리하시겠습니까?"
              : ''
            }
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            현재 보유 골드: {money}<br/>  
            남은 수리 가능 횟수는 {equipments?.Accessory?5-(equipments?.Accessory as AccessoryEquipableItem).repairCount:""}회 입니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosing2}>아니오</Button>
            <Button onClick={
            function(){
              
              if(equipments!==undefined&&equipments.Accessory!==undefined)
            {
              
              fetch("/api/player/inventory/repair", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ itemId: equipments?.Accessory.id }),
            }).then(async (res) => {
              const data = await res.json()
              //console.log(data.message)
              setSwapweapon(equipments)
              //window.location.reload()
              if(data.message!==undefined){
                alert(data.message)
              }
              setOpen3(false);
            }
            )}}} autoFocus>
              예
            </Button>
          </DialogActions>
        </Dialog>
        
        <div style={{ marginTop: "1rem", }}>
          <div style={{ position: "absolute", float: "left" }}>
            <div className='hpbox' ><img src="/static/heart.png"
              className='stat-box' />
              <div className='stat-minibox'><div className='stat'>{status?.hpmax}</div></div>
            </div>
            <div className='hpbox' style={{ backgroundColor: "orange" }} ><img src="/static/attack.png"
              className='stat-box' /><div className='stat-minibox'><div className='stat'>{status?.attack}</div></div>
            </div>
            <div className='hpbox' style={{ backgroundColor: "yellowgreen" }}><img src="/static/defense.png"
              className='stat-box' /><div className='stat-minibox'><div className='stat'>{status?.defense}</div></div></div>
            <div className='hpbox' style={{ backgroundColor:"skyblue"  }}>
              <img src="/static/luck.png"
                className='stat-box' /><div className='stat-minibox'><div className='stat'>{status?.luck}</div></div>
            </div>
          </div>
          <div style={{ marginBottom: "2vh", display: "flex", justifyContent: "center" }}>

            <div
              style={{//사진이 들어갈 자리
                width: "100vw",
                height: "80vw",
                marginBottom: "3vw",
                maxHeight: "68vw",
                maxWidth: "100vw",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                marginLeft: "-21vw"
              }}
            >
              <div style={{
                width: "120vw",
                height: "120vw", paddingTop: "20vw"
              }}>
                <Profile2 equipments={equipments} width={120} unit='vw' />
              </div>
            </div>
            {detailbox()}
          </div>
          <div className='tab' style={{position:"absolute", zIndex:"12"}}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="무기" {...a11yProps(0)} />
                      <Tab label="장신구" {...a11yProps(1)} />
                      <Tab label="코디" {...a11yProps(2)} />
                      <Tab label="인챈트" {...a11yProps(3)} />
                    </Tabs>
                  </div>
          <div className='big-box'>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                position:"relative"
              }}
            >
              <Box sx={{ width: '100vw' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  
                </Box>
                <TabPanel value={value} index={0} >
                  <div style={{width:"50vw", height:"49px"}}></div>
                  {
                //<div style={{color:"#6666c0", position:"absolute", left:"8vw"}}>{addWslots!==0?weaponSlots.length-addWslots:weaponSlots.length}/24</div>
                  }<div
                  className='slot-box2' style={{ display: "inline" }}>
                    
                  <div style={{
                    marginTop: "-10px", position: "absolute", right: "2vw", display: "flex",
                    flexWrap: "wrap", width: "15rem"
                  }}>
                  
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth size='small'>
                        <InputLabel id="demo-simple-select-label">정렬</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          label="Age"
                          onChange={handleChanging}
                        >
                          <MenuItem value="획득 순">획득 순</MenuItem>
                          <MenuItem value="레벨 순">레벨 순</MenuItem>
                          <MenuItem value="속성 순">속성 순</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <div style={{ width: "4vw" }}></div>
                    <div style={{marginTop:"0px"}}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // TODO Replace with Stack
                        '& > :not(style) + :not(style)': { mt: 2 },
                      }}
                    >
                      <ToggleButtonGroup size='small'{...control}>
                        {children}
                      </ToggleButtonGroup>
                    </Box>
                    </div>
                  </div>
                  <div className='slot-slot' style={{ marginTop: "15px" }}>
                    {weaponSlots}</div>
                </div></TabPanel>
                <TabPanel value={value} index={1}>
                  <div style={{width:"50vw", height:"49px"}}></div>
                {
                //<div style={{color:"#6666c0", position:"absolute", left:"8vw"}}>{addAslots!==0?accessorySlots2.length-addAslots:accessorySlots2.length}/24</div>
                }
                <div
                  className='slot-box2' style={{ display: "inline" }}>
                  <div style={{
                    marginTop: "-10px", position: "absolute", right: "2vw", display: "flex",
                    flexWrap: "wrap", width: "15rem"
                  }}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth size='small'>
                        <InputLabel id="demo-simple-select-label">정렬</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={age}
                          label="Age"
                          onChange={handleChanging}
                        >
                          <MenuItem value="획득 순">획득 순</MenuItem>
                          <MenuItem value="레벨 순">레벨 순</MenuItem>
                          <MenuItem value="속성 순">속성 순</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <div style={{ width: "4vw" }}></div>
                    <div style={{marginTop:"0px"}}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // TODO Replace with Stack
                        '& > :not(style) + :not(style)': { mt: 2 },
                      }}
                    >
                      <ToggleButtonGroup size='small'{...control}>
                        {children}
                      </ToggleButtonGroup>
                    </Box>
                    </div>
                  </div>
                  <div className='slot-slot' style={{marginTop:"15px"}}>
                    {accessorySlots2}</div>
                </div></TabPanel>
                <TabPanel value={value} index={2}>
                  <div style={{width:"50vw", height:"49px"}}></div>
                  <div
                  className='slot-box2'>
                  <div className='cordi-text-box'><a style={{ marginLeft: "8vw" }}>헤어</a></div><div className='slot-slot2'>{hairSlots}</div>
                  <div className='cordi-text-box'><a style={{ marginLeft: "8vw" }}>의상</a></div><div className='slot-slot2'>{suitSlots}</div>
                  <div className='cordi-text-box'><a style={{ marginLeft: "8vw" }}>얼굴</a></div><div className='slot-slot2'>{faceSlots}</div>
                  <div className='cordi-text-box'><a style={{ marginLeft: "8vw" }}>데코</a></div><div className='slot-slot2'>{decoSlots}</div>
                </div>
                </TabPanel>
                <TabPanel value={value} index={3} >
                  
                <div style={{width:"50vw", height:"49px"}}></div>
                <div
                  className='slot-box2'
                  style={{paddingLeft:"8vw"}}
                  >  
                    {enchantSlots}
                  </div>
                </TabPanel>
              </Box>
            </div>
          </div>
        </div>
      </div></ThemeProvider>
  )
}

export default Home
