import { combineReducers } from "redux";

const INITIAL_STATE = {
  email: "",
  phone: "",
  location: {
    Address:
      "Plaza Atrium, Senen Raya Road, RW.2, Senen, Central Jakarta City, Jakarta",
    Name: "Atrium Senen",
    "Operation Details": "Pick up at 10am",
    Retailer: "Breadlife"
  },
  name: "test_user1",
  phone: "12345678",
  shift: "Thursday",
  type: "outletStaff"
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
