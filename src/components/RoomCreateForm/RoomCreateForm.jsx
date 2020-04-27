import React from 'react';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    containerStyle: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '128px'
    },
    titleStyle: {
        display: 'flex',
        justifyContent: 'center',
        padding: '16px',
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#FB8C00',
    },
    formControl: {
        width: '20%',
        margin: '16px'
    },
    select: {
        borderColor: '#FB8C00',
        '&:before': {
            borderColor: '#FB8C00',
        },
        '&:after': {
            borderColor: '#f57c00',
        }
    },
    textfield: {
        width: '616px',
        marginLeft: '16px',
    },
    alignButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '16px'
    },
    myButton: {
        color: 'white',
        boxShadow: 'none'
    }
})

const RoomCreateForm = () => {
    const [status, setStatus] = React.useState('');
    const [name, setName] = React.useState('')

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    const handleChangeTexfield = (event) => {
        setName(event.target.value)
    }

    const createRoom = () => {
        if(name.length > 0 && status.length > 0) {
            console.log(status, name)
        } else {
            console.log('error')
        }
    }

    const classes = useStyles()
        

    return (
        <ThemeProvider theme={theme}>
            {/* Header */}
            <Box 
                height={63}
                bgcolor='#E53935'
            ></Box>

            {/* Body */}
            <Container
                className={classes.containerStyle}
            >
                <Box
                    display='flex'
                    flexDirection='column'
                    width={648}
                    height={307}
                    borderRadius='5px'
                    bgcolor='white'
                >
                    <Typography
                        variant='h4'
                        className={classes.titleStyle}
                    >Create a new room
                    </Typography>

                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                        <Select
                    
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={status}
                        onChange={handleChange}
                        label="Status"
                        className={classes.select}
                        >
                        <MenuItem value={'Privat'}>Privat</MenuItem>
                        <MenuItem value={'Public'}>Public</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        required
                        id="outlined-required"
                        label="Room name"
                        variant="outlined"
                        value={name}
                        onChange={handleChangeTexfield}
                        className={classes.textfield}
                    />
                    <div className={classes.alignButton}>
                        <Button
                            size="large"
                            color="secondary"
                            variant="contained"
                            className={classes.myButton}
                            onClick={createRoom}                       
                        >
                            next
                        </Button>
                    </div>
                </Box>
            </Container>
        </ThemeProvider>
    )
};

export default RoomCreateForm;
