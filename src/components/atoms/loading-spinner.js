import React from 'react';
import { darkThemeValues } from '../theme-styles';
import PacmanLoader from 'react-spinners/PacmanLoader';

const LoadingSpinner = () => (
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
        background: darkThemeValues.backgroundColor.inverse,
        zIndex: 30,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
          gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
          height: '6rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '2rem',
          }}
        >
          <PacmanLoader color={darkThemeValues.textColor.tertiary} />
        </div>
        <div
          style={{
            marginTop: '3rem',
            color: darkThemeValues.textColor.secondary,
            fontWeight: 700,
            fontSize: '18px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>Zac Braddy</div>
          <div>Lead Software Engineer</div>
        </div>
      </div>
    </div>
  </>
);
export default LoadingSpinner;
