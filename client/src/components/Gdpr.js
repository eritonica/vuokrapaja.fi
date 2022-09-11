import CookieConsent, { Cookies } from "react-cookie-consent";
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Gdpr = (props) => {
  const [appState, setAppState] = props.appState;

  const handleAcceptCookies = () => {
    console.log('Cookies accepted');
    // Enable tracking, etc..
    setAppState({ ...appState, cookiesAccepted: true });
  }

  return (
    <CookieConsent 
      location="bottom"
      buttonText="Hyväksy"
      cookieName={ appState.name + "-GDPR-Cookie"}
      cookieSecurity={true}
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "18px", margin: "15px" }}
      expires={150}
      onAccept={handleAcceptCookies}>
        Tämä sivusto käyttää evästeitä. Käyttämällä sivustoa hyväksyt evästeiden käytön.
    </CookieConsent>
  )
}

export default Gdpr;