import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert, Typography, Avatar, FormControl, Modal, InputLabel, Select, MenuItem } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../appSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Profile = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setError(false);
    setOpen(true);
  }
  const handleClose = () => {
    setError(false);
    setOpen(false);
  };

  useEffect(() => {
    let getData = async () => {
      // Get Profile from server
      let result = await fetch("/api/profiles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
      });
      let prof = await result.json();
      console.log(prof);
      if(!prof.message) {
        dispatch(setProfile({
          ...profile,
          ...prof,
          new: false,
        }));
      } else if(prof.message === "Unauthorized") {
        navigate("/login");
      }
    }
    getData();
  }, []);

  const onProfileChange = (e) => {
    setError(false);
    setSaved(false);
    dispatch(setProfile({ ...profile, [e.target.name]: e.target.value }));
  };

  const onPasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if(password.new.length < 8) {
      setError("Salasanan tarvitsee olla vähintään 8 merkkiä pitkä.");
      return;
    }
    if(/\d/.test(password.new) === false) {
      setError("Salasanan tarvitsee sisältää vähintään yksi numero.");
      return;
    }
    if(password.new !== password.confirm) {
      setError("Salasanat eivät vastaa toisiaan.");
      return;
    }
    let data = {
      username: profile.username,
      email: profile.remail,
      password: password.new,
    }
    let res = await fetch("/api/accounts", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "token": token
      },
      body: JSON.stringify(data)
    });
    let result = await res.json();
    if(result.message === "Unauthorized") {
      navigate("/login");
    }
    if(result.message === "Account updated.") {
      setPassword("");
      setError(false);
      handleClose();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(profile.new === true) {
      let result = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
        body: JSON.stringify(profile),
      });
      let body = await result.json();
      console.log(body);
      if(body.message === "Profile created.") {
        setSaved("Uusi profiili luotu sinulle.");
      } else {
        setError("Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen.");
      }
    } else if(profile.new === false) {
      let result = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
        body: JSON.stringify(profile),
      });
      let body = await result.json();
      console.log(body);
      if(body.message === "Profile updated.") {
        setSaved("Profiilisi päivitetty.");
      } else {
        setError("Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen.");
      }
    }

  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleSubmit}  sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>Profiili</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Avatar sx={{ width: 96, height: 96 }} src={profile.avatar}>{profile.name.charAt(0)}</Avatar>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" component="h2" gutterBottom>{profile.name}</Typography>
            <Typography variant="body1" component="p" gutterBottom>
              {profile.description}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Käyttäjätiedot</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth disabled label="Käyttäjätunnus" name="username" value={profile.username} onChange={onProfileChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth disabled label="Sähköposti" name="email" value={ profile.remail } onChange={onProfileChange} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleOpen}>Vaihda salasana</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Valitse uusi salasana
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Salasana"
                      name="new"
                      autoComplete="nothing"
                      onChange={onPasswordChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Salasana varmistus"
                      name="confirm"
                      autoComplete="nothing"
                      onChange={onPasswordChange}
                    />
                  </Grid>
                  {error && 
                    <Grid item xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handlePasswordSubmit}>
                      Tallenna
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Tiedot sinusta</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Tyyppi</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={profile.type}
                onChange={onProfileChange}
                label="Tyyppi">
                <MenuItem value={"Rentee"}>Vuokralainen</MenuItem>
                <MenuItem value={"Renter"}>Vuokranantaja</MenuItem>
                <MenuItem value={"Broker"}>Kiinteistönvälittäjä</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Nimi" name="name" value={profile.name} onChange={onProfileChange} helperText="Sinun etu ja sukunimesi." />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline label="Kuvaus" rows={4} name="description" value={profile.description} onChange={onProfileChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Ammatti" name="profession" value={profile.profession} onChange={onProfileChange} />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Syntymäpäivä"
                value={profile.birthday}
                onChange={(newValue) => {
                  dispatch(setProfile({...profile, birthday: newValue }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth helperText={params?.inputProps?.placeholder} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Yhteystiedot</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotiosoite" name="address" value={profile.address} onChange={onProfileChange} helperText="Mäkiläisenkuja 2, 25230 Kartano" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Puhelinnumero" name="phone" value={profile.phone} onChange={onProfileChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Sähköposti" name="email" value={profile.email} onChange={onProfileChange} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Muut tiedot:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotisivu" name="website" value={profile.website} onChange={onProfileChange} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1} mb={4}>
          { error && ( 
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          { saved && (
            <Grid item xs={12}>
              <Alert severity="success">{saved}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth> Tallenna </Button>
          </Grid>
          { profile.type !== "Rentee" && (
            <Grid item xs={12}>
              <Alert severity="info">
                Jos olet vuokranantaja tai asunnon välittäjä <Link to="/company">luo yritys profiilisi.</Link>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default Profile;