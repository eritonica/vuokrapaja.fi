import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button, List, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import GitHubIcon from '@mui/icons-material/GitHub';

const Beta = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Kehitysversio
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Tämä on kehitysversio. Tässä versiossa on vain osa palvelun
                ominaisuuksista, jotka on toteutettu. Tämä versio on tarkoitettu
                testaamista varten. Tämä versio ei ole vielä valmis tuotantokäyttöön.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Joten jos löydät virheitä tai puutteita, niin ilmoita niistä
                meille. Voit tehdä sen alla olevasta linkistä.
              </Typography>
              <Button fullWidth variant="contained" href="https://github.com/TMKCodes/vuokrapaja/issues" target="_blank" rel="noopener noreferrer" sx={{mt: 2, mb: 2}}>
                <GitHubIcon sx={{ml: 1}} />Ilmoita virheestä
              </Button>
              <Typography variant="body1" component="p" gutterBottom>
                Vuokrapaja kun siirttyy tuotantoversioon, niin kaikki tämän hetkiset
                käyttäjätietosi poistuu. Tämä koskee myös kaikkia ilmoituksia,
                joita olet tehnyt.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Tämä ilmoitus poistuu kun sivusto siirtyy tuotantoversioon.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Beta;