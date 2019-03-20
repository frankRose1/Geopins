import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker } from 'react-map-gl';
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from './PinIcon';
import Blog from './Blog';
import Context from '../context';
import { MAPBOX_TOKEN } from '../config';

const initialViewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [viewport, setViewport] = useState(initialViewport);
  const [userPosition, setUserPosition] = useState(null);
  // when the component mounts the user's position should be updated
  useEffect(() => {
    getUserPosition();
  }, []);

  /**
   * Uses geolocation to get a user's current position
   */
  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  /**
   * Handles the placment of a draft pin. Will only pin the draft if a user clicks
   * with the left mouse button. Thr draft pins location is managed in context, and a marker
   * is placed on the map when a user clicks.
   */
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draftPin) {
      dispatch({ type: 'CREATE_DRAFT_PIN' });
    }
    const [longitude, latitude] = lngLat;
    const payload = { longitude, latitude };
    dispatch({ type: 'UPDATE_DRAFT_LOCATION', payload });
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onClick={handleMapClick}
        onViewportChange={newViewport => setViewport(newViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        {...viewport}
      >
        {/* Nav Control */}
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewport => setViewport(newViewport)}
          />
        </div>

        {/* Pin for a user's current position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size='40px' color='red' />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draftPin && (
          <Marker
            latitude={state.draftPin.latitude}
            longitude={state.draftPin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon size='40px' color='hotpink' />
          </Marker>
        )}
      </ReactMapGL>

      {/* Blog and Pin Content */}
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};

export default withStyles(styles)(Map);
