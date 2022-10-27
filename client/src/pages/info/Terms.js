import { useSelector } from 'react-redux';
import { Container, Box, Paper, Typography, Alert, Button, List, ListItem, ListItemText, ListItemIcon  } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import GitHubIcon from '@mui/icons-material/GitHub';

const Terms = (props) => {
  const name = useSelector((state) => state.app.name);

  return (
    <>
      <Container maxWidth="md" sx={{mt: 4, pb: 4, mb: 4}} component={Paper}>
        <Box sx={{ marginTop: "40px", flexGrow: 1}}>
          <Grid container spacing={2} sx={{pt:3}}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                KÄYTTÖEHDOT
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                1. Yleistä verkkopalvelun käytöstä
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Tervetuloa {name} palveluun. Kehoitamme sinua tutustumaan näihin 
                käyttöehtoihin (Jäljempänä ehdot) huolellisesti ennen palvelun käyttöä.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Nämä ehdot soveltuvat kaikkiin käyttäjän toimiin {name} palvelussa 
                riippumatta siitä onko käyttäjä rekisteröitynyt palveluun tai ei 
                tai millä päätelaitteella palvelua käytetään. Palvelu voi lisäksi
                sisältää osioita tai toimintoja, joiden käyttämiseen sovelletaan
                näiden ehtojen lisäksi {name} palvelun erillisiä ehtoja ja
                ohjeita. Ehtojen lisäksi {name} palvelun käyttöön saattaa
                edellyttää rekisteröitymisen. 
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Ehdot muodostavat sopimuksen {name} palvelun käyttäjän ja
                {name} palvelun tarjoajan välille. Palvelun käyttäjä on henkilö,
                joka käyttää palvelua. Palvelun tarjoaja on {name} palvelun
                tarjoava yhtiö tai henkilö. Palvelun käyttäjä hyväksyy nämä ehdot
                käyttämällä palvelua.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttöä säätelevät Suomen lainsäädäntö ja
                {name} palvelun käyttöehdot. {name} palvelun käyttäjänä
                hyväksyt nämä ehdot. Jos et hyväksy näitä ehtoja, älä käytä
                palvelua.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                2. Palveluntarjoaja
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Toni Lukkaroinen
                044 937 5656
                toni.lukkaroinen@gmail.com
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                3. Henkilötietojen käsittely
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjän henkilötietoja käsitellään
                {name} palvelun tarjoajan toimesta. {name} palvelun
                käyttäjän henkilötietoja käsitellään kulloinkin voimassa
                olevan henkilötietolainsäädännön sallimalla ja velvoittamalla 
                tavalla ja vain niin, kuin {name} palvelun käyttöehdoissa on määritelty.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                4. Evästeet
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjän tietokoneelle tai muulle
                laitteelle tallennetaan evästeitä. Evästeet ovat pieniä
                tekstitiedostoja, jotka tallentuvat käyttäjän tietokoneelle tai
                muulle laitteelle. Evästeet tallentuvat käyttäjän tietokoneelle
                tai muulle laitteelle vain, jos käyttäjä hyväksyy evästeiden
                tallentamisen. Evästeiden avulla {name} palvelun
                tarjoaja voi seurata käyttäjän käyttäytymistä {name} palvelussa.

                Käyttäjä voi estää evästeiden toiminnan niin halutessaan muuttamalla
                omia selainasetuksiaan. Käyttäjän tulee kuitenkin huomioda, että
                evästeiden käytön estäminen toi niiden poistaminen voi vaikuttaa
                haitallsiesti {name} palvelun tai sen tiettyjen osioiden tai
                toimintojen käyttöön tai jopa estää sen kokonaan.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                5. Palvelun käyttö
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelu möyntää käyttäjälle näissä ehdoissa määritellyn
                rajoitetun, peruutettavissa olevan, ei-yksinomaisen ja henkilökohtaisen
                oikeuden käyttää {name} palvelua ja sen sisältöä ainoastaan
                näiden ehtojen mukaisesti. Käyttäjällä on oikeus käyttää
                {name} palvelua ja sen sisältöä vain omaan, ei-kaupalliseen käyttöön. 
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Käyttäjä ei saa muuttaa, kopioida, jäljentää, myydä, myydä
                uudelleen, luovuttaa, vuokrata, lainata, jakaa,
                tai muuten käyttää {name} palvelua tai sen sisältöä.
                Käyttäjä ei saa muuttaa tai poistaa {name} palvelun
                tai sen sisältöön liittyviä oikeuksia, merkintöjä tai
                ilmoituksia.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Käyttäjä ei saa käyttää {name} palvelua tai sen sisältöä
                sellaisessa tarkoituksessa, joka on laitonta, loukkaavaa,
                uhkaavaa, häiritsevää.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Käyttäjä ei saa käyttää {name} palvelua tai sen sisältöä
                sellaisessa tarkoituksessa, joka loukkaa kolmannen osapuolen
                oikeuksia, mukaan lukien, mutta ei rajoittuen, tekijänoikeuksiin,
                tavaramerkkeihin, kaupallisiin salaisuuksiin, tietosuojaan tai
                muuhun omaisuuteen.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Käyttäjä ei saa käyttää {name} palvelua tai sen sisältöä
                sellaisessa tarkoituksessa, joka on teknisesti haitallista
                (mukaan lukien, mutta ei rajoittuen, virusten, troijalaisten).
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                6. Palvelun muutokset
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja voi muuttaa {name} palvelua
                tai sen sisältöä milloin tahansa ilman erillistä ilmoitusta.
                {name} palvelun tarjoaja ei ole velvollinen ilmoittamaan
                {name} palvelun käyttäjälle {name} palvelun tai sen
                sisällön muutoksista.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                7. Palveluun rekisteröityminen ja kirjautuminen
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjä voi rekisteröityä {name} palveluun
                käyttämällä {name} palvelun tarjoamaa rekisteröitymislomaketta.
                Rekisteröitymislomakkeessa käyttäjä antaa {name} palvelun
                tarjoajalle tietoja, jotka ovat tarpeellisia {name} palvelun
                käyttämiseksi. Käyttäjä vastaa siitä, että hän antaa
                {name} palvelun tarjoajalle oikeat ja täydelliset tiedot.
                Käyttäjä vastaa siitä, että hän pitää {name} palvelun
                tarjoajalle antamansa tiedot ajan tasalla.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjä voi kirjautua {name} palveluun
                käyttämällä {name} palvelun tarjoamaa kirjautumislomaketta.
                Kirjautumislomakkeessa käyttäjä antaa {name} palvelun
                tarjoajalle tietoja, jotka ovat tarpeellisia {name} palvelun
                käyttämiseksi. Käyttäjä vastaa siitä, että hän antaa
                {name} palvelun tarjoajalle oikeat ja täydelliset tiedot.
                Käyttäjä vastaa siitä, että hän pitää {name} palvelun
                tarjoajalle antamansa tiedot ajan tasalla.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                8. Palvelun käyttöoikeuden peruuttaminen
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja voi peruuttaa {name} palvelun
                käyttöoikeuden milloin tahansa ilman erillistä ilmoitusta.
                {name} palvelun tarjoaja ei ole velvollinen ilmoittamaan
                {name} palvelun käyttäjälle {name} palvelun käyttöoikeuden
                peruuttamisesta.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                9. Palvelun käyttöoikeuden siirto
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjä ei saa siirtää {name} palvelun
                käyttöoikeutta kolmannelle osapuolelle.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                10. Palvelun sisältämät linkit ulkopuolisille verkkosivuille ja ulkopuoliset linkit {name} palveluun
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelu voi sisältää linkkejä ulkopuolisiin verkkosivuihin.
                {name} palvelun tarjoaja ei ole vastuussa {name} palvelun
                käyttäjän käyttämästä ulkopuolista verkkosivua.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttäjä voi linkittää ulkopuolisen verkkosivun
                {name} palveluun. {name} palvelun tarjoaja ei ole vastuussa
                {name} palvelun käyttäjän linkittämästä ulkopuolista verkkosivua.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                11. Vastuurajoitukset
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja ei ole vastuussa {name} palvelun
                käyttäjän käyttämästä {name} palvelua tai sen sisältöä.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja ei voi taata, että {name} palvelu
                on käytettävissä jatkuvasti tai että {name} palvelu on
                virheetön. 
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja ei ole vastuussa {name} palvelun
                käyttäjälle aiheutuvista vahingoista, jotka johtuvat
                {name} palvelun käyttäjän laitteesta tai {name} palvelun
                käyttäjän käyttämästä ohjelmistosta.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja ei ole vastuussa mistään suorista,
                epäsuorista, välittömistä tai välilillisistä vahingoista tai 
                vahingonkorvausvelvollisuuteen perustuvista vahingoista tai
                erityisvahingoista, mukaan lukien liiketoiminnan, sopimuksen,
                tuoton tai tietojen menettämisestä tai liiketoiminnan keskeytymisestä
                johtuvat vahingot, jotka johtuvat {name} palvelun käyttämisestä
                tai sen sisällön käyttämisestä tai käytön estämisestä taikka
                näistä ehdoista, riippumatta siitä, perustuvatko vahingot sopimukseen,
                oikeudenloukkaukseen, huolimattomuuteen, virheeseen tai muuhun
                perusteeseen vaikka {name} palvelun tarjoajaa olisi varoitettu
                {name} palvelun käyttäjälle tällaisista vahingoista etukäteen.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Kaikissa tapauksissa {name} palvelun tarjoajan vastuu
                rajoittuu aina korkeintaan pakottavan lainsäädännön mukaiseen
                vastuuseen.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Käyttäjä vapauttaa {name} palvelun tarjoajan ja kaikki sen työntekijät, johtajat 
                ja sen lukuun toimivat vastuusta sellaisten kanteiden ja vaateiden osalta, jotka aiheutuvat
                tai liittyvät {name} palvelun käyttöön tai {name} palvelun sisältöön.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                12. Käyttöehtojen muutokset ja ilmoitukset
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun tarjoaja voi muuttaa {name} palvelun käyttöehtoja milloin tahansa. 
                {name} palvelun tarjoaja ei ole ilmoitusvelvollinen {name} palvelun käyttöehtojen muutoksista.
                {name} palvelun käyttäjä on velvollinen tarkistamaan {name} palvelun käyttöehdot
                säännöllisesti. {name} palvelun käyttäjä hyväksyy {name} palvelun käyttöehdot
                muutoksineen.
              </Typography>
              <Typography variant="h6" component="h2" gutterBottom>
                13. Soveltamisala ja voimaantulo
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttöehdot ovat voimassa {name} palvelun käyttäjän
                käyttöön {name} palvelun käyttöehdoissa mainittujen ehtojen mukaisesti.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                {name} palvelun käyttämiseen ja näihin ehtoihin sovelletaan Suomen lakia,
                lukuun ottamatta lainvalintasäännöksiä.
              </Typography>
              <Typography variant="body1" component="p" gutterBottom>
                Osapuolet pyrkivät ratkaisemaan erimielisyydet ensisijaisesti neuvotteluilla.
                Jos erimielisyydet eivät ratkea neuvotteluissa, osapuolet voivat
                hakea ratkaisua asianmukaisesta oikeusistuimesta Suomessa.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  )
}

export default Terms;