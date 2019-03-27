import React, { useState, useEffect, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { Subscription } from 'react-apollo';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import PinIcon from './PinIcon';
import Blog from './Blog';
import Context from '../context';
import { GET_PINS_QUERY } from '../graphql/queries';
import { useClient } from '../client';
import { MAPBOX_TOKEN } from '../config';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import {
  PIN_ADDED_SUBSCRIPTION,
  PIN_DELETED_SUBSCRIPTION,
  PIN_UPDATED_SUBSCRIPTION
} from '../graphql/subscriptions';

const initialViewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [client] = useClient();
  const mobileSize = useMediaQuery('(max-width: 650px)');
  const [viewport, setViewport] = useState(initialViewport);
  const [userPosition, setUserPosition] = useState(null);

  // if user deletes a pin, must also delete the popup so that it updates on another user's ui
  //if length of pins changes
  useEffect(() => {
    const pinExists =
      popup && state.pins.findIndex(pin => pin._id === popup._id) > -1;
    if (!pinExists) {
      setPopup(null);
    }
  }, [state.pins.length]);

  // when the component mounts the user's position should be updated
  useEffect(() => {
    getUserPosition();
  }, []);

  const [popup, setPopup] = useState(null);

  useEffect(() => {
    getPins();
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
   * Fetches pins and plots the locations on the map
   */
  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: 'GET_PINS', payload: getPins });
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

  /**
   * Hightlights recently pins created in the last 30 min so the user knows which are more recent.
   * @param {object} pin - pin object to be hightlighted on the map
   * @return {string} color representing a newly created pin, or darkblue by default
   */
  const highlightNewPin = pin => {
    const diff = differenceInMinutes(Date.now(), Number(pin.createdAt));
    return diff <= 30 ? 'limegreen' : 'darkblue';
  };

  /**
   * Handles displaying a pop up when a pin is clicked.
   * @param {object} pin - pin marker that was clicked on the map
   */
  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: 'SET_CURRENT_PIN', payload: pin });
  };

  const handleDeletePin = async pin => {
    const variables = { pinId: pin._id };
    await client.request(DELETE_PIN_MUTATION, variables);
    setPopup(null);
  };

  const isAuthUser = () => {
    return state.currentUser._id === popup.author._id;
  };

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        onClick={handleMapClick}
        onViewportChange={newViewport => setViewport(newViewport)}
        scrollZoom={!mobileSize}
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

        {/* Created Pins */}
        {state.pins.map(pin => (
          <Marker
            key={pin._id}
            latitude={pin.latitude}
            longitude={pin.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon
              onClick={() => handleSelectPin(pin)}
              size='40px'
              color={highlightNewPin(pin)}
            />
          </Marker>
        ))}

        {/* Popup dialog for a selected pin */}
        {popup && (
          <Popup
            anchor='top'
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img
              className={classes.popupImage}
              src={popup.image}
              alt={popup.title}
            />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>

      {/* Subscriptions for Creating/Updating/Deleting Pins */}
      <Subscription
        subscription={PIN_ADDED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: 'CREATE_PIN', payload: pinAdded });
        }}
      />
      <Subscription
        subscription={PIN_UPDATED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          console.log(pinUpdated);
          dispatch({ type: 'CREATE_COMMENT', payload: pinUpdated });
        }}
      />
      <Subscription
        subscription={PIN_DELETED_SUBSCRIPTION}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          console.log(pinDeleted);
          dispatch({ type: 'DELETE_PIN', payload: pinDeleted });
        }}
      />

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
