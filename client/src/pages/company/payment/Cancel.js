import { Container, Box,Typography, Paper, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Grid from '@mui/material/Unstable_Grid2';

/**
 * Represents the component for displaying a cancellation message.
 * @returns {JSX.Element} The JSX element containing the cancellation message.
 */
const Cancel = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2} sx={{pt:3}}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" sx={{ color: "red" }} gutterBottom>
              Haluamme ilmoittaa, että maksusi ei onnistunut.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Ilmoitustasi ei julkaistu. 
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Voitko tarkistaa, että maksutietosi ovat oikein ja yritä maksaa uudelleen? 
              Jos sinulla on edelleen ongelmia, ole hyvä ja ota yhteyttä maksupalveluntarjoajaasi 
              tai asiakaspalveluumme saadaksesi lisätietoja ja apua ongelman ratkaisemiseksi.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Toivotan sinulle hyvää päivän jatkoa.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Ystävällisin terveisin,
              Vuokrapaja
            </Typography>
            <Button sx={{ mb: 2}} fullWidth variant="contained" color="info" onClick={() => { navigate("/company/apartments")}}>
              Palaa ilmoituksiisi.
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Cancel;