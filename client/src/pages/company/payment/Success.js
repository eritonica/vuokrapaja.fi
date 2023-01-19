import { useCallback, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Container, Box,Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Success = () => {
  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const apartmentID = searchParams.get("apartment");
  const security = searchParams.get("security");
  
  const [message, setMessage] = useState({ error: false, message: ""});

  

  const setAparmentPaid = useCallback(() => {
    // Do async request to set Apartment paid as true.
    // TODO: cancel and renew the token for security here.
    const getApartment = async () => {
      const getResponse = await fetch(`/api/apartments/${apartmentID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": security,
        }
      });
      console.log(getResponse);
      const getData = await getResponse.json();
      console.log(getData);
      if(getData.message === "success") {
        if(getData.apartment.paid === true) {
          setMessage({ error: true, message: "Apartment has already been published." });
          return;
        }
        getData.apartment.paid = true;
        const putResponse = await fetch(`/api/apartments/${apartmentID}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "token": security,
          },
          body: JSON.stringify(getData.apartment),
        });
        console.log(putResponse);
        const putData = await putResponse.json();
        console.log(putData);
        if(putData.message === "Apartment updated.") {
          setMessage({ error: false, message: "Apartment published." });
        } else {
          setMessage({ error: true, message: "Could not publish apartment."});
        }
      } else {
        setMessage({ error: true, message: getData.message });
      }
    }
    getApartment();
  },[apartmentID, security]);

  //http://localhost:3000/stripe-payment-success?apartment=633bf2a64e502f3a81993dea&security=m7hfEWVfr32vsfjZhwaK2UQp7XotKoBE

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setAparmentPaid, []);

  

  return (
    <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        {(message.message === "Apartment published." || message.message === "Apartment has already been published.") 
        ? <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" sx={{ color: "green" }} gutterBottom>
                Haluamme ilmoittaa, että maksusi onnistui.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom>
                Ilmoituksesi on julkaistu.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Olemme kiitollisia vuokrausilmoituksen julkaisusta,
                toivomme että löydämme sinulle pian vuokralaisen.
                Muista kuitenkin tarkistaa vuokrausilmoituksesi 
                hakemukset säännöllisesti.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Toivotan sinulle hyvää päivän jatkoa.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Ystävällisin terveisin,
                Vuokrapaja
              </Typography>
            </Grid>
          </Grid>
        : ( message.message === "Could not publish apartment.") ? 
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" sx={{ color: "RED" }} gutterBottom>
                Kriittinen virhe tapahtui, maksusi ei onnistunut.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="p" gutterBottom>
                Ota heti meihin Vuokrapajaan yhteyttä ja kerro maksutietosi 
                ja { apartmentID } numero, jotta voimme manuaalisesti hoitaa
                vuokrailmoituksesi.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Ystävällisin terveisin,
                Vuokrapaja
              </Typography>
            </Grid>
          </Grid>
        : <Grid container spacing={2} sx={{pt:3}}>
          </Grid>
        }
      </Box>
    </Container>
  );
}

export default Success;