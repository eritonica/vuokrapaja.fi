// React & Material UI
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Redux store
import { useSelector } from 'react-redux';

// Components
import TopBar from './components/TopBar';
import Gdpr from './components/Gdpr';

// Pages
import Landing from './pages/Landing';
import LoginForm from './pages/LoginForm';
import Profile from './pages/Profile';
import RegisterForm from './pages/registeration/RegisterForm';
import ActivationForm from './pages/registeration/ActivationForm';
import RecoveryRequestForm from './pages/recovery/RequestForm';
import RecoveryPasswordForm from './pages/recovery/PasswordForm';

// Theme selection
import appTheme from './themes/AppTheme';

function App() {
  document.title = useSelector((state) => state.app.name);
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
