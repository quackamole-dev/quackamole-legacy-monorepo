import React from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Typography, Box, Button, useMediaQuery} from '@material-ui/core';
import theme from '../../style/theme/MainTheme';
import {Link} from 'react-router-dom';
import BulletPoint from './BulletPoint/BulletPoint';

const useStyles = makeStyles({
  header: {
    color: 'white',
    textTransform: 'uppercase',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    width: '40%',
    minWidth: 310
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: '98px'
  },
  buttonStyle: {
    borderRadius: '5px',
    // width: '106px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#FBC02D',
    '&:hover': {
      backgroundColor: '#f9a825'
    },
    '&:focus': {
      outline: 0
    }
  },
  mainImg: {
    display: 'flex',
    height: 224,
    width: 309,
    borderRadius: 5,
    marginTop: 76,
    marginLeft: 36,
    marginRight: 36
  },
  smallScreenMainImg: {
    display: 'flex',
    height: 224,
    width: 309,
    borderRadius: 5,
    margin: 36
  },
  bulletPoints: {
    display: 'flex',
    justifyContent: 'center',
    zIndex: '3',
    position: 'relative',
    bottom: 150
  },
  smallScreenBulletPoints: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 72
  }
});

const Home = () => {
  const classes = useStyles();
  const smallScreen = useMediaQuery('(max-width: 950px)');
  const bulletPoints = [
    {
      title: 'Gaming',
      icon: 'VideogameAssetIcon',
      image: 'https://via.placeholder.com/400x300',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.'
    },
    {
      title: 'Working',
      icon: 'AssessmentOutlinedIcon',
      image: 'https://via.placeholder.com/400x300',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.'
    },
    {
      title: 'Chatting',
      icon: 'CallOutlinedIcon',
      image: 'https://via.placeholder.com/400x300',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec nec urna dolor. Maecenas vehicula dui ut quam imperdiet.'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      {/* Header */}
      <Box height={63} bgcolor='#2E7D32' className={classes.header}>
        <h1>
          <span role={'img'} aria-label={'a duck'}>🦆 </span>
          Quackamole
          <span role={'img'} aria-label={'an avocado'}> 🥑</span>
        </h1>
      </Box>

      {/* Body */}
      <Box height={540} display='flex' zIndex={1}>
        <Box className={smallScreen ? classes.smallScreenBox : classes.box} bgcolor='#388E3C'>
          <div className={classes.titleContainer}>
            <Typography variant='h3' className={classes.titleStyle} gutterBottom align='center'>
              Peer-to-peer video chat platform
            </Typography>
            <Link to="/create-room" style={{ textDecoration: 'none' }}>
              <Button size="large" className={classes.buttonStyle}>Create a room</Button>
            </Link>
          </div>
          <img
            src='https://via.placeholder.com/400x300'
            className={smallScreen ? classes.smallScreenMainImg : classes.mainImg}
            alt={'quackamole room preview'}
          />
        </Box>
      </Box>

      {/* Bullet Points */}
      <div className={smallScreen ? classes.smallScreenBulletPoints : classes.bulletPoints}>
        {bulletPoints.map((data, i) => <BulletPoint content={data} key={data.title + i}> </BulletPoint>)}
      </div>

      {/*Temporary for debugging purposes*/}
      <Link to={'/rooms/dummy-room-id'}>Test room</Link>
    </ThemeProvider>
  );
};

export default Home;
