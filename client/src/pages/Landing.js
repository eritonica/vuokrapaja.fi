import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import AndroidIcon from '@mui/icons-material/Android';
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
              Jos haluat Vuokrapajan Android sovelluksena voit ladata sen puhelimellasi seuraavasta linkistä.
            </Alert>
            <Button fullWidth variant="contained" href="https://vuokrapaja.fi/uploads/releases/vuokrapaja-release-1.0.0-self-signed.apk" target="_blank" rel="noopener noreferrer" sx={{mt: 2}}>
              <AndroidIcon sx={{ml: 1, mr: 1}} />Lataa Android sovellus
            </Button>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid item xs={12} sx={{pt: 3}}>
            <Alert severity="warning" >
              Jos löydät virheitä Vuokrapaja toiminnallisuudessa, voit ilmoittaa niistä Github issue trackerissä.
            </Alert>
            <Button fullWidth variant="contained" href="https://github.com/TMKCodes/vuokrapaja/issues" target="_blank" rel="noopener noreferrer" sx={{mt: 2}}>
              <GitHubIcon sx={{ml: 1, mr: 1}} /> Ilmoita virheestä
            </Button>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Landing;