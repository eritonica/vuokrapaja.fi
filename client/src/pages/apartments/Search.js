import { useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box, TextField, Button, Typography, Paper, Autocomplete, FormControlLabel, Alert } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import ApartmentList from './ApartmentList';

const Search = (props) => {
  const name = useSelector((state) => state.app.name);
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState({ error: "", message: "" });
  const [searchedApartments, setSearchedApartments] = useState([]);
  const [searchFailed, setSearchFailed] = useState(false);

  // Remember to include empty value in the city list, do not remove it!
  const [form, setForm] = useState((location.state) ? location.state : {
    location: '',
    rooms: [2],
    use: "Asunto",
    houseType: ["Kerrostalo"],
    minPrice: 350,
    maxPrice: 900,
    minSize: 30,
    maxSize: 80,
    more: false,
    heating: [],
    has: [],
    condition: [],
    kitchenType: [],
    suitable: [],
    showOnly: [],
  });

  const onSearchFormSend = async () => {
    if(props.landing) {
      navigate("/apartments/search", { state: form });
    } else {
      // TODO: Search apartments
      const response = await fetch(`/api/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      let body = await response.json();
      if(body.error === "No location specified.") {
        setMessage({ error: "Et valinnut sijaintia josta etsiä. Yritätkö oikeasti hakea koko maailman asuntoilmoitukset?", message: "" });
        setSearchedApartments([]);
      } else if(body.message === "success") {
        setSearchedApartments(body.apartments);
        if(body.apartments.length == 0) {
          setSearchFailed(true);
        }
        setMessage({ error: "", message: "" });
      }
    }
  };

  useEffect(() => {
    if(location.state) {
      onSearchFormSend();
    }
    // Don't know yet how to handle dispatch with useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch("/api/locations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      let body = await response.json();
      let searchables = body.map((obj) => {
        return { name : obj.location.toLowerCase() };
      });
      searchables = searchables.sort((a, b) => { return a.name.length > b.name.length });
      searchables = searchables.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj['name']).indexOf(obj.name) === pos;
      });
      setLocations(searchables);

    };
    fetchLocations();
  }, []);

  const onSearchFormSubmit = async (e) => {
    e.preventDefault();
    onSearchFormSend();
  };

  useEffect(() => {
    const getData = async () => {
      console.log("Form dataa muutettu.");
    };
    getData();
  }, [form]);

  const onSearchChange = (event) => {
    setMessage({ error: "", message: "" });
    setSearchFailed(false);
    if(event.target.name === "more") {
      setForm({ ...form, [event.target.name]: event.target.checked });
    } else {
      setForm({
        ...form,
        [event.target.name]: event.target.value
      });
    }
  };

  const onSearchLocationChange = (e, v) => {
    setMessage({ error: "", message: "" });
    setSearchFailed(false);
    if(v !== null) {
      setForm({
        ...form,
        location: v.name
      });
    } else {
      setForm({
        ...form,
        location: ''
      });
    }
  }


  return (
    <Container maxWidth="md" component={Paper}>
      <Box sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}  sx={{pt:3}}>
            <Typography variant="h4" component="h2" gutterBottom>
              Hae vuokrattavia kohteita
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              name="location"
              id="location"
              options={locations}
              getOptionLabel={(option) => option.name}
              value={{ name : form.location}}
              isOptionEqualToValue={(option, value) => option.name.toLowerCase().includes(value.name.toLowerCase()) }
              onChange={onSearchLocationChange}
              renderInput={(params) => <TextField {...params} required={true} label="Sijainti, esim katu, postinumero, kaupunginosa tai kaupunki" name="location" onChange={onSearchChange} />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="kaytto-label">Käyttötarkoitus</InputLabel>
              <Select
                labelId="kaytto-label"
                id="kaytto"
                name="use"
                value={form.use}
                label="Käyttötarkoitus"
                onChange={onSearchChange}>
                <MenuItem value="Asunto">Asunto</MenuItem>
                <MenuItem value="Toimisto">Toimisto</MenuItem>
                <MenuItem value="Liiketila">Liiketila</MenuItem>
                <MenuItem value="Mökki">Mökki</MenuItem>
                <MenuItem value="Varasto">Varasto</MenuItem>
                <MenuItem value="Muu">Muu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="rooms-label">Huoneiden määrä</InputLabel>
              <Select
                labelId="rooms-label"
                id="rooms"
                multiple
                name="rooms"
                label="Huoneiden määrä"
                value={form.rooms}
                renderValue={(selected) => selected.join(', ')}
                onChange={onSearchChange}>
                <MenuItem value={1}>
                  <Checkbox checked={form.rooms.indexOf(1) > -1} />
                  <ListItemText primary="1" />
                </MenuItem>
                <MenuItem value={2}>
                  <Checkbox checked={form.rooms.indexOf(2) > -1} />
                  <ListItemText primary="2" />
                </MenuItem>
                <MenuItem value={3}>
                  <Checkbox checked={form.rooms.indexOf(3) > -1} />
                  <ListItemText primary="3" />
                </MenuItem>
                <MenuItem value={4}>
                  <Checkbox checked={form.rooms.indexOf(4) > -1} />
                  <ListItemText primary="4" />
                </MenuItem>
                <MenuItem value={5}>
                  <Checkbox checked={form.rooms.indexOf(5) > -1} />
                  <ListItemText primary="5" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="house-type-label">Tyyppi</InputLabel>
              <Select
                labelId="house-type-label"
                id="houseType"
                name="houseType"
                label="Tyyppi"
                multiple
                value={form.houseType}
                renderValue={(selected) => selected.join(', ')}
                onChange={onSearchChange}>
                <MenuItem value="Kerrostalo">
                  <Checkbox checked={form.houseType.indexOf('Kerrostalo') > -1} />
                  <ListItemText primary="Kerrostalo" />
                </MenuItem>
                <MenuItem value="Rivitalo">
                  <Checkbox checked={form.houseType.indexOf('Rivitalo') > -1} />
                  <ListItemText primary="Rivitalo" />
                </MenuItem>
                <MenuItem value="Omakotitalo">
                  <Checkbox checked={form.houseType.indexOf('Omakotitalo') > -1} />
                  <ListItemText primary="Omakotitalo" />
                </MenuItem>
                <MenuItem value="Paritalo">
                  <Checkbox checked={form.houseType.indexOf('Paritalo') > -1} />
                  <ListItemText primary="Paritalo" />
                </MenuItem>
                <MenuItem value="Luhtitalo">
                  <Checkbox checked={form.houseType.indexOf('Luhtitalo') > -1} />
                  <ListItemText primary="Luhtitalo" />
                </MenuItem>
                <MenuItem value="Erillistalo">
                  <Checkbox checked={form.houseType.indexOf('Erillistalo') > -1} />
                  <ListItemText primary="Erillistalo" />
                </MenuItem>
                <MenuItem value="Puutalo-osake">
                  <Checkbox checked={form.houseType.indexOf('Puutalo-osake') > -1} />
                  <ListItemText primary="Puutalo-osake" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth id="minPrice" name="minPrice" label="Min hinta" type="number" value={form.minPrice} onChange={onSearchChange} onClick={(e) => { e.target.select() }}/>
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth id="maxPrice" name="maxPrice" label="Max hinta" type="number" value={form.maxPrice} onChange={onSearchChange} onClick={(e) => { e.target.select() }}/>
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth id="minSize" name="minSize" label="Min koko m²" type="number"  value={form.minSize} onChange={onSearchChange} onClick={(e) => { e.target.select() }}/>
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth id="maxSize" name="maxSize" label="Max koko m²" type="number" value={form.maxSize} onChange={onSearchChange} onClick={(e) => { e.target.select() }}/>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel control={<Checkbox name="more" onChange={onSearchChange} checked={form.more}/>} label="Näytä lisää hakuvalintoja" />
          </Grid>
          {form.more === true && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="heating-label">Lämmitys</InputLabel>
                <Select
                  labelId="heating-label"
                  id="heating"
                  name="heating"
                  label="Lämmitys"
                  multiple
                  value={form.heating}
                  renderValue={(selected) => selected.join(', ')}
                  onChange={onSearchChange}>
                  <MenuItem value="Kaukolämpö">
                    <Checkbox checked={form.heating.indexOf('Kaukolämpö') > -1} />
                    <ListItemText primary="Kaukolämpö" />
                  </MenuItem>
                  <MenuItem value="Sähkö">
                    <Checkbox checked={form.heating.indexOf('Sähkö') > -1} />
                    <ListItemText primary="Sähkö" />
                  </MenuItem>
                  <MenuItem value="Maalämpö">
                    <Checkbox checked={form.heating.indexOf('Maalämpö') > -1} />
                    <ListItemText primary="Maalämpö" />
                  </MenuItem>
                  <MenuItem value="Öljy">
                    <Checkbox checked={form.heating.indexOf('Öljy') > -1} />
                    <ListItemText primary="Öljy" />
                  </MenuItem>
                  <MenuItem value="Puu">
                    <Checkbox checked={form.heating.indexOf('Puu') > -1} />
                    <ListItemText primary="Puu" />
                  </MenuItem>
                  <MenuItem value="Muu">
                    <Checkbox checked={form.heating.indexOf('Muu') > -1} />
                    <ListItemText primary="Muu" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {form.more === true && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="has-label">Varusteet</InputLabel>
                <Select
                  labelId="has-label"
                  id="has"
                  name="has"
                  label="Varusteet"
                  multiple
                  renderValue={(selected) => selected.join(', ')}
                  value={form.has}
                  onChange={onSearchChange}>
                  <MenuItem value="Oma Sauna">
                    <Checkbox checked={form.has.indexOf('Oma Sauna') > -1} />
                    <ListItemText primary="Oma Sauna" />
                  </MenuItem>
                  <MenuItem value="Taloyhtiö Sauna">
                    <Checkbox checked={form.has.indexOf('Taloyhtiö Sauna') > -1} />
                    <ListItemText primary="Taloyhtiö Sauna" />
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
          )}
          {form.more === true && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="condition-label">Kunto</InputLabel>
                <Select
                  labelId="condition-label"
                  id="condition"
                  name="condition"
                  label="Kunto"
                  multiple
                  value={form.condition}
                  renderValue={(selected) => selected.join(', ')}
                  onChange={onSearchChange}>
                  <MenuItem value="Uusi">
                    <Checkbox checked={form.condition.indexOf('Uusi') > -1} />
                    <ListItemText primary="Uusi" />
                  </MenuItem>
                  <MenuItem value="Hyvä">
                    <Checkbox checked={form.condition.indexOf('Hyvä') > -1} />
                    <ListItemText primary="Hyvä" />
                  </MenuItem>
                  <MenuItem value="Tyydyttävä">
                    <Checkbox checked={form.condition.indexOf('Tyydyttävä') > -1} />
                    <ListItemText primary="Tyydyttävä" />
                  </MenuItem>
                  <MenuItem value="Huono">
                    <Checkbox checked={form.condition.indexOf('Huono') > -1} />
                    <ListItemText primary="Huono" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {form.more === true && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="kitchen-type-label">Keittiön tyyppi</InputLabel>
                <Select
                  labelId="kitchen-type-label"
                  id="kitchen-type"
                  name="kitchenType"
                  label="Keittiön tyyppi"
                  multiple
                  value={form.kitchenType}
                  renderValue={(selected) => selected.join(', ')}
                  onChange={onSearchChange}>
                  <MenuItem value="Erillinen keittiö">
                    <Checkbox checked={form.kitchenType.indexOf('Erillinen keittiö') > -1} />
                    <ListItemText primary="Erillinen keittiö" />
                  </MenuItem>
                  <MenuItem value="Tupakeittiö">
                    <Checkbox checked={form.kitchenType.indexOf('Tupakeittiö') > -1} />
                    <ListItemText primary="Tupakeittiö" />
                  </MenuItem>
                  <MenuItem value="Keittiökomero">
                    <Checkbox checked={form.kitchenType.indexOf('Keittiökomero') > -1} />
                    <ListItemText primary="Keittiökomero" />
                  </MenuItem>
                  <MenuItem value="Keittiösyvennys">
                    <Checkbox checked={form.kitchenType.indexOf('Keittiösyvennys') > -1} />
                    <ListItemText primary="Keittiösyvennys" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {form.more === true && (
            <Grid item xs={6}>
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
                  onChange={onSearchChange}>
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
                  <MenuItem value="Vauvaperheelle">
                    <Checkbox checked={form.suitable.indexOf('Vauvaperheelle') > -1} />
                    <ListItemText primary="Vauvaperheelle" />
                  </MenuItem>
                  <MenuItem value="Koiralle">
                    <Checkbox checked={form.suitable.indexOf('Koiralle') > -1} />
                    <ListItemText primary="Koiralle" />
                  </MenuItem>
                  <MenuItem value="Kissoille">
                    <Checkbox checked={form.suitable.indexOf('Kissoille') > -1} />
                    <ListItemText primary="Kissoille" />
                  </MenuItem>
                  <MenuItem value="Tupakoitsijalle">
                    <Checkbox checked={form.suitable.indexOf('Tupakoitsijalle') > -1} />
                    <ListItemText primary="Tupakoitsijalle" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          {form.more === true && (
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="showOnly-label">Näytä vain</InputLabel>
                <Select
                  labelId="showOnly-label"
                  id="showOnly"
                  name="showOnly"
                  label="Näytä vain"
                  multiple
                  value={form.showOnly}
                  renderValue={(selected) => selected.join(', ')}
                  onChange={onSearchChange}>
                  <MenuItem value="Kuvalliset">
                    <Checkbox checked={form.showOnly.indexOf('Kuvalliset') > -1} />
                    <ListItemText primary="Kuvalliset" />
                  </MenuItem>
                  <MenuItem value="Yksityisten">
                    <Checkbox checked={form.showOnly.indexOf('Yksityisten') > -1} />
                    <ListItemText primary="Yksityisten" />
                  </MenuItem>
                  <MenuItem value="Välittäjien">
                    <Checkbox checked={form.showOnly.indexOf('Välittäjien') > -1} />
                    <ListItemText primary="Välittäjien" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit" onClick={onSearchFormSubmit}>
              Hae 
            </Button>
          </Grid>
          { message.error !== "" && (
            <Grid item xs={12}>
              <Alert severity="error">{ message.error }</Alert>
            </Grid>
          )}
          
        </Grid>
        { (searchedApartments.length > 0) &&
          <ApartmentList apartments={searchedApartments} />
        }
        { (searchFailed == true) &&
          <Grid item xs={12}>
            <Alert severity='error' sx={{mt:2, mb: 2}}>Hakuehdoilla ei löytynyt yhtään ilmoitusta.</Alert>
          </Grid>
        }
        <Grid item xs={12}>
            <Typography variant="body2" align="center" sx={{mt:2}}>
              { name } sivustolta löytyy asuntoja Suomesta. Tämän hakulomakkeen avulla löydät sinua kiinnostavat asunnot.
            </Typography>
          </Grid>
      </Box>
    </Container>
  )
}

export default Search
