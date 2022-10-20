import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Grid, Typography, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem, ListItemText, Checkbox, Alert } from "@mui/material";
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useSelector } from 'react-redux';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Application = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = useSelector((state) => state.app.token);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState({
    applicantsCount: 1,
    applicants: [
      {
        name: "",
        birthday: Date.now(),
        email: "",
        phone: "",
        workplace: "",
        monthlyIncome: "",
        smoking: "",
        credits: "",
      }
    ],
    desiredStart: Date.now(),
    desiredEnd: Date.now(),
    currentAddress: '',
    deposit: [],
    pets: "",
    description: '',
    reason: '',
    creditDescription: '',
    visitation: "",
    terms: false,
    apartment: id,
  });
  
  useEffect(() => {
    const getApplication = async () => {
      if(token === null) {
        return;
      }
      const response = await fetch(`/api/applications/`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'token': token
        }
      });
      const data = await response.json();
      if(data.application !== undefined) {
        setApplication(data.application);
      }
    }
    getApplication();
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if(application.terms == false) {
      setError("Sinun tarvitsee hyväksyä ehdot, jos haluat lähettää hakemuksen.");
    } else if(application.applicantsCount === 0) {
      setError("Sinun pitää lisätä vähintään yksi hakija, jotta voisit lähettää hakemuksen.");
    } else {
      const response = await fetch(`/api/applications/`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'token': token
        },
        body: JSON.stringify(application)
      });
      const data = await response.json();
      if(data.message === "Application added.") {
        
      } else {
        if(data.message) {
          setError(data.message);
        } else {
          setError("Tapahtui virhe. Yritä myöhemmin uudelleen.");
        }
      }
    }
  }

  const onApplicationChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  }

  const onApplicantChange = (e) => {
    const newApplicants = [...application.applicants];
    newApplicants[e.target.dataset.index][e.target.name] = e.target.value;
    setApplication({ ...application, applicants: newApplicants });
  }

  const onApplicantSelectChange = (index) => e => {
    const newApplicants = [...application.applicants];
    newApplicants[index][e.target.name] = e.target.value;
    setApplication({ ...application, applicants: newApplicants });
  }

  const addNewApplicant = () => {
    const newApplicants = [...application.applicants];
    newApplicants.push({
      name: "",
      birthDate: new Date(),
      email: "",
      phone: "",
      workplace: "",
      monthlyIncome: "",
      smoking: "",
    });
    setApplication({ ...application, applicants: newApplicants,  applicantsCount: application.applicantsCount + 1 });
  }

  const removeApplicant = (index) => {
    const newApplicants = [...application.applicants];
    newApplicants.splice(index, 1);
    setApplication({ ...application, applicants: newApplicants,  applicantsCount: application.applicantsCount - 1 });
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <Box component="form" sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              Hakemus
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" component="h3" gutterBottom>
                  Hakijat
                </Typography>
              </Grid>
              {[...Array(application.applicantsCount)].map((_, i) => (
                <Grid item xs={12} key={i}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" component="h4" gutterBottom>
                        Hakija {i + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button fullWidth variant="contained" onClick={() => removeApplicant(i)}>Poista hakija {i + 1} </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth 
                        label="Nimi" 
                        name="name"
                        required={true}
                        inputProps={{ 'data-index': i }}
                        value={application.applicants[i].name} 
                        onChange={onApplicantChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Syntymäpäivä"
                          value={application.applicants[i].birthday}
                          onChange={onApplicantChange}
                          renderInput={(params) => <TextField {...params} fullWidth helperText={params?.inputProps?.placeholder} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth
                        label="Puhelinnumero"
                        name="phone"
                        inputProps={{ 'data-index': i }}
                        value={application.applicants[i].phone}
                        onChange={onApplicantChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth
                        label="Sähköposti"
                        name="email"
                        inputProps={{ 'data-index': i }}
                        value={application.applicants[i].email}
                        onChange={onApplicantChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth
                        label="Työpaikka"
                        name="workplace"
                        inputProps={{ 'data-index': i }}
                        value={application.applicants[i].workplace}
                        onChange={onApplicantChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth
                        label="Kuukausitulot (€)"
                        name="monthlyIncome"
                        inputProps={{ 'data-index': i }}
                        value={application.applicants[i].monthlyIncome}
                        onChange={onApplicantChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="smoking-label">Tupakointi</InputLabel>
                        <Select
                          labelId="smoking-label"
                          name="smoking"
                          value={application.applicants[i].smoking}
                          onChange={onApplicantSelectChange(i)}
                          label="Tupakointi">
                          <MenuItem value="smoking">Kyllä</MenuItem>
                          <MenuItem value="no">Ei</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="credits-label">Luottotiedot</InputLabel>
                        <Select
                          labelId="credits-label"
                          name="credits"
                          value={application.applicants[i].credits}
                          onChange={onApplicantSelectChange(i)}
                          label="Luottotiedot">
                          <MenuItem value="good">Luottotiedot ovat kunnossa.</MenuItem>
                          <MenuItem value="bad">Luottotiedot eivät ole kunnossa.</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12} sm={12}>
                <Button fullWidth variant="contained" onClick={addNewApplicant}>Lisää hakija</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Haluttu sopimuksen aloituspäivä"
                value={application.desiredStart}
                onChange={onApplicationChange}
                renderInput={(params) => <TextField {...params} fullWidth helperText={params?.inputProps?.placeholder} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Haluttu sopimuksen lopetuspäivä"
                value={application.desiredEnd}
                onChange={onApplicationChange}
                renderInput={(params) => <TextField {...params} fullWidth helperText={params?.inputProps?.placeholder} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth 
              label="Nykyinen kotiosoite" 
              variant="outlined" 
              name="currentAddress"
              type="text" 
              value={application.currentAddress}
              onChange={onApplicationChange}
              helperText={"Esim 'katuosoite, postinumero ja postitoimipaikka' tai 'koditon'. Jos koditon, hyvä kertoa myös miksi."}
              />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="deposit-label">Sopiva vakuus</InputLabel>
              <Select 
                labelId="deposit-label"
                name="deposit"
                value={application.deposit}
                onChange={onApplicationChange}
                multiple
                renderValue={(selected) => selected.join(', ')}
                label="Sopiva vakuus">
                <MenuItem value="1 kk">
                  <Checkbox checked={application.deposit.indexOf('1 kk') > -1} />
                  <ListItemText primary="1 kk" />
                </MenuItem>
                <MenuItem value="2 kk">
                  <Checkbox checked={application.deposit.indexOf('2 kk') > -1} />
                  <ListItemText primary="2 kk" />
                </MenuItem>
                <MenuItem value="3 kk">
                  <Checkbox checked={application.deposit.indexOf('3 kk') > -1} />
                  <ListItemText primary="3 kk" />
                </MenuItem>
                <MenuItem value="Kelavakuus">
                  <Checkbox checked={application.deposit.indexOf('Kelavakuus') > -1} />
                  <ListItemText primary="Kelavakuus" />
                </MenuItem>
                <MenuItem value="Ei vakuutta">
                  <Checkbox checked={application.deposit.indexOf('Ei vakuutta') > -1} />
                  <ListItemText primary="Ei vakuutta" />
                </MenuItem>
                <MenuItem value="Pankkitalletus">
                  <Checkbox checked={application.deposit.indexOf('Pankkitalletus') > -1} />
                  <ListItemText primary="Pankkitalletus" />
                </MenuItem>
                <MenuItem value="Takuuvakuutus">
                  <Checkbox checked={application.deposit.indexOf('Takuuvakuutus') > -1} />
                  <ListItemText primary="Takuuvakuutus" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth
              label="Lemmikkieläimet"
              variant="outlined"
              name="pets"
              type="text"
              value={application.pets}
              onChange={onApplicationChange}
              helperText={"Vapaamuotoinen teksti, esim. '3 vuotias saksanpaimenkoira'"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth
              label="Syy muuttoon?"
              variant="outlined"
              name="reason"
              type="text"
              value={application.reason}
              onChange={onApplicationChange}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth
              label="Lisätietoa luottotiedoista."
              variant="outlined"
              name="reason"
              type="text"
              value={application.reason}
              onChange={onApplicationChange}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth
              label="Lisätietoja vuokranantajalle"
              variant="outlined"
              name="description"
              type="text"
              value={application.description}
              onChange={onApplicationChange}
              multiline
              rows={5}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Oletteko nähneet kohteen vai haluatteko näytölle?</Typography>
            <RadioGroup aria-label="visitation"
              name="visitation"
              value={application.visitation}
              onChange={onApplicationChange}>
              <FormControlLabel
                value="seen"
                control={<Radio color="primary" />}
                label="Kyllä olemme nähnyt kohteen."
              />
              <FormControlLabel
                value="notSeen"
                control={<Radio color="primary" />}
                label="Emme ole nähnyt, ei tarvetta näytölle."
              />
              <FormControlLabel
                value="wantToSee"
                control={<Radio color="primary" />}
                label="Emme ole nähnyt, haluamme näytölle."
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Lupa vaatimukset</Typography>
            { /* TODO: add link to terms of service and  privacy statement*/ }
            <Typography variant="subtitle1">
              Kun haet kohdetta Vuokrapaja palvelussa sinun tarvitsee
              hyväksyä käyttäehdot ja tietosuojaseloste. 

              Tämä tarkoittaa sitä, että annat luvan tallentaa hakemuksessa
              ilmoittamasi yksityiset tiedot. Ja lähettää nämä tiedot
              kohteen vuokranantajalle tai asunnon välittäjälle.
            </Typography>
            <RadioGroup aria-label="termsOfService"
              name="terms"
              value={application.terms}
              onChange={onApplicationChange}>
              <FormControlLabel
                value={true}
                control={<Radio color="primary" />}
                label="Hyväksyn ehdot."
              />
              <FormControlLabel
                value={false}
                control={<Radio color="primary" />}
                label="En hyväksy ehtoja."
              />
            </RadioGroup>
          </Grid>
          { error && 
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          }
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={onSubmit}>Lähetä hakemus</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Application;