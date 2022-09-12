import { useState } from 'react';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Password } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';

const RequestForm = (props) => {
  const [recoveryState, setRecoveryState] = useState({
    email: '',
    recoverySuccess: false,
    recoveryError: false,
    recoveryErrorMessage: '',
  });

  const handleRecovery = async (event) => {
    event.preventDefault();
    let response = await fetch('http://localhost:8080/api/accounts/recovery/' + recoveryState.email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    let body = await response.json();
    console.log(body);
    if(body.message === "Recovery email sent.") {
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
            <TextField fullWidth name="email" type="email" label="Sähköpostiosoite:" onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" startIcon={<Password />}>Lähetä salasanan palautuslinkki</Button>
          </Grid>
          {recoveryState.recoveryError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{recoveryState.recoveryErrorMessage}</Alert>
            </Grid>
          )}
          {recoveryState.recoverySuccess && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="success">Sähköpostiosoitteeseen lähetetty salasanan palautuslinkki.</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default RequestForm;
