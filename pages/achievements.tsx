import type { NextPage } from 'next'
import React, { SetStateAction } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MuiThemeProvider} from '@material-ui/core/styles';
import { EquipableItem, Item } from 'src/entity/Item';
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
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
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
    let [allmonster, setAllmonster] = React.useState(30)
    let [seenmonster, setSeenmonster] = React.useState(4)

  interface AchievementForPlayer{
      name: string
      detail: string
      honored: string
  }
  interface ProgressForPlayer{
      name: string
      current: number
      next: number
  }
 let [achieveds,setAchieveds]= React.useState<AchievementForPlayer[] | undefined>(undefined)
 let [chosen,setChosen]= React.useState<string | undefined>(undefined)
 let [newachieve,setNewachieve]= React.useState<AchievementForPlayer[] | undefined>(undefined)
let achievements=[]
let unachievements=[]
const handleClickOpen5 = () => {
  setOpen5(true);
};
const handleClosing5 = () => {
  setOpen5(false);
};
const [open5, setOpen5] = React.useState(false);
    React.useEffect(function () {
        if (navigator.userAgent.match(/Android/i)) {
          window.scrollTo(0, 1);
        }
        else if (navigator.userAgent.match(/iPhone/i)) {
          window.scrollTo(0, 1);
        }
      }, [])

      React.useEffect(function () {
        fetch("/api/player/achievement/honors", {method: 'POST'}).then(async (response) => {
          const data = await response.json()
          //console.log(data.honors)
          //console.log(data.message)
        })
      }, [])

      React.useEffect(function () {
        fetch("/api/player/achievement/check", {method: 'POST'}).then(async (response) => {
          const data = await response.json()
          setNewachieve(data.achieveds)
          if(data.achieveds!==undefined&&data.achieveds!==null&&data.achieveds.length!==0){
            setOpen5(true)
          }
          //console.log(data.achieveds)
          //console.log(data.message)
        })
      }, [])

      React.useEffect(function () {
        fetch("/api/player/achievement/current", {method: 'POST'}).then(async (response) => {
          const data = await response.json()
          setAchieveds(data.achieveds)
          //console.log(data.achieveds)
          //console.log(data.progress)
          //console.log(data.message)
        })
      }, [chosen])


      React.useEffect(function () {
        fetch("/api/player/achievement/get-honored", {method: 'POST'}).then(async (response) => {
          const data = await response.json()
          setChosen(data.honored)
          console.log(data.honored)
          //console.log(data.message)
        })
      }, [chosen])

      if(achieveds!==undefined){
        for(let i=0;i<achieveds.length;i++)
        {
          let clr="white"
          achievements.push(
          <div
          key={i+"달성 업적"}
          onClick={function(){
            clr="#afafee"
            fetch("/api/player/achievement/select", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ selected: i }),
            }).then(async (res) => {
              const data = await res.json();
              //console.log(data.honored)
              setChosen(data.honored)
              
              //console.log(data.message)
            });
          }}
          className={achieveds[i]!==undefined&&achieveds[i].honored!==undefined&&achieveds[i].honored===chosen?'ach-slot2':'ach-slot'}
          >
          <div className={achieveds[i]!==undefined&&achieveds[i].honored!==undefined&&achieveds[i].honored===chosen?'ach-name-round2':'ach-name-round'}>
        <b style={{fontSize:"4vw"}}
        
        >{achieveds[i]!==undefined&&achieveds[i].honored!==undefined?achieveds[i].honored:""}</b>
        </div>
        <p style={{fontSize:"4vw"}}>업적 이름: {achieveds[i]!==undefined&&achieveds[i].name!==undefined?achieveds[i].name:""}</p>
        <p style={{fontSize:"4vw"}}>달성 조건: {achieveds[i]!==undefined&&achieveds[i].detail!==undefined?achieveds[i].detail:""}</p>
        </div>
        )}
        for(let i=0;i<26-achieveds.length;i++){
          unachievements.push(
          <div
          key={i+"미달성 업적"}
          className='un-ach-slot'>???</div>)
        }

      }


  return (
    <ThemeProvider theme={theme}>
        <div style={{ backgroundColor: "#F9FFFF", width: "100%", height:"100vh"}} className='all2'>
        <div style={{
          height: "2.5rem",
          backgroundColor: "#dcedf8",
          textAlign: "center",
          padding: "0.8rem",
          width:"100vw",
          position:"absolute",
          top:"0",
          zIndex:"100",
        }}>
          <b>업적</b>
        </div>
        <div style={{ position: "absolute", marginLeft: "2vw", top:"0.5rem",zIndex:"101" }}
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
            새로운 업적 달성!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description2">
              {newachieve!==undefined?newachieve.length+"개의 업적을 새롭게 달성하였습니다.":""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosing5}>확인</Button>
          </DialogActions>
        </Dialog>


        <div className='ill-how-much' style={{top:"3.5rem"}}>달성한 업적: {achieveds!==undefined?achieveds.length:""}/26</div>
        <div className='ill-big-box' style={{marginTop:"10vw", width:"100vw", paddingLeft:"6vw", paddingTop:"2rem"}}>
        {achievements}
        {unachievements}
        </div>
        
        </div>
    </ThemeProvider>
  )
}

export default Home
