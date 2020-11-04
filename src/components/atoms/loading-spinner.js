import React from 'react';
import { darkThemeValues } from '../theme-styles';
import PacmanLoader from 'react-spinners/PacmanLoader';

export default () => (
  <>
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkThemeValues.backgroundColor.primary,
      }}
    >
      <PacmanLoader color={darkThemeValues.iconColor.secondary} />
    </div>
  </>
);
