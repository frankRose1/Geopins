import React from 'react';
import PlaceTwoTone from '@material-ui/icons/PlaceTwoTone';

export default ({ size, color, handleClick }) => (
  <PlaceTwoTone
    onClick={handleClick}
    style={{ fontSize: size, color: color }}
  />
);
