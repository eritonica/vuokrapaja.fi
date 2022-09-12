// React & Material UI
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

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
  const [appState, setAppState] = useState({
    token: false,
    name: 'Asuntosi',
    cookiesAccepted: false,
  });

  document.title = appState.name;
  
  return (
    <div className="App">
      <ThemeProvider theme={appTheme}>
        <TopBar appState={[appState, setAppState]} />
        <Routes>
          <Route path="/" element={<Landing appState={[appState, setAppState]}/>} />
          <Route path="/login" element={<LoginForm appState={[appState, setAppState]}/>} />
          <Route path="/register" element={<RegisterForm appState={[appState, setAppState]}/>} />
          <Route path="/register/activation" element={<ActivationForm appState={[appState, setAppState]}/>} />
          <Route path="/recovery" element={<RecoveryRequestForm appState={[appState, setAppState]}/>} />
          <Route path="/recovery/password" element={<RecoveryPasswordForm appState={[appState, setAppState]}/>} />
        </Routes>
      </ThemeProvider>
      <Gdpr appState={[appState, setAppState]} />
    </div>
  );
}

export default App;
