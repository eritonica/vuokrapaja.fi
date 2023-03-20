import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button, List, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import MUIIcon from '@mui/icons-material/CheckCircleOutline';

const RenterInfo = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Vuokranantajalle
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" component="h2" gutterBottom>
                Ilmoituksen tekeminen
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Vuokranantajana voit ilmoittaa vuokrattavaksi kiinteistöjä, joita
                omistat tai hallitset. Sinun tarvitsee vain rekisteröityä palveluun,
                luoda yritysprofiilisi ja voit alkaa ilmoittamaan kiinteistöjäsi. 
                Ilmoituksesi näkyy kaikille palvelun käyttäjille.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <MUIIcon />
                  </ListItemIcon>
                  <ListItemText primary="Rekisteröidy palveluun kirjautuaksesi tai kirjaudu Google tunnuksillasi." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MUIIcon />
                  </ListItemIcon>
                  <ListItemText primary="Luo käyttäjäprofiilisi ja valitse vuokranantaja tai kiinteistönvälittäjä tyyppi." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MUIIcon />
                  </ListItemIcon>
                  <ListItemText primary="Luo yritysprofiili. Yrityksen nimi ja y-tunnus ovat pakollisia." />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MUIIcon />
                  </ListItemIcon>
                  <ListItemText primary="Yksityisenä vuokranantajana voit laittaa yritysprofiiliin oman nimesi ja 0000000-0 y-tunnuksen" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <MUIIcon />
                  </ListItemIcon>
                  <ListItemText primary="Voit alkaa ilmoittamaan kiinteistöjäsi." />
                </ListItem>
              </List>
              <Typography variant="body1" component="p" style={{fontWeight: "bold"}} gutterBottom>
                Vuokrattavien kiinteistöjen ilmoittaminen on maksullista. Ilmoituksen
                hinta 65€ sisältäen arvonlisäveron. 
              </Typography>
              <Typography variant="body1" component="p" style={{fontWeight: "bold"}} gutterBottom>
                Joka kolmas ilmoitus on ilmainen. 
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Ilmoituksen tekeminen onnistuu järjestelmän käyttöliittymää käyttäen. Ilmoituksen
                tekemisen ja maksamisen jälkeen ilmoitus näkyy kaikille palvelun käyttäjille.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" component="p" style={{fontWeight: "bold"}} gutterBottom>
                Ilmoituksen tekijä vastaa ilmoituksen oikeellisuudesta.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Pidätämme kaiken oikeuden kieltää ilmoituksen tekemisen, jos
                ilmoituksen tekijä ei täytä palvelun käyttöehtoja.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Pidätämme oikeuden muuttaa ilmoitusten tekemisen hintaa. Ilmoitukset
                maksetaan yksi ilmoitus kerrallaan. 
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Ilmoitusta tehdessäsi on pakollista antaa kiinteistön osoite.
                Kiinteistön osoite on pakollinen, koska ilmoituksen tekijä
                vastaa kiinteistön osoitteen oikeellisuudesta. Jos kiinteistön
                osoite on virheellinen, ilmoitus poistetaan järjestelmästä.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Voit myös ilmoittaa kiinteistölle oman hakemus linkin, jossa voi hakea kiinteistöä vuokralle.
                Palvelun käyttäjä tällöin ohjataan sinun sivullesi, jossa voit kysyä
                vuokralaiselta tietoja joita palvelussa ei voi kysyä.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Voit luoda, muokata ja poistaa ilmoituksia. Pystyt myös ilmoittamaan hakijoille, onko heidän hakemus hyväksytty vai hylätty. 
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" href="/register">
                Rekisteröidy
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default RenterInfo;