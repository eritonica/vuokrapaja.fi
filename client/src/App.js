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
import RegisterForm from './pages/registeration/RegisterForm';
import ActivationForm from './pages/registeration/ActivationForm';
import RecoveryRequestForm from './pages/recovery/RequestForm';
import RecoveryPasswordForm from './pages/recovery/PasswordForm';

// Theme selection
import appTheme from './themes/AppTheme';

function App() {

  document.title = useSelector((state) => state.app.name);
  
  return (
      <div className="App">
        <ThemeProvider theme={appTheme}>
            <TopBar />
            <Routes>
              <Route path="/" element={<Landing/>} />
              <Route path="/login" element={<LoginForm/>} />
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
