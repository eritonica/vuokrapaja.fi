import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Login } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';

/**
 * Represents the ActivationForm component for user account activation.
 * @function
 * @param {Object} props - The component's props.
 * @returns {JSX.Element} The JSX element containing the ActivationForm component.
 */
const ActivationForm = (props) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activationState, setActivationState] = useState({
    activationError: false,
    activationErrorMessage: '',
  });
  //const navigate = useNavigate();

  /**
   * Handles the user account activation form submission.
   * @param {Event} event - The form submission event.
   */
  const handleActivation = async (event) => {
    event.preventDefault();
    let result = await fetch('/api/accounts/activate/' + searchParams.get("code"), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let body = await result.json();
    // console.log(body);
    if(body.message === "Account activated, ready for use. Please add your profile information.") {
      navigate("/login?activated=true");
    } else {
      setActivationState({
        activationError: true,
        activationErrorMessage: body.message,
      });
    }
  }

  /**
   * Handles changes in the input fields.
   * @param {Event} event - The input change event.
   */
  const handleChange = (event) => {
    setSearchParams({ ...searchParams, [event.target.name]: event.target.value });
  }

  return (
    <Container maxWidth="sm">
      <Box component={'form'} onSubmit={handleActivation} sx={{ marginTop: "30px", flexGrow: 1}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth name="code" type="text" label="Aktivointikoodi:" onChange={handleChange} inputRef={(input) => input?.focus()} value={ searchParams.get("code") } />
          </Grid>
          <Grid item xs={12} spacing={2}>
            <Button fullWidth variant="contained" type="submit" startIcon={<Login />}>Aktivoi käyttäjätunnuksesi</Button>
          </Grid>
          {activationState.activationError && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="error">{activationState.activationErrorMessage}</Alert>
            </Grid>
          )} 
        </Grid>
      </Box>
    </Container>
  );
};

export default ActivationForm;