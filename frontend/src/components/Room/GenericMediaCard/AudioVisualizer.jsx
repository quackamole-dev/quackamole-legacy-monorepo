import React, {useEffect, useRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Card} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  visualizer: {
    transition: 'box-shadow 0.2s'
  }
}));

const AudioVisualizer = ({ stream, children, styles }) => {
  const classes = useStyles();
  const audioIndicatorRef = useRef(null);

  useEffect(() => {
    let handler = null;
    if (stream && audioIndicatorRef.current) {

      if (!stream.getAudioTracks()[0]) {
        audioIndicatorRef.current.style.boxShadow = 'none';
        return;
      }

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.25;

      analyser.fftSize = 512;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Float32Array(analyser.fftSize);

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const checkIfUserIsSpeaking = () => {
        analyser.getFloatTimeDomainData(dataArray);

        // Compute average power over the interval. Based on this: https://stackoverflow.com/a/44360729
        let sumOfSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          sumOfSquares += dataArray[i] ** 2;
        }
        const avgPowerDecibels = 10 * Math.log10(sumOfSquares / bufferLength);

        if (avgPowerDecibels === -Infinity) return;
        // Add box shadow when speaking (attention: this is circumventing react rendering)
        // FIXME not happy with how it looks yet. Experiment with different ways to visualize audio
        if (avgPowerDecibels >= -40) {
          audioIndicatorRef.current.style.boxShadow = `0px 0px 0px 2px rgb(46, 125, 50)`;
        } else {
          audioIndicatorRef.current.style.boxShadow = 'none';
        }
      };

      if (!handler) {
        handler = setInterval(checkIfUserIsSpeaking, 1000 / 15);
      }
    }

    return () => {
      if (handler) clearInterval(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream, audioIndicatorRef]);

  return (
    <Card className={classes.visualizer} ref={audioIndicatorRef} style={styles}>
      {children}
    </Card>
  );
};

export default AudioVisualizer;
