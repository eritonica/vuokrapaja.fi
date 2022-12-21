import { Container, Box,Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Cancel = () => {
  return (
    <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2} sx={{pt:3}}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" sx={{ color: "red" }} gutterBottom>
              Maksutapahtuma epäonnistui
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Ilmoitustasi ei julkaistu.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Koska peruutit maksutapahtuman tai maksutapahtuma epäonnistui, joten sinun ilmoitustasi ei julkaistu kaikkien näkyville. 
              Voit yrittää uudestaan maksaa. Mahdollisia syitä on, että sinulla ei valitettavasti ollut katetta tai Stripe palvelussa
              on menossa häiriö. 
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Ota sähköpostilla yhteyttä pankkisi maksutapahtuman kanssa jos sinulta kuitenkin veloitettiin ja päädyit tänne.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Olemme pahoillamme jos virheellisesti maksutapahtuma päätyi epäonnistumiseen. Muuten toivomme sinun yrittävän myöhemmin
              uudestaan.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Cancel;