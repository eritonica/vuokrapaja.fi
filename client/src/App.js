// React & Material UI
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Redux store
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setProfile, setCompany } from './appSlice';

// Components
import TopBar from './components/TopBar';
import Gdpr from './components/Gdpr';

// Pages
import Landing from './pages/Landing';
import LoginForm from './pages/LoginForm';
import Profile from './pages/Profile';
import Company from './pages/company/Profile';
import RegisterForm from './pages/registeration/RegisterForm';
import ActivationForm from './pages/registeration/ActivationForm';
import RecoveryRequestForm from './pages/recovery/RequestForm';
import RecoveryPasswordForm from './pages/recovery/PasswordForm';

// Theme selection
import appTheme from './themes/AppTheme';

function App() {
  let dispatch = useDispatch();
  document.title = useSelector((state) => state.app.name);
  let token = useSelector((state) => state.app.token);
  let profile = useSelector((state) => state.app.profile);
  let company = useSelector((state) => state.app.company);

  const getProfile = async (token) => {
    let response = await fetch("http://localhost:8080/api/profiles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "token": token
      },
    });
    let body = await response.json();
    console.log("Get profile at App.js");
    console.log(body);
    if(!body.message) {
      dispatch(setProfile({
        ...profile,
        ...body,
        new: false,
      }));
    }
  }
  const getCompany = async(token) => {
    let response = await fetch("http://localhost:8080/api/companies", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "token": token
      },
    });
    let body = await response.json();
    console.log("Get company at App.js");
    console.log(body);
    if(!body.message) {
      dispatch(setCompany({
        ...company,
        ...body,
        new: false,
      }));
    }
  }

  // Token update management is here since it is App level, 
  // in logout action it is removed from localstorage and Redux state management.
  useEffect(() => {
    let tmpToken = localStorage.getItem("token");
    if(tmpToken) {
      console.log("Found token from local storage " + tmpToken);
      dispatch(setToken(tmpToken))
      console.log("Setting the found token in redux store");
    }
  }, []);

  useEffect(() => {
    if(token !== false) {
      console.log("Setting token to localStorage");
      localStorage.setItem("token", token);
      getProfile(token);
      getCompany(token);
    }
  }, [token]);

  // Keep router routes in most used order, so that the most used routes are at the top
  // and the least used routes are at the bottom. This way the most used routes are
  // rendered first and the least used routes are rendered last.
  return (
      <div className="App">
        <ThemeProvider theme={appTheme}>
            <TopBar />
            <Routes>
              <Route path="/" element={<Landing/>} />
              <Route path="/login" element={<LoginForm/>} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/company" element={<Company/>} />
              <Route path="/register" element={<RegisterForm/>} />
              <Route path="/register/activation" element={<ActivationForm/>} />
              <Route path="/recovery" element={<RecoveryRequestForm/>} />
              <Route path="/recovery/password" element={<RecoveryPasswordForm/>} />
            </Routes>
            <Gdpr />
        </ThemeProvider>
      </div>
  );
}

export default App;
