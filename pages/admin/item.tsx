import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { OnChangeFunc } from 'src/components/type-misc'
import InputCheckValid from 'src/components/InputCheckValid'
import SubmitCheckValid from 'src/components/SubmitCheckValid'
import { inputField } from 'pages/user/sign-up';
import { ItemInfo } from 'src/entity/ItemInfo';
import { ItemType } from 'src/enums/ItemType';

const theme = createTheme();

export default function ItemProvider() {
  let [id, setId] = React.useState<number | undefined>(undefined);
  React.useEffect(function () {
    fetch("/api/admin/player/id", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
        setId(data.id)
      })
      .catch(err => {
        console.log(err.message)
        alert("플레이어 정보를 가져오는 중 실패했습니다.")
      })
  }, [])

  let [item, setItem] = React.useState<inputField>({ value: "", message: "", isValid: false });

  const itemChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!(parseInt(value) > 0)) {
      setItem({ value: value, message: "아이템 id 형식이 올바르지 않습니다.", isValid: false });
    } else {
      setItem({ value: value, message: "", isValid: true });
    }
  };

  let [itemInfo, setItemInfo] = React.useState<ItemInfo | undefined>(undefined);

  React.useEffect(function () {
    let value = parseInt(item.value)
    console.log(value)
    if (!(value > 0)) {
      return;
    }
    fetch("/api/admin/item-info/get-info", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemInfoId: value,
      })
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)
        setItemInfo(data.itemInfo)
        let additional = data.itemInfo.itemType === ItemType.WEAPON || data.itemInfo.itemType === ItemType.ACCESSORY
        setItemLevel(Object.assign({},
          itemLevel, {
            message: "무기와 장신구의 경우 아이템 레벨이 필요합니다.",
            isValid: !additional,
        }))
        setSharpness(Object.assign({},
          sharpness, {
            message: "무기와 장신구의 경우 날카로움이 필요합니다.",
            isValid: !additional,
        }))
      })
      .catch(err => {
        console.log(err.message)
        setItemInfo(undefined)
        setItem(Object.assign({},
          item, {
          message: "해당하는 아이템이 없습니다.",
          isValid: false,
        }))
        // alert("아이템 정보를 가져오는 중 실패했습니다.")
      })
  }, [item.value])


  let [itemLevel, setItemLevel] = React.useState<inputField>({ value: "", message: "", isValid: false });

  const itemLevelChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!(parseInt(value) >= 0 && parseInt(value) <= 5)) {
      setItemLevel({ value: value, message: "아이템 레벨 형식이 올바르지 않습니다.", isValid: false });
    } else {
      setItemLevel({ value: value, message: "", isValid: true });
    }
  };

  let [sharpness, setSharpness] = React.useState<inputField>({ value: "", message: "", isValid: false });

  const sharpnessChange: OnChangeFunc = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let value = event.target.value;
    if (!(parseInt(value) >= 0 && parseInt(value) <= 20)) {
      setSharpness({ value: value, message: "날카로움 형식이 올바르지 않습니다.", isValid: false });
    } else {
      setSharpness({ value: value, message: "", isValid: true });
    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    fetch("/api/admin/player/inventory/add-item", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId: id,
        itemInfoId: data.get('item'),
        itemLevel: data.get('itemLevel') !== "" ? data.get('itemLevel') : 0,
        sharpness: data.get('sharpness') !== "" ? data.get('sharpness') : 0
      }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (res.status >= 400)
          throw new Error(data.message)

        alert("아이템 발급 완료")
        location.href = "/"
      })
      .catch(err => {
        console.log(err.message)
        alert("올바르지 않은 정보가 입력되었습니다.")
      })
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            아이템 발급
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid>
              <InputCheckValid input='item' label='아이템 ID' isPassword={false} onChange={itemChange} value={item.value} isValid={item.isValid} message={item.message} ></InputCheckValid>
              <p>{
                (itemInfo !== undefined) ? (
                  itemInfo.name
                ) : (
                  "아이템 ID를 입력해주세요."
                )
              }</p>
              <div>
                <InputCheckValid
                  input='itemLevel'
                  label='아이템 레벨'
                  isPassword={false}
                  onChange={itemLevelChange}
                  value={itemLevel.value}
                  isValid={itemLevel.isValid}
                  message={itemLevel.message} >
                </InputCheckValid>
                <InputCheckValid
                  input='sharpness'
                  label='날카로움'
                  isPassword={false}
                  onChange={sharpnessChange}
                  value={sharpness.value}
                  isValid={sharpness.isValid}
                  message={sharpness.message} >
                </InputCheckValid>
              </div>
            </Grid>
            <SubmitCheckValid enabled={id !== undefined && itemInfo !== undefined && item.isValid && itemLevel.isValid && sharpness.isValid} label='요청'></SubmitCheckValid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
