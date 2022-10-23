import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Container, Box, Button, Typography, Alert, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const Applications = (props) => {
  const { id } = useParams();
  const company = useSelector(state => state.app.company);
  const token = useSelector(state => state.app.token);

  const [applications, setApplications] = useState([]);
  const [apartment, setApartment] = useState({});
  const [message, setMessage] = useState({ error: false, message: ""});

  useEffect(() => {
    console.log(id);
    const getApartment = async () => {
      const response = await fetch(`/api/apartments/${company._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      const data = await response.json();
      console.log(data);
      if(data.message === "success") {
        for(let i = 0; i < data.apartments.length; i++) {
          if(data.apartments[i]._id === id) {
            setApartment(data.apartments[i]);
          }
        }
        setMessage({ error: false, message: ""});
      } else {
        setApplications([]);
        setMessage({ error: true, message: data.message });
      }
    }
    const getApplications = async () => {
      const response = await fetch(`/api/applications/apartment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      const data = await response.json();
      console.log(data);
      if(data.message === "Application found.") {
        setApplications(data.applications);
        setMessage({ error: false, message: ""});
      } else {
        setApplications([]);
        setMessage({ error: true, message: data.message });
      }
    }
    getApplications();
    getApartment();
  }, [id, token, company]);

  return (
    <Container maxWidth="md" component={Paper}>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Kohteen hakemukset
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              {(apartment.address) ? apartment.address + ", " : null} {(apartment.zip) ? apartment.zip + ", " : null} {(apartment.cityArea) ? apartment.cityArea + ", " : null} {(apartment.city) ? apartment.city + ", " : null} {apartment.country}
            </Typography>
          </Grid>
          {message.error &&
            <Grid item xs={12}>
              <Alert severity="error">{message.message}</Alert>
            </Grid>
          }
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt : 2, mb: 2}}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Päähakija</TableCell>
                    <TableCell align="right">Hakijamäärä</TableCell>
                    <TableCell align="right">Tila</TableCell>
                    <TableCell align="right">Toiminnot</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((application) => (
                    <TableRow
                      key={application._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        { application.applicants ? application.applicants[0].name : "Ei hakijaa" }
                      </TableCell>
                      <TableCell align="right">{application.applicantsCount}</TableCell>
                      <TableCell align="right">{application.status}</TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="primary" size="small" sx={{ mr: 1 }}>
                          Hyväksy
                        </Button>
                        <Button variant="contained" color="error" size="small">
                          Hylkää
                        </Button>
                      </TableCell>
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

export default Applications;