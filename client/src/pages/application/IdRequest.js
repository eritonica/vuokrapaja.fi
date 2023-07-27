import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert } from '@mui/material';
import { Login } from "@mui/icons-material";
import Grid from '@mui/material/Unstable_Grid2';

/**
 * Represents the component for handling ID requests and credit checks.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} The JSX element containing the ID request form.
 */
const IdRequest = (props) => {
  const [message, setMessage] = useState()
  const { validation } = useParams();
  const [applicants, setApplicants] = useState([{
    code: "",
  }]);
  
  /**
   * Handler for submitting the ID request and credit check.
   * @returns {Promise<void>}
   */
  const onSubmit = async () => {
    let numbers = applicants.map((applicant) => applicant._id + "||" + applicant.name + "||" + applicant.code);
    numbers = numbers.join(", ");
    console.log(numbers);
    const result = await fetch(`/api/id-request/credit-check/answer/${ validation }`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        numbers: numbers,
      })
    });
    console.log(result);
    const response = await result.json();
    console.log(response);
    if(response.result === "success") {
      setMessage("Henkilötunnukset lähetetty. ");
    }
  }

  /**
   * Handler for updating the applicant's code when input changes.
   * @param {Object} changedApplicant - The applicant object whose code is changed.
   * @param {Event} event - The input change event.
   */
  const onChange = (changedApplicant, event) => {
    let tmpApplicants = applicants.map((applicant) => {
      if(applicant._id === changedApplicant._id) {
        applicant.code = event.target.value;
      }
      return applicant;
    });
    setApplicants(tmpApplicants);
  }

  /**
   * Fetch the list of applicants from the API using the validation parameter.
   * @type {Function}
   */
  const getApplicants = useCallback(() => {
    const fetchApplicants = async () => {
      console.log("fetch applicants from id-request");
      const result = await fetch(`/api/id-request/applicants/${ validation }`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      });
      const response = await result.json();
      console.log(response);
      if(response.result === "success") {
        let tmpApplicants = response.applicants.map((applicant) => {
          applicant.code = "";
          return applicant;
        })
        setApplicants(tmpApplicants);
      }
    }
    fetchApplicants();
  }, [validation]);

  useEffect(getApplicants, [getApplicants]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: "30px", flexGrow: 1}}>
        <Grid container spacing={2}>
          { (applicants !== undefined && applicants.length > 0) && applicants.map((applicant) => 
            <Grid item xs={12} key={applicant._id + "-Grid"}>
              <TextField key={applicant._id + "-TextField"} fullWidth name="code" type="text" label={`${applicant.name} henkilötunnus:`} onChange={(e) => onChange(applicant, e)} inputRef={(input) => input?.focus()} value={ applicant.code }/>
            </Grid>
          )}
          { message && (
            <Grid item xs={12}>
              <Alert variant="filled" severity="info">{message}</Alert>
            </Grid>
          )} 
          <Grid item xs={12} spacing={2}>
            <Button fullWidth variant="contained" type="submit" startIcon={<Login />} onClick={onSubmit}>Lähetä henkilötunnukset</Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default IdRequest;