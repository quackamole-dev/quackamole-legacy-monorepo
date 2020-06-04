import React from 'react';
import {ThemeProvider, makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import theme from '../../style/theme/MainTheme';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";
import BulletPoint from "./BulletPoint/BulletPoint";
import {useMediaQuery} from '@material-ui/core'


const useStyles = makeStyles({
    box: {
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    smallScreenBox: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    titleContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '30%',
        minWidth: 310,
    },
    titleStyle: {
        color: 'white',
        fontWeight: 'bold',
        marginTop: '98px'
    },
    buttonStyle: {
        borderRadius: '5px',
        width: '106px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: '#FBC02D',
        '&:hover': {
            backgroundColor: '#f9a825',
        },
        '&:focus': {
            outline: 0,
        }
    },
    mainImg: {
        display: 'flex',
        height: 224,
        width: 309,
        borderRadius: 5,
        marginTop: 76,
        marginLeft: 36,
        marginRight: 36,
    },
    smallScreenMainImg: {
        display: 'flex',
        height: 224,
        width: 309,
        borderRadius: 5,
        margin: 36,
    },
    bulletPoints: {
        display: 'flex',
        justifyContent: 'center',
        zIndex: '3',
        position: 'relative',
        bottom: 150,
    },
    smallScreenBulletPoints: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 72,
    }
});


const Home = () => {
    const classes = useStyles();
    const smallScreen = useMediaQuery("(max-width: 950px)")
    const bulletPoints = [
        {
            title: 'Gaming',
            icon: 'ToysOutlinedIcon',
            image: 'https://image.freepik.com/free-vector/realistic-radiant-magic-portals-pink-vs-blue-with-light-effects-black-background-illustration_1284-31390.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.',
        },
        {
            title: 'Working',
            icon: 'AssessmentOutlinedIcon',
            image: 'https://image.freepik.com/free-vector/teamwork-concept-illustration_1284-20522.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.',
        },
        {
            title: 'Chatting',
            icon: 'CallOutlinedIcon',
            image: 'https://image.freepik.com/free-vector/group-chat-concept-illustration_114360-1495.jpg',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.',
        }
    ]
    
    

    return (
        <ThemeProvider theme={theme}>
            {/* Header */}
            <Box
                height={63}
                bgcolor='#2E7D32'
            > </Box>

            {/* Body */}
            <Box
                height={540}
                display='flex'
                zIndex={1}
            >
                <Box
                    className={smallScreen?classes.smallScreenBox:classes.box}
                    bgcolor= '#388E3C'
                >
                    <div className={classes.titleContainer}>
                    <Typography
                        variant='h3'
                        className={classes.titleStyle}
                        gutterBottom
                        align='center'
                    > Create now a room and have fun
                    </Typography>
                    <Link to="/create-room" style={{textDecoration: 'none'}}>
                        <Button
                            size="large"
                            className={classes.buttonStyle}
                        >
                            Create
                        </Button>
                    </Link>
                    </div>
                    <img src="https://www.zohowebstatic.com/sites/default/files/cliq-primetime-features.jpg"
                        className={smallScreen?classes.smallScreenMainImg:classes.mainImg}
                    />
                </Box>
            </Box>

            {/* Bullet Points */}
            <div className={smallScreen?classes.smallScreenBulletPoints:classes.bulletPoints}>
                {
                    bulletPoints.map(data => 
                        <BulletPoint content={data}></BulletPoint>
                    )
                }
            </div>

            
            {/*Temporary for debugging purposes*/}
            <Link to={'/rooms/dummy-room-id'}>Test room</Link>
        </ThemeProvider>
    )
};

export default Home;
