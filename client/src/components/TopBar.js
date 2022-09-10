import { Box, AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Menu, Login, Logout} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";


const TopBar = (props) => {
  const navigate = useNavigate();
  const [appState, setAppState] = props.appState;

  const onLogout = async () => {
    let result = await fetch('http://localhost:8080/api/sessions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: appState.token }),
    });
    let body = await result.json();
    console.log(body);
    if(body.message) {
      setAppState({ ...appState, token: false });
      navigate('/');
    }
  }

  const onLogin = () => {
    navigate("/login");
  }


  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}>
            Asuntosi
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {
            (appState.token === false) 
              ? <Button color="inherit" onClick={onLogin} startIcon={<Login />}>Kirjaudu</Button>
              : <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>Poistu</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;
