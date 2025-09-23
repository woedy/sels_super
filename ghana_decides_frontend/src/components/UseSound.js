import React from 'react';
import useSound from 'use-sound';
import tapSound from '../assets/sounds/ui-click-43196.mp3'; // Path to your tap sound file

const useTapSound = (volume = 1) => {
    const [play] = useSound(tapSound, { volume });
  
    const playTapSound = () => {
      play();
    };
  
    return playTapSound;
  };
  
  export default useTapSound;
