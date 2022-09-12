import { createSlice } from '@reduxjs/toolkit';


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        token: false,
        name: 'Asuntosi',
        cookies: false,
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        toggleCookies: (state) => {
            state.cookies = !state.cookies;
        }
    },
});

export const { setToken, toggleCookies } = appSlice.actions;
export default appSlice.reducer;