import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Box, Grid, TextField, Typography, Paper, Autocomplete, Button, Alert } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, ListItemText, Checkbox, FormControlLabel } from '@mui/material';
import { Card, CardActionArea, CardMedia, CardContent, Modal } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {  useSelector } from 'react-redux';

import FileUploader from '../../components/FileUploader.js';

import cities from '../apartments/towns.json';
import countries from '../apartments/countries.json';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Apartment = () => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const company = useSelector((state) => state.app.company);

  const location = useLocation();

  const [message, setMessage] = useState({
    success: false,
    error: false,
  });

  const [fileModal, setFileModal] = useState({
    open: false,
  });

  const [saveModal, setSaveModal] = useState({
    open: false,
  });

  const [form, setForm] = useState({
    address: "",
    zip: "",
    cityArea: "",
    city: "",
    country: "Suomi",
    rent: 650,
    rooms: 1,
    size: 65,
    type: "",
    rental: "",
    release: Date.now(),
    waterSeperate: false,
    water: 0,
    electricitySeperate: false,
    electricity: 0,
    heatingSeperate: false,
    use: "",
    description: "",
    condition: "",
    buildingYear: 1975,
    kitchenType: "",
    heating: "",
    has: [],
    suitable: [],
    images: [],
    deposit: [],
    floor: 1,
    housing: "",
    hosting: "",
    maintenance: "",
    responsible: "",
    contact: "",
    phone: "",
    email: "",
    website: "",
    location: "",
    applicationUrl: "",
    private : (profile.type === "Renter") ? true : false,
    new: true,
  });

  useEffect(() => {
    console.log(location.state);
    if (location.state) {
      setForm({...form, ...(location.state), new: false});
      setMessage({...message, success: "Muokkaa ilmoitusta", error: false});
    } else {
      setForm({...form, new: true});
      setMessage({...message, success: "Luodaan ilmoitusta", error: false});
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token === false) {
      navigate("/login");
    }
    if (profile.role === 'Rentee') {
      navigate("/");
    }
    // if company is not set, navigate to company info page
    if(company._id === undefined) {
      navigate("/company");
    }
  }, [navigate, token, profile, company]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const onSearchCityChange = (e, v) => {
    if (v !== null) {
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
    if (v !== null) {
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

  const handleOpenFileUploader = () => {
    setFileModal({
      open: true
    });
  }

  const handleCloseFileUploader = () => {
    setFileModal({
      open: false
    });
  }

  const handleOpenSaveModal = () => {
    setSaveModal({
      open: true
    });
  }

  const handleCloseSaveModal = () => {
    setSaveModal({
      open: false
    });
  }

  const removeImage = async (index) => {
    let images = form.images;
    await fetch("/api/files", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      },
      body: JSON.stringify({
        filename: images[index].path
      })
    });
    images.splice(index, 1);
    setForm({
      ...form,
      images: images
    });
  }

  const handleFileUpload = (body) => {
    if (body.message !== "Files uploaded successfully.") {
      setMessage({...message, error : "Virhe tapahtui tiedostoja lähettäessä. Yritä uudelleen."});
    }
    setForm({
      ...form,
      images:  [...form.images, ...body.files]
    });
    console.log(form.images);
    handleCloseFileUploader();
  }

  const handleNewApartmentSubmit =  async(e) => {
    e.preventDefault();
    if (token === false) {
      setMessage({...message, error : "Kirjaudu sisään jatkaaksesi."});
      return;
    }
    if (company === null) {
      setMessage({...message, error : "Sinulla ei ole yritystä. Luo yritys jatkaaksesi."});
      return;
    }
    const newApartment = {
      company: company._id,
      ...form,
    }
    if(newApartment.new === true) {
      // TODO: Virheilmoitukset kohteen lisäykseen.
      if(newApartment.address === "") {
        setMessage({...message, error : "Osoite puuttuu."});
        return;
      } else if(newApartment.zip === "") {
        setMessage({...message, error : "Postinumero puuttuu."});
        return;
      } else if(newApartment.cityArea === "") {
        setMessage({...message, error : "Kaupunginosa puuttuu."});
        return;
      } else if(newApartment.city === "") {
        setMessage({...message, error : "Kaupunki puuttuu."});
        return;
      } else if(newApartment.country === "") {
        setMessage({...message, error : "Maa puuttuu."});
        return;
      } else if(newApartment.rent === "") {
        setMessage({...message, error : "Vuokra puuttuu."});
        return;
      }
      const response = await fetch("/api/apartments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify(newApartment)
      });
      const body = await response.json();
      console.log(body);
      handleCloseSaveModal();
      if (body.message === "Apartment created.") {
        setMessage({...message, success : "Ilmoitus lisätty onnistuneesti. Sinun tarvitsee vielä maksaa ilmoituksesi, että se tulee.", error: "" });
        setForm({ ...newApartment })
      } else if(body.message === "Apartment already exists.") {
        setMessage({...message, error : "Ilmoitus on jo olemassa."});
      } else if(body.message === "You do not have permission to create this apartment.") {
        setMessage({...message, error : "Sinulla ei ole oikeuksia luoda tätä ilmoitusta."});
      } else {
        setMessage({...message, error : "Virhe tapahtui. Yritä uudelleen."});
      }
    } else {
      const response = await fetch(`/api/apartments/${newApartment._id}`,  {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "token": token
        },
        body: JSON.stringify(newApartment)
      });
      const body = await response.json();
      console.log(body);
      handleCloseSaveModal();
      if (body.message === "Apartment updated.") {
        setMessage({...message, success : "Ilmoitus päivitetty onnistuneesti. ", error: "" });
      } else if(body.message === "You do not have permission to edit this apartment.") {
        setMessage({...message, error : "Sinulla ei ole oikeuksia muokata tätä ilmoitusta."});
      } else {
        setMessage({...message, error : "Virhe tapahtui. Yritä uudelleen."});
      }
    }
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <Box component="form" sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {(location.state === null) ? (
              <Typography variant="h4" component="h1" gutterBottom>
                Lisää uusi ilmoitus
              </Typography>
            ) : (
              <Typography variant="h4" component="h1" gutterBottom>
                Muokkaa ilmoitusta
              </Typography>
            )}
            
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Kohteen osoitetiedot
            </Typography>
            {(location.state === null) ? (
              <Typography variant="body2" gutterBottom>
                Täytä uuden kohteen osoitetiedot huolellisesti ja tarkasti. Et pääse niitä muuttamaan ilmoituksen jälkeen.
              </Typography>
            ) : (
              <Typography variant="body2" gutterBottom>
                Valitettavasti osoitetietojen muuttaminen ei ole mahdollista. 
              </Typography>
            )}
            
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth disabled={(location.state === null ? false : true)} label="Kohteen postiosoite" name="address" onChange={onChange} value={form.address} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth disabled={(location.state === null ? false : true)} label="Postinumero" name="zip" onChange={onChange} value={form.zip} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth disabled={(location.state === null ? false : true)} label="Kaupunginosa" name="cityArea" onChange={onChange} value={form.cityArea} />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="city"
              id="city"
              options={cities}
              disabled={(location.state === null ? false : true)} 
              getOptionLabel={(option) => option.name}
              value={{ name: form.city }}
              isOptionEqualToValue={(option, value) => option.name.toLowerCase().includes(value.name.toLowerCase())}
              onChange={onSearchCityChange}
              renderInput={(params) => <TextField {...params} label="Kaupunki" name="city" onChange={onChange} />}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="country"
              id="country"
              options={countries}
              disabled={(location.state === null ? false : true)} 
              getOptionLabel={(option) => option.name}
              value={{ name: form.country }}
              isOptionEqualToValue={(option, value) => option.name.toLowerCase().includes(value.name.toLowerCase())}
              onChange={onSearchCountryChange}
              renderInput={(params) => <TextField {...params} label="Maa" name="country" onChange={onChange} />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Kohteen sopimustiedot
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Vuokra" name="rent" type="number" onChange={onChange} value={form.rent} onClick={(e) => { e.target.select() }} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Huoneiden määrä" name="rooms" onChange={onChange} value={form.rooms} onClick={(e) => { e.target.select() }} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kohteen koko m²" name="size" type="number" onChange={onChange} value={form.size} onClick={(e) => { e.target.select() }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="floor-label">Kohteen kerros</InputLabel>
              <Select
                labelId="floor-label"
                id="floor"
                name="floor"
                value={form.floor}
                label="Kohteen kerros"
                onChange={onChange}>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
                <MenuItem value="8">8</MenuItem>
                <MenuItem value="9">9</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="11">11</MenuItem>
                <MenuItem value="12">12</MenuItem>
                <MenuItem value="13">13</MenuItem>
                <MenuItem value="14">14</MenuItem>
                <MenuItem value="15">15</MenuItem>
                <MenuItem value="16">16</MenuItem>
                <MenuItem value="17">17</MenuItem>
                <MenuItem value="18">18</MenuItem>
                <MenuItem value="19">19</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="21">21</MenuItem>
                <MenuItem value="22">22</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Kohteen tyyppi</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={form.type}
                label="Kohteen tyyppi"
                onChange={onChange}>
                <MenuItem value="Kerrostalo">Kerrostalo</MenuItem>
                <MenuItem value="Rivitalo">Rivitalo</MenuItem>
                <MenuItem value="Omakotitalo">Omakotitalo</MenuItem>
                <MenuItem value="Paritalo">Paritalo</MenuItem>
                <MenuItem value="Luhtitalo">Luhtitalo</MenuItem>
                <MenuItem value="Erillistalo">Erillistalo</MenuItem>
                <MenuItem value="Puutalo-osake">Puutalo-osake</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="rental-label">Vuokrasuhteen kesto</InputLabel>
              <Select
                labelId="rental-label"
                id="rental"
                name="rental"
                value={form.rental}
                label="Vuokrasuhteen kesto"
                onChange={onChange}>
                <MenuItem value="toistaiseksi">Toistaiseksi</MenuItem>
                <MenuItem value="määräajaksi">Määräajaksi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
            <InputLabel id="deposit-label">Sopiva vakuus</InputLabel>
              <Select
                labelId="deposit-label"
                label="Sopiva vakuus"
                id="deposit"
                name="deposit"
                value={form.deposit}
                multiple
                renderValue={(selected) => selected.join(', ')}
                onChange={onChange}>
                <MenuItem value="1 kk">
                  <Checkbox checked={form.deposit.indexOf('1 kk') > -1} />
                  <ListItemText primary="1 kk" />
                </MenuItem>
                <MenuItem value="2 kk">
                  <Checkbox checked={form.deposit.indexOf('2 kk') > -1} />
                  <ListItemText primary="2 kk" />
                </MenuItem>
                <MenuItem value="3 kk">
                  <Checkbox checked={form.deposit.indexOf('3 kk') > -1} />
                  <ListItemText primary="3 kk" />
                </MenuItem>
                <MenuItem value="Kelavakuus">
                  <Checkbox checked={form.deposit.indexOf('Kelavakuus') > -1} />
                  <ListItemText primary="Kelavakuus" />
                </MenuItem>
                <MenuItem value="Ei vakuutta">
                  <Checkbox checked={form.deposit.indexOf('Ei vakuutta') > -1} />
                  <ListItemText primary="Ei vakuutta" />
                </MenuItem>
                <MenuItem value="Pankkitalletus">
                  <Checkbox checked={form.deposit.indexOf('Pankkitalletus') > -1} />
                  <ListItemText primary="Pankkitalletus" />
                </MenuItem>
                <MenuItem value="Takuuvakuutus">
                  <Checkbox checked={form.deposit.indexOf('Takuuvakuutus') > -1} />
                  <ListItemText primary="Takuuvakuutus" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Kohteen vapautuminen"
                value={form.release}
                name="release"
                onChange={(newValue) => {
                  setForm({ ...form, release: newValue });
                }}
                renderInput={(params) => <TextField {...params} fullWidth helperText={"Päivämäärän muoto: " + params?.inputProps?.placeholder + ", voit myös laittaa päivän jolloin asunto vapautunut."} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="waterSeperate" onChange={(e) => { setForm({ ...form, waterSeperate: !form.waterSeperate, water: "" }) }} checked={form.waterSeperate} />} label="Vesimaksu on kulutuksen mukaan." />
            {(form.waterSeperate)
              ? null
              : <TextField fullWidth label="Vesimaksu per henkilö." name="water" type="number" onChange={onChange} value={form.water} onClick={(e) => { e.target.select() }} />
            }
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="electricitySeperate" onChange={(e) => { setForm({ ...form, electricitySeperate: !form.electricitySeperate, electricity: "" }) }} checked={form.electricitySeperate} />} label="Erillinen sähkösopimus." />
            {(form.electricitySeperate)
              ? null
              : <TextField fullWidth label="Sähkömaksu per kuukausi." name="electricity" type="number" onChange={onChange} value={form.electricity} onClick={(e) => { e.target.select() }} />
            }
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="heatingSeperate" onChange={(e) => { setForm({ ...form, heatingSeperate: !form.heatingSeperate, heatingPrice: "" }) }} checked={form.heatingSeperate} />} label="Lämmitys ei sisälly vuokraan." />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Kohteen kuvaus
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="use-label">Käyttötarkoitus</InputLabel>
              <Select
                labelId="use-label"
                id="use"
                name="use"
                value={form.use}
                label="Käyttötarkoitus"
                onChange={onChange}
                defaultValue="Asunto"
                >
                <MenuItem value="Asunto">Asunto</MenuItem>
                <MenuItem value="Toimisto">Toimisto</MenuItem>
                <MenuItem value="Liiketila">Liiketila</MenuItem>
                <MenuItem value="Mökki">Mökki</MenuItem>
                <MenuItem value="Varasto">Varasto</MenuItem>
                <MenuItem value="Muu">Muu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kohteen kuvaus" name="description" multiline rows={5} onChange={onChange} value={form.description} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="condition-label">Kohteen kunto</InputLabel>
              <Select
                labelId="condition-label"
                id="condition"
                name="condition"
                value={form.condition}
                label="Kohteen kunto"
                onChange={onChange}>
                <MenuItem value="Uusi">Uusi</MenuItem>
                <MenuItem value="Hyvä">Hyvä</MenuItem>
                <MenuItem value="Tyydyttävä">Tyydyttävä</MenuItem>
                <MenuItem value="Huono">Huono</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Rakennusvuosi" name="buildingYear" type="number" onChange={onChange} value={form.buildingYear} onClick={(e) => { e.target.select() }} />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="kitchenType-label">Keittiön tyyppi</InputLabel>
              <Select
                labelId="kitchenType-label"
                id="kitchenType"
                name="kitchenType"
                value={form.kitchenType}
                label="Keittiön tyyppi"
                onChange={onChange}>
                <MenuItem value="">Ei tietoa</MenuItem>
                <MenuItem value="Erillinen keittiö">Erillinen keittiö</MenuItem>
                <MenuItem value="Tupakeittiö">Tupakeittiö</MenuItem>
                <MenuItem value="Keittiökomero">Keittiökomero</MenuItem>
                <MenuItem value="Keittiösyvennys">Keittiösyvennys</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="heating-label">Lämmitys</InputLabel>
              <Select
                labelId="heating-label"
                id="heating"
                name="heating"
                value={form.heating}
                label="Lämmitys"
                onChange={onChange}>
                <MenuItem value="">Ei tietoa</MenuItem>
                <MenuItem value="Kaukolämpö">Kaukolämpö</MenuItem>
                <MenuItem value="Sähkö">Sähkö</MenuItem>
                <MenuItem value="Maalämpö">Maalämpö</MenuItem>
                <MenuItem value="Öljy">Öljy</MenuItem>
                <MenuItem value="Puu">Puu</MenuItem>
                <MenuItem value="Muu">Muu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="has-label">Varustelu</InputLabel>
              <Select
                labelId="has-label"
                label="Varustelu"
                id="has"
                name="has"
                value={form.has}
                multiple
                renderValue={(selected) => selected.join(', ')}
                onChange={onChange}>
                <MenuItem value="Oma Sauna">
                  <Checkbox checked={form.has.indexOf('Oma Sauna') > -1} />
                  <ListItemText primary="Oma Sauna" />
                </MenuItem>
                <MenuItem value="Taloyhtiön Sauna">
                  <Checkbox checked={form.has.indexOf('Taloyhtiön Sauna') > -1} />
                  <ListItemText primary="Taloyhtiön Sauna" />
                </MenuItem>
                <MenuItem value="Hissi">
                  <Checkbox checked={form.has.indexOf('Hissi') > -1} />
                  <ListItemText primary="Hissi" />
                </MenuItem>
                <MenuItem value="Parveke">
                  <Checkbox checked={form.has.indexOf('Parveke') > -1} />
                  <ListItemText primary="Parveke" />
                </MenuItem>
                <MenuItem value="Parkkipaikka">
                  <Checkbox checked={form.has.indexOf('Parkkipaikka') > -1} />
                  <ListItemText primary="Parkkipaikka" />
                </MenuItem>
                <MenuItem value="Vierasparkki">
                  <Checkbox checked={form.has.indexOf('Vierasparkki') > -1} />
                  <ListItemText primary="Vierasparkki" />
                </MenuItem>
                <MenuItem value="Kellarikomero">
                  <Checkbox checked={form.has.indexOf('Kellarikomero') > -1} />
                  <ListItemText primary="Kellarikomero" />
                </MenuItem>
                <MenuItem value="Pesutupa">
                  <Checkbox checked={form.has.indexOf('Pesutupa') > -1} />
                  <ListItemText primary="Pesutupa" />
                </MenuItem>
                <MenuItem value="Kaapeli-tv">
                  <Checkbox checked={form.has.indexOf('Kaapeli-tv') > -1} />
                  <ListItemText primary="Kaapeli-tv" />
                </MenuItem>
                <MenuItem value="Internet">
                  <Checkbox checked={form.has.indexOf('Internet') > -1} />
                  <ListItemText primary="Internet" />
                </MenuItem>
                <MenuItem value="Ovipuhelin">
                  <Checkbox checked={form.has.indexOf('Ovipuhelin') > -1} />
                  <ListItemText primary="Ovipuhelin" />
                </MenuItem>
                <MenuItem value="Lattialämmitys">
                  <Checkbox checked={form.has.indexOf('Lattialämmitys') > -1} />
                  <ListItemText primary="Lattialämmitys" />
                </MenuItem>
                <MenuItem value="Ilmalämpöpumppu">
                  <Checkbox checked={form.has.indexOf('Ilmalämpöpumppu') > -1} />
                  <ListItemText primary="Ilmalämpöpumppu" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="suitable-label">Soveltuu</InputLabel>
              <Select
                labelId="suitable-label"
                id="suitable"
                name="suitable"
                label="Soveltuu"
                multiple
                value={form.suitable}
                renderValue={(selected) => selected.join(', ')}
                onChange={onChange}>
                <MenuItem value="Liikuntarajoitteiselle">
                  <Checkbox checked={form.suitable.indexOf('Liikuntarajoitteiselle') > -1} />
                  <ListItemText primary="Liikuntarajoitteiselle" />
                </MenuItem>
                <MenuItem value="Yrittämiselle">
                  <Checkbox checked={form.suitable.indexOf('Yrittämiselle') > -1} />
                  <ListItemText primary="Yrittämiselle" />
                </MenuItem>
                <MenuItem value="Iäkkäälle">
                  <Checkbox checked={form.suitable.indexOf('Iäkkäälle') > -1} />
                  <ListItemText primary="Iäkkäälle" />
                </MenuItem>
                <MenuItem value="Lapsiperheelle">
                  <Checkbox checked={form.suitable.indexOf('Lapsiperheelle') > -1} />
                  <ListItemText primary="Lapsiperheelle" />
                </MenuItem>
                <MenuItem value="Lemmikille">
                  <Checkbox checked={form.suitable.indexOf('Lemmikille') > -1} />
                  <ListItemText primary="Lemmikille" />
                </MenuItem>
                <MenuItem value="Talouseläimille">
                  <Checkbox checked={form.suitable.indexOf('Talouseläimille') > -1} />
                  <ListItemText primary="Talouseläimille" />
                </MenuItem>
                <MenuItem value="Tupakoitsijalle">
                  <Checkbox checked={form.suitable.indexOf('Tupakoitsijalle') > -1} />
                  <ListItemText primary="Tupakoitsijalle" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Taloyhtiö
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="housing"
              name="housing"
              label="Taloyhtiön nimi"
              fullWidth
              value={form.housing}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="hosting"
              name="hosting"
              label="Isännöitsijä"
              fullWidth
              value={form.hosting}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="maintenance"
              name="maintenance"
              label="Huoltoyhtiö"
              fullWidth
              value={form.maintenance}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="responsible"
              name="responsible"
              label="Vastuu kiinteistön hoidosta"
              fullWidth
              value={form.responsible}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Julkaistavat yhteystiedot
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="contact"
              name="contact"
              label="Yhteystieto"
              fullWidth
              value={form.contact}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="location"
              name="location"
              label="Käyntiosoite"
              fullWidth
              value={form.location}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Sähköposti"
              fullWidth
              value={form.email}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="phone"
              name="phone"
              label="Puhelinnumero"
              fullWidth
              value={form.phone}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="applicationUrl"
              name="applicationUrl"
              label="Oma hakemus linkki"
              fullWidth
              value={form.applicationUrl}
              onChange={onChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 4}}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Kuvat
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleOpenFileUploader}>
              Lisää kuva
            </Button>
            <Modal
              open={fileModal.open}
              onClose={handleCloseFileUploader}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle}>
                <FileUploader multiple={true} fileUploadCallback={handleFileUpload} />
              </Box>
            </Modal>
          </Grid>
          {form.images.map((image, index) => (
            <Grid item xs={4} key={image.filename}>
              <Card sx={{ maxWidth: 345, mb:2 }}>
                <CardActionArea>
                  <CardMedia component="img" height="140" image={"/" + image.path} alt="Kuva" />
                </CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="body2" component="div">
                    {image.originalname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(image.size / 1024 / 1024).toFixed(3) + ' MB'}
                  </Typography>
                  <Button size="small" color="primary" onClick={() => removeImage(index)}>
                    Poista kuva
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {(message.success) && (
            <Grid item xs={12}>
              <Alert severity="success">{message.success}</Alert>
            </Grid>
          )}
          {(message.success === "Ilmoitus lisätty onnistuneesti. Sinun tarvitsee vielä maksaa ilmoituksesi, että se tulee.") &&
            <Grid item xs={12}>
              <form method="POST" action="/api/stripe-one-time-payment">
                <input type="hidden" name="apartment" value={form._id}></input>
                <input type="hidden" name="token" value={token}></input>
                <Button sx={{ mb: 2 }} fullWidth variant="contained" color="primary" type="submit">Maksa</Button>
              </form>
            </Grid>
          }
          {(message.error) && (
            <Grid item xs={12}>
              <Alert severity="error">{message.error}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            {(message.success !== "Ilmoitus lisätty onnistuneesti. Sinun tarvitsee vielä maksaa ilmoituksesi, että se tulee.") &&
              <Button fullWidth variant="contained" color="primary" onClick={handleOpenSaveModal}>
                Tallenna
              </Button>
            }
            <Modal
              open={saveModal.open}
              onClose={handleCloseSaveModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Tallennetaanko ilmoitus?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                  Asunnon osoite on: {(form.address) ? form.address + ", " : null} {(form.zip) ? form.zip + ", " : null} {(form.cityArea) ? form.cityArea + ", " : null} {(form.city) ? form.city + ", " : null} {form.country}.
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                  Varmista, että osoite on oikein ja jatka maksamaan.
                </Typography>
                <Button sx={{ mb: 2}} fullWidth variant="contained" color="info" onClick={handleCloseSaveModal}>
                  Peruuta ja muokkaa.
                </Button>
                <Button  sx={{ mb: 2 }} fullWidth variant="contained" color="primary" onClick={handleNewApartmentSubmit}>
                  Tallenna.
                </Button>
              </Box>
            </Modal>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Apartment