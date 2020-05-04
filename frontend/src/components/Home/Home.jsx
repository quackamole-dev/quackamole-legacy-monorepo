import React from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";


const useStyles = makeStyles({
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: '98px'
    },
    buttonStyle: {
        borderRadius: '50px',
        width: '106px',
        fontWeight: 'bold',
        border: '2px solid #E53935',
        '&:hover': {
            color: 'white',
            backgroundColor: '#E53935',
        },
        '&:focus': {
            outline: 0,
        }
    }
});


const Home = () => {

    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            {/* Header */}
            <Box
                height={63}
                bgcolor='#E53935'
            > </Box>

            {/* Body */}
            <Box
                height={640}
                display='flex'
            >
                {/* left box */}
                <Box
                    display='flex'
                    flexDirection='column'
                    width='50%'
                    height='100%'
                    bgcolor='#FDD835'
                    alignItems='center'
                >
                    <Typography
                        variant='h3'
                        className={classes.titleStyle}
                        gutterBottom
                    > Create a new room
                    </Typography>
                    <Link to="/create-room" style={{textDecoration: 'none'}}>
                        <Button
                            size="large"
                            color='primary'
                            className={classes.buttonStyle}
                        >
                            Create
                        </Button>
                    </Link>
                </Box>

                {/* right box */}
                <Box
                    display='flex'
                    flexDirection='column'
                    width='50%'
                    height='100%'
                    bgcolor='#FB8C00'
                    alignItems='center'
                >
                    <Typography
                        variant="h3"
                        className={classes.titleStyle}
                        gutterBottom
                    > Join a room
                    </Typography>
                    <Button
                        size="large"
                        color='primary'
                        className={classes.buttonStyle}
                    >Join
                    </Button>
                </Box>
            </Box>
            {/*Temporary for debugging purposes*/}
            <Link to={'/test-room'}>Debug Testroom</Link>
        </ThemeProvider>
    )
};

export default Home;
