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
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <img src="house1.jpg" alt="house" style={{width: "100%"}} />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <SearchApartments landing={true} />
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid item xs={12} sx={{pt: 3}}>
            <Alert severity="info" >
              Tämä on beta-versio. Sivustolla saattaa olla virheitä ja ominaisuuksia puuttuu.
              Joten ole kärsivällinen ja ilmoita virheistä githubissa.
            </Alert>
            <Button fullWidth variant="contained" href="https://github.com/TMKCodes/vuokrapaja/issues" target="_blank" rel="noopener noreferrer" sx={{mt: 2}}>
              <GitHubIcon sx={{ml: 1}} />Ilmoita virheestä
            </Button>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Landing;