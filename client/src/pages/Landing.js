import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import SearchApartments from './apartments/Search.js';

const Landing = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mt: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ textAlign: "center"}}>
              <Typography variant="h2" component="h1" gutterBottom>Tervetuloa {name} palveluun.</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <SearchApartments landing={true} />
    </>
  )
}

export default Landing;