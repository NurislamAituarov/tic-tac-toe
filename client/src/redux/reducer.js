const initialState = {
  userName: '',
  connectedUser: '',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        userName: action.payload,
      };
    case 'ADD_CONNECTED_USER':
      return {
        ...state,
        connectedUser: action.payload,
      };
    default:
      return state;
  }
}
