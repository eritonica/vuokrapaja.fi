import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Password } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';

const RecoveryPasswordForm = (props) => {

  const [recoveryState, setRecoveryState] = useState({
    password: '',
    passwordconfirm: '',
    recoverySuccess: false,
    recoveryError: false,
    recoveryErrorMessage: '',
  });

  const [searchParams] = useSearchParams();

  const handleRecovery = async (event) => {
    event.preventDefault();
    if(recoveryState.password !== recoveryState.passwordconfirm) {
      setRecoveryState({
        recoveryError: true,
        recoveryErrorMessage: "Salasanat eivät täsmää.",
      });
      return;
    }
    let code = searchParams.get('code');
    let response = await fetch('/api/accounts/recovery/' + code, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: recoveryState.password,
      }),
    });
    // console.log(response);
    let body = await response.json();
    if(body.message === "Password changed.") {
      setRecoveryState({
        recoverySuccess: true,
        recoveryError: false,
        recoveryErrorMessage: '',
      });
    } else {
      setRecoveryState({
        recoveryError: true,
        recoveryErrorMessage: "Salasanan palautus epäonnistui jostain syystä. Yritä uudelleen.",
      });
    }
  }

  const handleChange = (event) => {
    setRecoveryState({ ...recoveryState, [event.target.name]: event.target.value });
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={ handleRecovery } sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="password" type="password" label="Uusi salasana:" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="passwordconfirm" type="password" label="Uusi salasana uudelleen:" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" startIcon={<Password />}>Vaihda salasana</Button>
          </Grid>
          {recoveryState.recoveryError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{recoveryState.recoveryErrorMessage}</Alert>
            </Grid>
          )}
          {recoveryState.recoverySuccess && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="success">Salasanan vaihto onnistui. Voit nyt kirjautua sisään uudella salasanallasi.</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default RecoveryPasswordForm