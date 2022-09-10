import { useState } from 'react';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Password } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';

const Landing = (props) => {
  const [appState, setAppState] = props.appState;

  return (
    <Container sx={{ backgroundColor: "#AAAAAA" }}>
      <Box sx={{ marginTop: "40px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Tervetuloa { appState.name } palveluun. </h1>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Landing;