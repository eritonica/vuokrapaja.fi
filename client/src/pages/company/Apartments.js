import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, Alert } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector } from 'react-redux';

const Aparments = () => {
  const token = useSelector(state => state.app.token);
  const company = useSelector(state => state.app.company);
  const profile = useSelector(state => state.app.profile);

  const navigate = useNavigate();

  const [apartments, setApartments] = useState([]);
  const [message, setMessage] = useState({ error: false, message: ""});

  useEffect(() => {
    if(token === false) {
      navigate("/login");
    }
    if(profile.role === 'Rentee') {
      navigate("/");
    }
    // if company is not set, navigate to company info page
    console.log("We should go to company info page");
    if(company._id === undefined) {
      console.log("NOW!");
      navigate("/company");
    }
  }, [navigate, token, profile, company]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/apartments/${company._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      console.log(response);
      const data = await response.json();
      if(data.message === "success") {
        setApartments(data.apartments);
      } else {
        setMessage({ error: true, message: data.message });
      }
    }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const response = await fetch(`/api/apartments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      }
    });
    const data = await response.json();
    if(data.message === "Apartment deleted.") {
      setApartments(apartments.filter(apartment => apartment._id !== id));
      setMessage({ error: true, message: "Ilmoitus poistettu."})
    } else {
      setMessage({ error: true, message: data.message });
    }
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <Box component="form" sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Yrityksen ilmoitukset
            </Typography>
          </Grid>
        </Grid>
        {(message.error === true) && (
          <Grid item xs={12}>
            <Alert severity="error">{message.message}</Alert>
          </Grid>
        )}    
        <TableContainer component={Paper} sx={{ mt : 2}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Osoite</TableCell>
                <TableCell align="right">Huoneet</TableCell>
                <TableCell align="right">Koko</TableCell>
                <TableCell align="right">Hinta</TableCell>
                <TableCell align="right">Vapautuu</TableCell>
                <TableCell align="right">Julkaistu</TableCell>
                <TableCell align="right">Toiminnot</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apartments.map((apartment) => (
                <TableRow
                  key={apartment._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Button variant="text" color="info" size="small" onClick={() => navigate("/company/apartment", { state : apartment })}>
                      {(apartment.address) ? apartment.address + ", " : null} {(apartment.zip) ? apartment.zip + ", " : null} {(apartment.cityArea) ? apartment.cityArea + ", " : null} {(apartment.city) ? apartment.city + ", " : null} {apartment.country}
                    </Button>
                  </TableCell>
                  <TableCell align="right">{apartment.rooms}</TableCell>
                  <TableCell align="right">{apartment.size}</TableCell>
                  <TableCell align="right">{apartment.price}</TableCell>
                  <TableCell align="right">{apartment.available}</TableCell>
                  <TableCell align="right">{(apartment.paid) ? "Julkaistu" : <Button variant="contained" color="primary" size="small">Maksa</Button> }</TableCell>
                  <TableCell align="right">
                    <Button variant="contained" color="error" size="small" onClick={() => handleDelete(apartment._id)}>
                      Poista
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> 
      </Box>
    </Container>
  );
}

export default Aparments