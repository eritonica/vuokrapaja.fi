import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AppRegistration } from "@mui/icons-material";

const RegisterForm = (props) => {
  const navigate = useNavigate();
  const [appState, setAppState] = props.appState;
  const [registerState, setRegisterState] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (event) => {
    setRegisterState({ ...registerState, [event.target.name]: event.target.value });
  }

  const handleRegister = (event) => {
    event.preventDefault();
    console.log(registerState);
    navigate("/register/emailnotification");
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleRegister} sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="username" label="Käyttäjänimi" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="email" type="email" label="Sähköpostiosoite" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="password" type="password" label="Salasana" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="passwordConfirm" type="password" label="Salasanan varmistus" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" startIcon={<AppRegistration />}>Rekisteröidy</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default RegisterForm;