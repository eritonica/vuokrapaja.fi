import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import Grid from '@mui/material/Unstable_Grid2';

import SearchApartments from './apartments/Search.js';

const Landing = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center"}}>
              <Typography variant="h4" component="h2" gutterBottom>Tervetuloa {name}an.</Typography>
            </Grid>
            <Grid item xs={12}>
              <Alert severity="info">
                Tämä on beta-versio. Sivustolla saattaa olla virheitä ja ominaisuuksia puuttuu.
                Joten ole kärsivällinen ja ilmoita virheistä githubissa.
              </Alert>
              <Button fullWidth variant="contained" href="https://github.com/TMKCodes/vuokrapaja/issues" target="_blank" rel="noopener noreferrer" sx={{mt: 2}}>
                <GitHubIcon sx={{ml: 1}} />Ilmoita virheestä
              </Button>
              <Alert severity="info" sx={{mt: 2}}>
                <p style={{mt:2}}>Tämä sivusto on luotu opiskelijaprojektina. Tarkoituksena on luoda vuokra-asuntojen etsimiseen
                kätevä ja helppokäyttöinen sivusto. Sivustolla on tarkoitus myös mahdollistaa vuokra-asuntojen
                ilmoittaminen ja vuokra-asuntojen hallinta.</p> 
                <p>
                Sivuston tarkoituksena on myös opettaa ja harjoitella Reactin käyttöä sekä
                käyttää sivuston tekemiseen uusia teknologioita.</p> 
                
                <p>Sivuston tekijät ovat:</p>
                <ul>
                  <li>Toni Lukkaroinen</li>
                </ul>
                <p>
                  Sivuston data tullaan poistamaan kun siirrymme beta vaiheesta pois.
                </p>
              </Alert>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <SearchApartments landing={true} />
    </>
  )
}

export default Landing;