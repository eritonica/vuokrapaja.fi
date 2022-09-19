import { createSlice } from '@reduxjs/toolkit';


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        token: false,
        name: 'Asuntosi',
        cookies: false,
        profile: {
            type: "Rentee",
            name: "",
            birthday: "01/01/1985",
            address: "",
            profession: "",
            description: "",
            avatar: "",
            phone: "",
            email: "",
            website: "",
            new: true,
        },
        company: {
            name: "",
            ycode: "",
            address: "",
            description: "",
            avatar: "",
            phone: "",
            email: "",
            website: "",
            members : [],
            new: true,
        },
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        toggleCookies: (state) => {
            state.cookies = !state.cookies;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setCompany: (state, action) => {
            state.company = action.payload;
        },
        pushCompanyMember: (state, action) => {
            state.company.members.push(action.payload);
        }
    },
});

export const { setToken, toggleCookies, setProfile, setCompany, pushCompanyMember } = appSlice.actions;
export default appSlice.reducer;