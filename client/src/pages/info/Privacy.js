import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button, List, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import GitHubIcon from '@mui/icons-material/GitHub';

const Privacy = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                TIETOSUOJASELOSTE
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                1. Rekisterin pitäjä
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} on palvelu, jonka rekisteriä ylläpitää Hoosat Oy. 
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                2. Yhteystiedot rekisteriasioita varten
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Hoosat Oy
                044 937 5656
                toni.lukkaroinen@hoosat.i
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                3. Rekisterin nimi
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Vuokrapaja
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                4. Rekisterin peruste ja tarkoitus
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisterin perusteena on käyttäjän suostumus. Rekisterin tarkoitus on 
                käyttäjän rekisteröitymisen ja kirjautumisen yhteydessä kerätä käyttäjän 
                yhteystiedot ja muut tarvittavat tiedot, jotta käyttäjä voi käyttää palvelua. 
                Rekisterin tarkoitus on myös käyttäjän ilmoitusten ja hakemusten yhteydessä 
                kerätä käyttäjän yhteystiedot ja muut tarvittavat tiedot, 
                jotta käyttäjä voi käyttää palvelua.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                5. Rekisterin tietosisältö
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisteriin tallennetaan käyttäjän nimi, puhelinnumero, sähköpostiosoite,
                työpaikka, kuukausitulo, tupakointi, luottotiedot, ilmoitukset ja hakemukset.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                6. Rekisterin tietolähteet
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisterin tietolähteet ovat käyttäjän itse antamat tiedot.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                7. Rekisterin tietojen luovuttaminen ja vastaanottajat.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisterin tietoja ei luovuteta kolmansille osapuolille. Rekisterin tietoja 
                ei luovuteta EU:n tai ETA:n ulkopuolelle. Rekisterin tietoja ei luovuteta 
                rekisterinpitäjän ulkopuolisille tahoille. Rekisterin tietojen vastaanottajia 
                ovat palvelun ylläpitäjä ja palvelun tarjoaja. Rekisterin tiedot luovutetaan
                tapauskohtaisesti palvelun käyttäjälle, että käyttäjä voi käyttää palvelua. 
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                8. Rekisterin suojauksen periaatteet
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisterin suojauksen periaatteet ovat käyttäjän salasanan suojaus ja
                käyttäjän tietojen salaus. 
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                9. Rekisterin tietojen säilytysaika
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisterin tietoja säilytetään niin kauan kuin käyttäjä on rekisteröitynyt palveluun.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                10. Rekisteröidyn oikeudet ja oikeuksien toteuttaminen.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Rekisteröidyllä on oikeus saada tietoja siitä, mitä hänen henkilötietojaan
                käsitellään. Rekisteröidyllä on oikeus pyytää tietojen oikaisemista,
                poistamista tai rajoittamista. Rekisteröidyllä on oikeus kieltää
                tietojen käsittely. Rekisteröidyllä on oikeus tehdä
                valitus tietosuojavaltuutetulle. Rekisteröidyllä on oikeus peruuttaa
                suostumuksensa.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Privacy;