import { useDispatch } from 'react-redux';
import { setToken } from '../appSlice';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Login, AppRegistration, Password, Google } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect } from 'react';
import { GoogleLogin } from "@react-oauth/google";


// Needs rewriting to use Redux

const LoginForm = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    loginError: false,
    loginErrorMessage: '',
    passwordResetCount: 0,
    resetPassword: false,
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    let result = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginState),
    });
    let body = await result.json();
    console.log(body);
    if(body.token) {
      dispatch(setToken(body.token));
      navigate('/');
    } else {
      if (body.message === "Password is incorrect.") {
        console.log(loginState.passwordResetCount)
        if(loginState.passwordResetCount >= 3) {
          setLoginState({ ...loginState, 
            loginError: true, 
            loginErrorMessage: 'Salasana on väärin.',
            resetPassword: true,
            passwordResetCount: loginState.passwordResetCount + 1 
          });
        } else {
          setLoginState({
            ...loginState,
            loginError: true,
            loginErrorMessage: 'Salasana on väärin.',
            passwordResetCount: loginState.passwordResetCount + 1,
          });
        }
      } else {
        setLoginState({
          ...loginState,
          loginError: true,
          loginErrorMessage: body.message,
        })
      }
    }
  }

  useEffect(() => {
    const fetcData = async () => {
      let result = await fetch('/api/google/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      let body = await result.json();
      if (body.token) {
        dispatch(setToken(body.token));
        navigate('/');
      }
    }
    fetcData();
  }, [loginState]);

  const handleChange = (event) => {
    setLoginState({ ...loginState, [event.target.name]: event.target.value });
  }

  const onRegisterButton = () => {
    navigate("/register");
  }

  const onResetPasswordButton = () => {
    navigate("/recovery");
  }

  const onGoogleLogin = async (googleData) => {
    console.log(googleData);
    const res = await fetch("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        token: googleData.credential,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const body = await res.json();
    console.log(body);
    if (body.token) {
      dispatch(setToken(body.token));
      navigate('/');
    }
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleLogin} sx={{ marginTop: "30px", flexGrow: 1}}>
        <Grid container spacing={2}>
          {searchParams.get("activated") && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="success">Tervetuloa, nyt voit kirjautua uudella käyttäjätunnuksellasi.</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField fullWidth name="email" type="text" label="Sähköpostiosoite:" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="password" type="password" label="Salasana:" onChange={handleChange} />
          </Grid>
          <Grid item xs={12} spacing={2}>
            <Grid container spacing={0.5}>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" type="submit" startIcon={<Login />}>Kirjaudu</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="contained" onClick={ onRegisterButton } startIcon={<AppRegistration />}>Rekisteröidy</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={0.5}>
              <Grid item xs={3}></Grid>
              <Grid item xs={6}>
                <GoogleLogin
                  onSuccess={credentialResponse => onGoogleLogin(credentialResponse)}
                  onFailure={() => console.log("Google login failed")}
                  useOneTap={true}
                />
              </Grid>
              <Grid item xs={3}></Grid>
            </Grid>
          </Grid>
          {loginState.loginError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{ loginState.loginErrorMessage }</Alert>
            </Grid>
          )}
          {loginState.resetPassword && (
            <Grid item xs={12}>
              <Alert variant="standard" severity="info">Jos olet unohtanut salasanasi, koita palauttaa se.</Alert>
            </Grid>
          )}
          {loginState.resetPassword && (
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={ onResetPasswordButton } startIcon={<Password />}>Palauta salasana</Button>
            </Grid> 
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginForm;