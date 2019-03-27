/**
 * Reducer will update the state according to action type
 * @param {object} state - state of the application, provided via context
 * @param {object} action - action to perform in order to update state, must have a "type" key
 */
export default function reducer(state, { type, payload }) {
  switch (type) {
    case 'LOGIN_USER':
      return {
        ...state,
        currentUser: payload
      };
    case 'IS_LOGGED_IN':
      return {
        ...state,
        isAuth: payload
      };
    case 'SIGNOUT_USER':
      return {
        ...state,
        currentUser: null,
        isAuth: false
      };
    case 'CREATE_DRAFT_PIN':
      return {
        ...state,
        currentPin: null,
        draftPin: {
          latitude: 0,
          longitude: 0
        }
      };
    case 'UPDATE_DRAFT_LOCATION':
      return {
        ...state,
        draftPin: {
          ...payload
        }
      };
    case 'DELETE_DRAFT_PIN':
      return {
        ...state,
        draftPin: null
      };
    case 'GET_PINS':
      return {
        ...state,
        pins: payload
      };
    case 'CREATE_PIN':
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return {
        ...state,
        pins: [...prevPins, { ...newPin }]
      };
    case 'DELETE_PIN':
      const pinToDelete = payload;
      const filteredPins = state.pins.filter(
        pin => pin._id !== pinToDelete._id
      );
      // if a user deletes a pin, it will set other user's currentPin to null without this conditional
      if (state.currentPin) {
        const isCurrentPin = pinToDelete._id === state.currentPin._id;
        if (isCurrentPin) {
          return {
            ...state,
            currentPin: null,
            pins: filteredPins
          };
        }
      }
      return {
        ...state,
        pins: filteredPins
      };
    case 'SET_CURRENT_PIN':
      // when a user is selecting a pin they should not be able to create a new pin,
      //so draft pin will be set to null
      return {
        ...state,
        currentPin: payload,
        draftPin: null
      };
    case 'CREATE_COMMENT':
      //need to update the current pin with the new comments
      const updatedCurrentPin = payload;
      const updatedPin = state.pins.map(pin =>
        pin._id === updatedCurrentPin._id ? updatedCurrentPin : pin
      );
      return {
        ...state,
        currentPin: updatedCurrentPin,
        pins: updatedPin
      };
    default:
      return state;
  }
}
