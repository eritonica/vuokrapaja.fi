import { useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Landing = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <Container sx={{ backgroundColor: "#AAAAAA" }}>
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Tervetuloa { name } palveluun. </h1>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Landing;