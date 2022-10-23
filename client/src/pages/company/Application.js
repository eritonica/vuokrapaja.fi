import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Container, Box, Button, Typography, Alert, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const CompanyApplication = (props) => {
  const { id } = useParams();
  const company = useSelector(state => state.app.company);
  const token = useSelector(state => state.app.token);
  const [application, setApplication] = useState({});
  const [message, setMessage] = useState({ error: false, message: ""});

  const fetchApplication = useCallback(() => {
    const fetchApplication = async () => {
      const response = await fetch(`/api/applications/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        setMessage({ error: true, message: responseData.message });
      } else {
        setApplication(responseData.application);
      }
    }
    fetchApplication();
  }, [id, token]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchApplication, [fetchApplication]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Hakemus
            </Typography>
          </Grid>
          {message.error && 
            <Grid item xs={12}>
              <Alert severity="error">{message.message}</Alert>
            </Grid>
          }
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              Hakijat
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nimi</TableCell>
                    <TableCell align="right">Sähköposti</TableCell>
                    <TableCell align="right">Puhelinnumero</TableCell>
                    <TableCell align="right">Syntymäaika</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application && application.applicants && application.applicants.map((applicant) => (
                    <TableRow
                      key={applicant._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {applicant.name}
                      </TableCell>
                      <TableCell align="right">{applicant.email}</TableCell>
                      <TableCell align="right">{applicant.phone}</TableCell>
                      <TableCell align="right">{applicant.birthday}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CompanyApplication;