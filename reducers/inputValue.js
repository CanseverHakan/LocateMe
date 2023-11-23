import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
  nickName:  "",
  cities: [],
  markers: [], } 
}

export const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    addName: (state, action) => {
      state.value.nickName = action.payload
    },
    addCity: (state, action) => {
      state.value.cities.push(action.payload)
    },
    removeCity: (state, action) => {
      state.value.cities = state.value.cities.filter(
        (el) => el.cityName !== action.payload
      );
    },
    addMarker: (state, action) => {
      state.value.markers.push(action.payload);
    }
  }
})

export const { addName, addCity, removeCity, addMarker } = inputSlice.actions
export default inputSlice.reducer