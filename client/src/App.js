// React & Material UI
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

// Components
import TopBar from './components/TopBar';

// Pages
import Landing from './pages/Landing';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import ActivationForm from './pages/ActivationForm';

// Theme selection
import appTheme from './themes/AppTheme';



function App() {
  const [appState, setAppState] = useState({
    token: false,
  });
  
  return (
    <div className="App">
      <ThemeProvider theme={appTheme}>
        <TopBar appState={[appState, setAppState]} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginForm appState={[appState, setAppState]}/>} />
          <Route path="/register" element={<RegisterForm appState={[appState, setAppState]}/>} />
          <Route path="/register/activation" element={<ActivationForm appState={[appState, setAppState]}/>} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
