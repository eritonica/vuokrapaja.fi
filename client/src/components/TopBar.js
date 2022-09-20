import { useState } from "react";
import { Box, AppBar, Toolbar, Typography, Button, Snackbar } from "@mui/material";
import { Login, Logout, Close, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { setToken, setCompany, setProfile } from '../appSlice';

import LeftDrawer from "./LeftDrawer";


const TopBar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const name = useSelector((state) => state.app.name);
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: 'Kirjauduit onnistuneesti ulos.',
  });

  const handleSnackbarOpen = () => {
    setSnackbarState({ ...snackbarState, open: true });
  };

  const handleSnackbarClose = (event, reason) => {
    if(reason === 'clickaway') {
      return;
    }
    setSnackbarState({ ...snackbarState, open: false });
  };

  const SnackbarAction = (
    <Button color="secondary" size="small" onClick={handleSnackbarClose} startIcon={<Close />}>
      OK
    </Button>
  )
  
  const onLogout = async () => {
    handleSnackbarOpen();
    let result = await fetch('/api/sessions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });
    let body = await result.json();
    console.log(body);
    if(body.message) {
      navigate('/');
      localStorage.removeItem('token');
      dispatch(setToken(false));
    }
  }

  const onLogin = () => {
    navigate("/login");
  }

  const onProfile = () => {
    navigate("/profile");
  }

  // TODO:
  // Poista logout ja profile buttons from topbar.
  // Instead show user avatar for quick profile access
  // and logout button in left drawer.
  // Also badge for notifications.

  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar position="static">
        <Toolbar>
          <LeftDrawer onLogout={ onLogout }/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}>
            { name }
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {
            (token === false) 
              ? null
              : <Button color="inherit" onClick={onProfile} startIcon={<Person />}>Profiili</Button>
          }
          {
            (token === false) 
              ? <Button color="inherit" onClick={onLogin} startIcon={<Login />}>Kirjaudu</Button>
              : <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>Poistu</Button>
          }
          <Snackbar
            open={snackbarState.open}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarState.message}
            action={SnackbarAction}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;
