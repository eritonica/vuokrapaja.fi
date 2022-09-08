import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { AppRegistration } from "@mui/icons-material";

const RegisterEmailNotification = (props) => {
  const [appState, setAppState] = props.appState;

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Rekisteröityminen onnistui!</h1>
          </Grid>
          <Grid item xs={12}>
            <p>Rekisteröityminen onnistui. Tarkista sähköpostisi ja aktivoi tunnus.</p>
          </Grid>
        </Grid>
      </Box>
    </Container>

  )
};

export default RegisterEmailNotification;