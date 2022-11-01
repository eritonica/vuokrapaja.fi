import React, {  useState, useCallback, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Button, Snackbar, Avatar, Menu, Tooltip, IconButton, MenuItem } from "@mui/material";
import { Login, Logout, Close, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";

import { useSelector, useDispatch } from 'react-redux';
import { setToken, setCompany, setProfile } from '../appSlice';

import NotificationsIcon from '@mui/icons-material/Notifications';

import LeftDrawer from "./LeftDrawer";

import useDimensions from "../hooks/useDimensions";


const TopBar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const name = useSelector((state) => state.app.name);
  const profile = useSelector((state) => state.app.profile);
  const company = useSelector((state) => state.app.company);
  const [usermenuAnchor, setUsermenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [accountNotifications, setAccountNotifications] = useState([]);
  const [companyNotifications, setCompanyNotifications] = useState([]);
  const {height, width} = useDimensions(); // eslint-disable-line no-unused-vars
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
  );
  
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
      dispatch(setToken(undefined));
      dispatch(setProfile({}));
      dispatch(setCompany({}));
    }
  };

  const onLogin = () => {
    handleCloseUsermenu();
    navigate("/login");
  };

  const onProfile = () => {
    handleCloseUsermenu();
    navigate("/profile");
  };


  const handleOpenUsermenu = (event) => {
    setUsermenuAnchor(event.currentTarget);
  };

  const handleCloseUsermenu = () => {
    setUsermenuAnchor(null);
  };

  const sleep = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const changeNotificationMessage = (notifications) => {
    for(let i = 0; i < notifications.length; i++) {
      console.log(notifications[i].notification); // leave for debugging purposes and for adding new notifications
      if(notifications[i].notification.startsWith('New application has been created')) {
        const words = notifications[i].notification.split(' ');
        for(let j = 0; j < words.length; j++) {
          if(words[j].startsWith('/company/applications/')) {
            notifications[i].link = words[j];
            break;
          }
        }
        notifications[i].type = 'Hakemus';
        notifications[i].notification = 'Kohteeseen tehty uusi hakemus';
      }
    }
    return notifications;
  }

  const getNotifications = useCallback(() => {
    const loadNotifications = async () => {
      sleep(1000);
      if(profile.id === undefined) {
        return;
      }
      if(company._id === undefined) {
        return;
      }
      let accountResult = await fetch('/api/notifications/account/' + profile.id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "token": token,
        },
      });
      let accountBody = await accountResult.json();
      console.log(accountBody);
      if(accountBody.message === 'success') {
        setAccountNotifications(accountBody.data);
      }
      let companyResult = await fetch('/api/notifications/company/' + company._id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "token": token,
        },
      });
      let companyBody = await companyResult.json();
      console.log(companyBody);
      if(companyBody.message === 'success') {
        companyBody.data = changeNotificationMessage(companyBody.data);
        setCompanyNotifications(companyBody.data);
      }
    };
    loadNotifications();
  }, [profile, company, token]);

  useEffect(getNotifications, [getNotifications]);

  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleMarkAsRead = async (id) => {
    let result = await fetch('/api/notifications/markasread/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "token": token,
      },
    });
    let body = await result.json();
    if(body.message === 'success') {
      getNotifications();
    }
  };

  const handleOpenNotification = (notification) => {
    handleCloseNotifications();
    handleMarkAsRead(notification._id);
    if(notification.link !== undefined) {
      navigate(notification.link);
    }
  };

  return (
    <Box sx={ { flexGrow: 1 } }>
      <AppBar position="static">
        <Toolbar>
          <LeftDrawer onLogout={ onLogout }/>
          <Avatar src={"/logo512.png"} onClick={ () => navigate("/") }/>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
            onClick={() => navigate("/")}>
            { name }
          </Typography>
          { width > 448 &&
            <>
              <Box sx={{ flexGrow: 1 }} />
              <Button color="inherit" onClick={ () => navigate("/info/beta") } sx={{ color: "red" }}>BETA</Button>
              <Button color="inherit" onClick={ () => navigate("/info/renter") }>Vuokranantaja</Button>
              <Button color="inherit" onClick={ () => navigate("/info/rentee") }>Vuokralainen</Button>
            </>
          }
          <Box sx={{ flexGrow: 1 }} />
          { (token !== "undefined" && token !== undefined) &&
            /* Create notifications menu */
            <Box sx={{ flexGrow: 0, marginRight: 3 }}>
              <Tooltip title="Ilmoitukset" placement="bottom">
                <IconButton color="inherit" onClick={handleOpenNotifications} sx={{ p: 0 }}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
              <Menu
                id="notifications-menu"
                anchorEl={notificationsAnchor}
                open={Boolean(notificationsAnchor)}
                onClose={handleCloseNotifications}
                keepMounted
                sx={{ marginTop: 6 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                { (profile) && 
                  <List>
                    <ListItem>
                      <ListItemText primary="Omat ilmoitukset" />
                    </ListItem>
                    { accountNotifications.map((notification) => (
                      <ListItem key={notification._id}>
                        <ListItemText primary={notification.notification} />
                      </ListItem>
                    ))}
                  </List>
                }
                { (company) &&
                  <List>
                    <ListItem>
                      <ListItemText primary="Yrityksen ilmoitukset" />
                    </ListItem>
                    { companyNotifications.map((notification) => (
                      <ListItem key={notification._id}>
                        <ListItemText primary={notification.type} 
                          secondary={
                            <React.Fragment>
                              
                              <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                {notification.notification}
                              </Typography>
                              <Typography sx={{ display: 'block' }} component="span" variant="body2" color="text.primary">
                                {new Date(notification.created).toLocaleDateString("fi-FI")}
                              </Typography>
                              {notification.link !== undefined &&
                                <Button onClick={() => handleOpenNotification(notification) }>Avaa</Button>
                              }
                            </React.Fragment>
                          } />
                      </ListItem>
                    ))}
                  </List>
                }
              </Menu>
            </Box>
          }
          {
            (token === "undefined" || token === undefined)
              ? <Button color="inherit" onClick={onLogin} startIcon={<Login />}>Kirjaudu</Button>
              : <Box sx={{ flexGrow: 0 }} >
                  <Tooltip title="Käyttäjä asetukset" placement="bottom">
                    <IconButton onClick={handleOpenUsermenu} sx={{ p: 0}}>
                      <Avatar alt={profile.username} src={profile.avatar} />
                    </IconButton>
                  </Tooltip>
                  <Menu 
                    sx={{ mt: '45px' }}
                    id="appbarUserMenu"
                    anchorEl={usermenuAnchor}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(usermenuAnchor)}
                    onClose={handleCloseUsermenu}>
                    <MenuItem onClick={onProfile}>
                      <Person sx={{ mr: 1 }}/>
                      Profiili
                    </MenuItem>
                    <MenuItem onClick={onLogout}>
                      <Logout sx={{ mr: 1 }} />
                      Poistu
                    </MenuItem>
                  </Menu>
                </Box>
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
