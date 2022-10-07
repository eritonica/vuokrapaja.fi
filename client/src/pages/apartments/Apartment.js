import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Grid, Typography, Paper, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { useSelector } from 'react-redux';

import ImageList from './ImageList';
import Map from './Map';

const Apartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [apartment, setApartment] = useState({});
  const token = useSelector(state => state.token);

  useEffect(() => {
    if (id === undefined) {
      navigate("/apartments/search");
    } else {
      const fetchApartment = async () => {
        let response = await fetch('/api/search/apartment/' + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
        });
        let body = await response.json();
        if (body.message === "success") {
          console.log(body.apartment);
          setApartment(body.apartment);

        }
      }
      fetchApartment();
    }
  }, [id, navigate, token]);

  return (
    <Container maxWidth="md" component={Paper}>
      <Box sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              {apartment.rooms + ", " + apartment.type + ", " + apartment.rent + "€/kk, " + apartment.size + "m²"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            { apartment.images && <ImageList images={apartment.images} /> }
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
              <Map address={apartment.address + ", " + apartment.city + ", " + apartment.country} />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Esittely
            </Typography>
            <Typography variant="body1" gutterBottom>
              {apartment.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Perustiedot
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell><b>Koko</b></TableCell>
                  <TableCell>{apartment.size} m²</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Hinta</b></TableCell>
                  <TableCell>{apartment.rent} €/kk</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Asunnon tyyppi</b></TableCell>
                  <TableCell>{apartment.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Asunnon kunto</b></TableCell>
                  <TableCell>{apartment.condition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><b>Asunnon huoneet</b></TableCell>
                  <TableCell>{apartment.rooms}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Rakennusvuosi
            </Typography>
            <Typography variant="body1" gutterBottom>
              {apartment.buildingYear}
            </Typography>
          </Grid>

        </Grid>
      </Box>
    </Container>
  )
}

export default Apartment