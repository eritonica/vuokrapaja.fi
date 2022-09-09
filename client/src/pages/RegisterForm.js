import { useState } from 'react';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AppRegistration } from "@mui/icons-material";

const RegisterForm = (props) => {
  const [appState, setAppState] = props.appState;
  const [registerState, setRegisterState] = useState({
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
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(email);
  }

  const handleRegister = async (event) => {
    event.preventDefault();
    if(registerState.username.length < 3) {
      setRegisterState({ ...registerState, usernameError: true, usernameErrorMessage: "Username must be at least 3 characters." });
    }
    if(registerState.password.length < 8) {
      setRegisterState({ ...registerState, passwordError: true, passwordErrorMessage: "Password must be at least 8 characters." });
    }
    if(/\d/.test(registerState.password) === false) {
      setRegisterState({ ...registerState, passwordError: true, passwordErrorMessage: "Password must contain at least one number." });
    }
    if(registerState.password !== registerState.passwordConfirm) {
      setRegisterState({ ...registerState, passwordConfirmError: true, passwordConfirmErrorMessage: "Passwords do not match." });
    }
    if(registerState.email.length < 5) {
      setRegisterState({ ...registerState, emailError: true, emailErrorMessage: "Email must be at least 5 characters." });
    }
    if(validateEmail(registerState.email) === false) {
      setRegisterState({ ...registerState, emailError: true, emailErrorMessage: "Email is not valid." });
    }
    if(registerState.usernameError === false && registerState.passwordError === false && registerState.emailError === false) {
      let response = await fetch('http://localhost:8080/api/accounts', {
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
        setRegisterState({ ...registerState, registerError: true, registerErrorMessage: data.message });
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleRegister} sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="username" label="Käyttäjänimi" onChange={handleChange} />
          </Grid>
          {registerState.usernameError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{registerState.usernameErrorMessage}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth name="email" type="email" label="Sähköpostiosoite" onChange={handleChange} />
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