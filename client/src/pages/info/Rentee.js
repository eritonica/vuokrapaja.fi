import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button, List, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import MUIIcon from '@mui/icons-material/CheckCircleOutline';

const RenteeInfo = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <div style={{display: "flex", justifyContent: "center"}}>
                <iframe width="720" height="405" src="https://www.youtube.com/embed/6BXerDVV2SI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Vuokralaisille
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom>
                Ilmoitusten etsiminen
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Vuokralaisena voit hakea kiinteistöjä, joita vuokranantajat ovat
                ilmoittaneet palveluun. Voit etsiä vuokrattavia kiinteistöjä
                rekisteröitymättä palveluun. Sinun tarvitsee vain valita
                hakuehdot ja voit alkaa etsiä kiinteistöjä. Kiinteistöjen
                hakeminen on maksutonta.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom>
                Hakemuksen tekeminen
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Kun olet löytänyt sinua kiinnostavan kohteen voit tehdä
                siitä maksutta hakemuksen. Tieto hakemuksestasi menee
                suoraan vuokranantajalle.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" href="/register">
                Rekisteröidy
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" href="/apartments/search">
                Etsi kiinteistöjä
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default RenteeInfo;