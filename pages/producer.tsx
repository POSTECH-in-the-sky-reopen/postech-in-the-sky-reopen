import * as React from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Producers() {

    let [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button
                onClick={handleOpen}
                sx={{
                    width: '100%',
                    color: 'black',
                }}
            >
                <Typography        
                align = 'center'
                >
                제작
                </Typography>
            </Button>
            <Dialog
                onClose={handleClose}
                open={open}
                fullWidth={true}
            >
                <DialogContent>
                    <Typography
                    align = 'center'
                    sx={{
                        my: 2,
                        fontWeight: 'bold',
                    }}>
                        김준서 양승원 이지은 이채린
                    </Typography>
                    <Typography
                    align = 'center'
                    sx={{                        
                        my: 2,
                        fontWeight: 'bold',
                    }}
                    >
                        정유진 황윤하 황주원
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        fullWidth
                        sx={{
                            bgcolor: '#CCCCCC',
                            color: '#000000',
                        }}
                    >확인</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Producers;
