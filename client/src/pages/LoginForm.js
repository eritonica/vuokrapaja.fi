import { useNavigate } from "react-router-dom";
import { Container, Box, TextField, Button } from '@mui/material';
import { Login, AppRegistration } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';

const LoginForm = (props) => {
  const navigate = useNavigate();
  const [appState, setAppState] = props.appState;
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    let result = await fetch('http://localhost:8080/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginState),
    });
    let body = await result.json();
    console.log(body);
    if(body.token) {
      setAppState({ ...appState, token: body.token });
      navigate('/');
    }
  }

  const handleChange = (event) => {
    setLoginState({ ...loginState, [event.target.name]: event.target.value });
  }

  const onRegisterButton = () => {
    navigate("/register");
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleLogin} sx={{ marginTop: "30px", flexGrow: 1}}>
        <Grid container spacing={2}>
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
                <Button fullWidth variant="contained" onClick={ onRegisterButton }startIcon={<AppRegistration />}>Rekisteröidy</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginForm;