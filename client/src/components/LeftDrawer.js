import { useSelector} from 'react-redux';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, SwipeableDrawer, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Home, Login, Logout, AppRegistration, Search, Person, AddBusiness, Groups3, Domain, DomainAdd } from "@mui/icons-material";

const LeftDrawer = (props) => {
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const [drawerState, setDrawerState] = useState({
    left: false,
  });

  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerState({ ...drawerState, left: open });
  }

  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button key="Home" component={Link} to="/" onClick={() => navigate("/")}>
          <ListItemIcon>
            <Home /> 
          </ListItemIcon>
          <ListItemText primary="Home" onClick={() => navigate("/")}/>
        </ListItem>
        <ListItem button key="Hae asuntoa" component={Link} to="/apartments/search" onClick={() => navigate("/apartments/search")}>
          <ListItemIcon>
            <Search /> 
          </ListItemIcon>
          <ListItemText primary="Hae asuntoa" onClick={() => navigate("/apartments/search")}/>
        </ListItem>
        
        <Divider />
        {(token !== false && profile.type !== "Rentee") && ( 
          <>
            <ListItem button key="Yritys" component={Link} to="/company" onClick={() => navigate("/company")}>
              <ListItemIcon>
                <AddBusiness /> 
              </ListItemIcon>
              <ListItemText primary="Yritys" onClick={() => navigate("/company")}/>
            </ListItem>
            <ListItem button key="Tee ilmoitus" component={Link} to="/company/apartment" onClick={() => navigate("/company/apartment")}>
              <ListItemIcon>
                <DomainAdd />
              </ListItemIcon>
              <ListItemText primary="Tee ilmoitus" onClick={() => navigate("/company/apartment")}/>
            </ListItem>
            <ListItem button key="Ilmoitukset" component={Link} to="/company/apartments" onClick={() => navigate("/company/apartments")}>
              <ListItemIcon>
                <Domain />
              </ListItemIcon>
              <ListItemText primary="Ilmoitukset" onClick={() => navigate("/company/apartments")}/>
            </ListItem>
            <ListItem button key="Työntekijät" component={Link} to="/company/member" onClick={() => navigate("/company/member")}>
              <ListItemIcon>
                <Groups3 /> 
              </ListItemIcon>
              <ListItemText primary="Työntekijät" onClick={() => navigate("/company/member")}/>
            </ListItem>
            <Divider />
          </>
        )}
        {(token !== false) && (
          <ListItem button key="Profiili" component={Link} to="/profile" onClick={() => navigate("/profile")}>
            <ListItemIcon>
              <Person /> 
            </ListItemIcon>
            <ListItemText primary="Profiili" onClick={() => navigate("/profile")}/>
          </ListItem>
        )}
        {(token === false) 
          ? <>
              <ListItem button key="Login" component={Link} to="/login" onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Kirjaudu" onClick={() => navigate("/login")}/>
              </ListItem>
              <ListItem button key="Register" component={Link} to="/register" onClick={() => navigate("/register")}>
                <ListItemIcon>
                  <AppRegistration />
                </ListItemIcon>
                <ListItemText primary="Rekisteröidy" onClick={() => navigate("/register")}/>
              </ListItem>
            </>
          : <ListItem button key="Logout" component={Link} to="/logout" onClick={() => props.onLogout() }>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Poistu" onClick={() => props.onLogout() }/>
            </ListItem>
        }
      </List>
    </Box>
  );

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <Menu />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={drawerState.left}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}>
        {list('left')}
      </SwipeableDrawer>
    </>
  )

}

export default LeftDrawer;