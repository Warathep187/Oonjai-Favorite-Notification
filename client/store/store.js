import {createSlice, configureStore} from "@reduxjs/toolkit";
import profileReducers from "./reducer";

const initialProfile = {
    id: null,
    name: null,
    role: null,
    unreadNotification: 0
}

const profileSlice = createSlice({
    name: "ProfileState",
    initialState: initialProfile,
    reducers: profileReducers
})

const store = configureStore({
    reducer: {
        profileSlice: profileSlice.reducer
    }
})

export default store;
export const profileActions = profileSlice.actions