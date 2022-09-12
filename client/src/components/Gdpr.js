import CookieConsent from "react-cookie-consent";
import { useSelector, useDispatch } from 'react-redux';
import { toggleCookies } from '../appSlice';


const Gdpr = (props) => {
  const dispatch = useDispatch();

  const handleAcceptCookies = () => {
    dispatch(toggleCookies());
  }

  return (
    <CookieConsent 
      location="bottom"
      buttonText="Hyväksy"
      cookieName={ useSelector((state) => state.app.name) + "-GDPR-Cookie"}
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