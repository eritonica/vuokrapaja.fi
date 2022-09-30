import { createSlice } from '@reduxjs/toolkit';


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        token: false,
        server: "http://localhost:8080/",
        beta: true,
        
        name: 'Vuokrapaja',
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
            username: "",
            remail: "",
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

export const { setToken, toggleCookies, setProfile, setAccount, setCompany, pushCompanyMember } = appSlice.actions;
export default appSlice.reducer;