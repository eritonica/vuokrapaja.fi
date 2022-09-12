import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Login, Logout} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../appSlice';

import LeftDrawer from "./LeftDrawer";


const TopBar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const name = useSelector((state) => state.app.name);
  const onLogout = async () => {
    let result = await fetch('http://localhost:8080/api/sessions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });
    let body = await result.json();
    console.log(body);
    if(body.message) {
      dispatch(setToken(false));
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
              ? <Button color="inherit" onClick={onLogin} startIcon={<Login />}>Kirjaudu</Button>
              : <Button color="inherit" onClick={onLogout} startIcon={<Logout />}>Poistu</Button>
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;
