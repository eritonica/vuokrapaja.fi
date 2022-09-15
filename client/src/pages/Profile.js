import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert, Typography, Avatar, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setProfile } from '../appSlice';


const Profile = (props) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let getData = async () => {
      // Get Profile from server
      let result = await fetch("http://localhost:8080/api/profiles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
      });
      let body = await result.json();
      console.log(body);
      if(!body.message) {
        dispatch(setProfile({
          ...profile,
          type: body.type,
          name: body.name,
          birthday: body.birthday,
          security: body.security,
          address: body.address,
          profession: body.profession,
          description: body.description,
          avatar: body.avatar,
          phone: body.phone,
          email: body.email,
          website: body.website,
          new: false,
        }));
      } else if(body.message === "Unauthorized") {
        navigate("/login");
      }
    }
    getData();
  }, []);

  const onChange = (e) => {
    setError(false);
    setSaved(false);
    dispatch(setProfile({ ...profile, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(profile.new === true) {
      let result = await fetch("http://localhost:8080/api/profiles", {
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
      if(body.message == "Profile created.") {
        setSaved("Uusi profiili luotu sinulle.")
      } else {
        setError("Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen.")
      }
    } else if(profile.new === false) {
      let result = await fetch("http://localhost:8080/api/profiles", {
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
      if(body.message == "Profile updated.") {
        setSaved("Profiilisi päivitetty.")
      } else {
        setError("Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen.")
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
            <Typography variant="h6" component="h2" gutterBottom>Tiedot sinusta</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Tyyppi</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={profile.type}
                onChange={onChange}
                label="Tyyppi"
              >
                <MenuItem value={"Rentee"}>Vuokralainen</MenuItem>
                <MenuItem value={"Renter"}>Vuokranantaja</MenuItem>
                <MenuItem value={"Broker"}>Kiinteistönvälittäjä</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Nimi" name="name" value={profile.name} onChange={onChange} helperText="Sinun etu ja sukunimesi." />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline label="Kuvaus" rows={4} name="description" value={profile.description} onChange={onChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Ammatti" name="profession" value={profile.profession} onChange={onChange} />
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
          <Grid item xs={12}>
            <TextField fullWidth label="Henkilötunnus" name="security" value={profile.security} onChange={onChange} helperText="Ei ole pakollinen, mutta helpottaa asiointia." />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Yhteystiedot</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotiosoite" name="address" value={profile.address} onChange={onChange} helperText="Mäkiläisenkuja 2, 25230 Kartano" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Puhelinnumero" name="phone" value={profile.phone} onChange={onChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Sähköposti" name="email" value={profile.email} onChange={onChange} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Muut tiedot:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotisivu" name="website" value={profile.website} onChange={onChange} />
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
        </Grid>
      </Box>
    </Container>
  )
}

export default Profile;