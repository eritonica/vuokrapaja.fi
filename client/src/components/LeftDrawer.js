import { useSelector} from 'react-redux';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, SwipeableDrawer, IconButton, List, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Menu, Home, Login, Logout, AppRegistration, Search, Person, AddBusiness, Groups3, Domain, DomainAdd } from "@mui/icons-material";

import SubjectIcon from '@mui/icons-material/Subject';
import ArticleIcon from '@mui/icons-material/Article';
import GradingIcon from '@mui/icons-material/Grading';
import NotesIcon from '@mui/icons-material/Notes';


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

  // console.log(token);
  const list = (anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}>
      <List>
        <ListItem button={true} key="Home" component={Link} to="/" onClick={() => navigate("/")}>
          <ListItemIcon>
            <Home /> 
          </ListItemIcon>
          <ListItemText primary="Home" onClick={() => navigate("/")}/>
        </ListItem>
        <ListItem button={true} key="Hae asuntoa" component={Link} to="/apartments/search" onClick={() => navigate("/apartments/search")}>
          <ListItemIcon>
            <Search /> 
          </ListItemIcon>
          <ListItemText primary="Hae asuntoa" onClick={() => navigate("/apartments/search")}/>
        </ListItem>
        {(token !== undefined || token !== false) && (
          <ListItem button={true} key="Profiili" component={Link} to="/profile" onClick={() => navigate("/profile")}>
            <ListItemIcon>
              <Person /> 
            </ListItemIcon>
            <ListItemText primary="Profiili" onClick={() => navigate("/profile")}/>
          </ListItem>
        )}
        <Divider />
        {((token !== undefined || token !== false) && (profile.type === "Renter" || profile.type === "Broker")) && ( 
          <>
            <ListItem button={true} key="Yritys" component={Link} to="/company" onClick={() => navigate("/company")}>
              <ListItemIcon>
                <AddBusiness /> 
              </ListItemIcon>
              <ListItemText primary="Yritys" onClick={() => navigate("/company")}/>
            </ListItem>
            <ListItem button={true} key="Tee ilmoitus" component={Link} to="/company/apartment" onClick={() => navigate("/company/apartment", { state : null })}>
              <ListItemIcon>
                <DomainAdd />
              </ListItemIcon>
              <ListItemText primary="Tee ilmoitus" onClick={() => navigate("/company/apartment", { state : null })}/>
            </ListItem>
            <ListItem button={true} key="Ilmoitukset" component={Link} to="/company/apartments" onClick={() => navigate("/company/apartments")}>
              <ListItemIcon>
                <Domain />
              </ListItemIcon>
              <ListItemText primary="Ilmoitukset" onClick={() => navigate("/company/apartments")}/>
            </ListItem>
            {/* <ListItem button={true} key="Työntekijät" component={Link} to="/company/member" onClick={() => navigate("/company/member")}>
              <ListItemIcon>
                <Groups3 /> 
              </ListItemIcon>
              <ListItemText primary="Työntekijät" onClick={() => navigate("/company/member")}/>
            </ListItem> */}
            <Divider />
          </>
        )}
        {/* <ListItem button={true} key="Beta" component={Link} to="/info/beta" onClick={() => navigate("/info/beta")} sx={{ color: "red"}}>
          <ListItemIcon>
            <CallToActionIcon />
          </ListItemIcon>
          <ListItemText primary="Beta" onClick={() => navigate("/info/beta")}/>
        </ListItem> */}
        <ListItem button={true} key="Vuokralainen" component={Link} to="/info/rentee" onClick={() => navigate("/info/rentee")}>
          <ListItemIcon>
            <SubjectIcon />
          </ListItemIcon>
          <ListItemText primary="Vuokralainen" onClick={() => navigate("/info/rentee")}/>
        </ListItem>
        <ListItem button={true} key="Vuokranantaja" component={Link} to="/info/renter" onClick={() => navigate("/info/renter")}>
          <ListItemIcon>
            <GradingIcon />
          </ListItemIcon>
          <ListItemText primary="Vuokranantaja" onClick={() => navigate("/info/renter")}/>
        </ListItem>
        <ListItem button={true} key="Käyttöehdot" component={Link} to="/info/terms" onClick={() => navigate("/info/terms")}>
          <ListItemIcon>
            <ArticleIcon /> 
          </ListItemIcon>
          <ListItemText primary="Käyttöehdot" onClick={() => navigate("/info/terms")}/>
        </ListItem>
        <ListItem button={true} key="Tietosuojaseloste" component={Link} to="/info/privacy" onClick={() => navigate("/info/privacy")}>
          <ListItemIcon>
            <NotesIcon /> 
          </ListItemIcon>
          <ListItemText primary="Tietosuojaseloste" onClick={() => navigate("/info/privacy")}/>
        </ListItem>
        <Divider />
        {(token === undefined || token === false) 
          ? <>
              <ListItem button={true} key="Login" component={Link} to="/login" onClick={() => navigate("/login")}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText primary="Kirjaudu" onClick={() => navigate("/login")}/>
              </ListItem>
              <ListItem button={true} key="Register" component={Link} to="/register" onClick={() => navigate("/register")}>
                <ListItemIcon>
                  <AppRegistration />
                </ListItemIcon>
                <ListItemText primary="Rekisteröidy" onClick={() => navigate("/register")}/>
              </ListItem>
            </>
          : <ListItem button={true} key="Logout" component={Link} to="/logout" onClick={() => props.onLogout() }>
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