import { combineReducers } from "redux";

const INITIAL_STATE = {
  email: "",
  phone: "",
  location: {
    Address: "",
    Name: "",
    Retailer: ""
  },
  name: "",
  phone: "",
  shift: "",
  type: ""
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer
});
