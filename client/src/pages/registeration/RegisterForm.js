import { useState, useCallback, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container, Box, TextField, Button, Alert, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AppRegistration } from "@mui/icons-material";

// Needs rewriting to use Redux

const RegisterForm = (props) => {
  const { code } = useParams();

  const [registerState, setRegisterState] = useState({
    offer: {},
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    usernameError: false,
    usernameErrorMessage: '',
    passwordError: false,
    passwordErrorMessage: '',
    emailError: false,
    emailErrorMessage: '',
    passwordConfirmError: false,
    passwordConfirmErrorMessage: '',
    registerError: false,
    registerErrorMessage: '',
    registerSuccess: false,
  });


  const handleChange = (event) => {
    setRegisterState({ ...registerState, 
      usernameError : false,
      passwordError : false,
      emailError : false,
      passwordConfirmError : false,
      registerError : false,
      registerSuccess : false,
      [event.target.name]: event.target.value });
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const checkOffers = useCallback( () => {
      const getOfferByCode = async () => {
        console.log(code);
        if(code === undefined) {
          return;
        }
        try {
          const result = await fetch(`/api/referral/${code}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const response = await result.json();
          console.log(response);
          if(!response) {
            console.log(response);
          } else {
            if(response.message.recipient === undefined) {
              console.log("Undefined response.message.recipient");
            } else {
              setRegisterState({
                ...registerState,
                email: response.message.recipient,
                offer: response.message
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
      getOfferByCode();
  }, [code]);

  useEffect(checkOffers, [checkOffers]);

  const handleRegister = async (event) => {
    event.preventDefault();
    if(registerState.username.length < 3) {
      setRegisterState({ ...registerState, usernameError: true, usernameErrorMessage: "Käyttäjätunnuksen tarvitsee olla vähintään 3 merkkiä pitkä." });
      return;
    }
    if(registerState.password.length < 8) {
      setRegisterState({ ...registerState, passwordError: true, passwordErrorMessage: "Salasanan tarvitsee olla vähintään 8 merkkiä pitkä." });
      return;
    }
    if(/\d/.test(registerState.password) === false) {
      setRegisterState({ ...registerState, passwordError: true, passwordErrorMessage: "Salasanan tarvitsee sisältää ainakin 1 numero." });
      return;
    }
    if(registerState.password !== registerState.passwordConfirm) {
      setRegisterState({ ...registerState, passwordConfirmError: true, passwordConfirmErrorMessage: "Salasanat eivät vastaa toisiaan." });
      return;
    }
    if(validateEmail(registerState.email) === false) {
      setRegisterState({ ...registerState, emailError: true, emailErrorMessage: "Sähköpostiosoite ei ole validi." });
      return;
    }
    if(registerState.email.length < 5) {
      setRegisterState({ ...registerState, emailError: true, emailErrorMessage: "Sähköpostiosoitteen tarvitsee olla vähintään 5 merkkiä pitkä." });
      return;
    }
    if(registerState.usernameError === false && registerState.passwordError === false && registerState.emailError === false) {
      let response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerState),
      });
      let data = await response.json();
      if(data.message === "Account created, waiting for verification.") {
        setRegisterState({ ...registerState, registerSuccess: true });
      } else {
        if(data.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.email") {
          setRegisterState({ ...registerState, registerError: true, registerErrorMessage: "Email already in use." });
        } else {
          setRegisterState({ ...registerState, registerError: true, registerErrorMessage: data.message });
        }
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleRegister} sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          { (registerState.offer !== {} && code !== undefined) &&
            <Grid item xs={12}>
              <Typography>Hei, sinulle on lähetetty rekisteröitymisen yhteyteen tarjous:</Typography>
              <Typography style={{color: "red"}}>Ensimmäiseen ilmoitukseen: {registerState.offer.deal} alennus.</Typography>
              <Typography>Tarjous aktivoituu kun teet Vuokrapajassa ilmoituksen.</Typography>
            </Grid>
          }
          <Grid item xs={12}>
            <TextField fullWidth name="username" label="Käyttäjänimi" onChange={handleChange} />
          </Grid>
          {registerState.usernameError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.usernameErrorMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth name="email" type="email" label="Sähköpostiosoite" value={registerState.email}onChange={handleChange} />
          </Grid>
          {registerState.emailError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.emailErrorMessage}</Alert>
            </Grid>
          )} 
          <Grid item xs={12}>
            <TextField fullWidth name="password" type="password" label="Salasana" onChange={handleChange} />
          </Grid>
          {registerState.passwordError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.passwordErrorMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth name="passwordConfirm" type="password" label="Salasanan varmistus" onChange={handleChange} />
          </Grid>
          {registerState.passwordConfirmError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.passwordConfirmErrorMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" startIcon={<AppRegistration />}>Rekisteröidy</Button>
          </Grid>
          {registerState.registerError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.registerErrorMessage}</Alert>
            </Grid>
          )}
          {registerState.registerSuccess && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="success">Kiitoksia rekisteröitymisestä. Hetken päästä sinun pitäisi saada sähköpostia joka sisältää linkin käyttäjätunnuksesi aktivointiin.</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default RegisterForm;