import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Box, Grid, TextField, Typography, Paper, Autocomplete } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, ListItemText, Checkbox, FormControlLabel } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useDispatch, useSelector } from 'react-redux';

import cities from '../apartments/towns.json';
import countries from '../apartments/countries.json';

const NewApartment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const [form, setForm] = useState({
    address: "",
    city: "",
    zip: "",
    country: "",
    rent: 650,
    rental: "",
    release: Date.now(),
    waterPrice: 0,
    waterSeperate: false,
    electricitySeperate: false,
    heatingSeperate: false,
  });

  useEffect(() => {
    if(token === false) {
      navigate("/login");
    }
    if(profile.role === 'Rentee') {
      navigate("/");
    }
  }, []);

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  }

  const onSearchCityChange = (e, v) => {
    if(v !== null) {
      setForm({
        ...form,
        city: v.name
      });
    } else {
      setForm({
        ...form,
        city: ''
      });
    }
  }

  const onSearchCountryChange = (e, v) => {
    if(v !== null) {
      setForm({
        ...form,
        country: v.name
      });
    } else {
      setForm({
        ...form,
        country: ''
      });
    }
  }

  return (
		<Container maxWidth="md" component={Paper}>
			<Box component="form" sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Asunto ilmoitus
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb: 4}}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Asunnon osoitetiedot
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Osoite" name="address" onChange={onChange} value={form.address} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Postinumero" name="zip" onChange={onChange} value={form.zip} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kaupunginosa" name="cityArea" onChange={onChange} value={form.cityArea} />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="city"
              id="city"
              options={cities}
              getOptionLabel={(option) => option.name}
              value={{ name : form.city}}
              isOptionEqualToValue={(option, value) => option.name.includes(value.name)}
              onChange={onSearchCityChange}
              renderInput={(params) => <TextField {...params} label="Kaupunki" name="city" onChange={onChange} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="country"
              id="country"
              options={countries}
              getOptionLabel={(option) => option.name}
              value={{ name : form.country}}
              isOptionEqualToValue={(option, value) => option.name.includes(value.name)}
              onChange={onSearchCountryChange}
              renderInput={(params) => <TextField {...params} label="Maa" name="country" onChange={onChange} />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{mb: 4}}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Asunnon sopimustiedot
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Vuokra" name="rent" type="number" onChange={onChange} value={form.rent} onClick={(e) => { e.target.select() }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="sopimus-label">Vuokrasuhteen kesto</InputLabel>
              <Select
                labelId="sopimus-label"
                id="sopimus"
                name="rental"
                value={form.rental}
                label="Vuokrasuhteen kesto"
                onChange={onChange}
              >
                <MenuItem value="toistaiseksi">Toistaiseksi</MenuItem>
                <MenuItem value="määräajaksi">Määräajaksi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Vapautuminen"
                value={form.release}
                name="release"
                onChange={(newValue) => {
                  setForm({...form, release: newValue});
                }}
                renderInput={(params) => <TextField {...params} fullWidth helperText={"Päivämäärän muoto: " + params?.inputProps?.placeholder + ", voit myös laittaa päivän jolloin asunto vapautunut."} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="waterSeperate" onChange={(e) => { setForm({...form, waterSeperate : !form.waterSeperate, waterPrice: "" })}} checked={form.waterSeperate}/>} label="Vesimaksu on kulutuksen mukaan." />
            { (form.waterSeperate) 
              ? null 
              : <TextField fullWidth label="Vesimaksu per henkilö." name="waterPrice" type="number" onChange={onChange} value={form.water} onClick={(e) => { e.target.select() }} />
            }
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="electricitySeperate" onChange={(e) => { setForm({...form, electricitySeperate : !form.electricitySeperate, electricityPrice: "" })}} checked={form.electricitySeperate}/>} label="Erillinen sähkösopimus." />
            { (form.electricitySeperate)
              ? null
              : <TextField fullWidth label="Sähkömaksu per kuukausi." name="electricityPrice" type="number" onChange={onChange} value={form.electricity} onClick={(e) => { e.target.select() }} />
            }
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="heatingSeperate" onChange={(e) => { setForm({...form, heatingSeperate : !form.heatingSeperate, heatingPrice: "" })}} checked={form.heatingSeperate}/>} label="Lämmitys ei sisälly vuokraan." />
          </Grid>
          
        </Grid>
      </Box>
    </Container>
  );
}

export default NewApartment