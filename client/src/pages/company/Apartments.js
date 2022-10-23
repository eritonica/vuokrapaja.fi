import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button, Typography, Alert } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector } from 'react-redux';

const Aparments = () => {
  const token = useSelector(state => state.app.token);
  const company = useSelector(state => state.app.company);
  const profile = useSelector(state => state.app.profile);

  const navigate = useNavigate();

  const [apartments, setApartments] = useState([]);
  const [message, setMessage] = useState({ error: false, message: ""});

  const [sort, setSort] = useState("creation-asc")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pages: 1,
    perPage: 20,
    apartments : [apartments],
  });
  
  const paginateApartments = useCallback(() => {
    console.log("Paginating apartments");
    console.log(apartments);
    const pages = Math.ceil(apartments.length / pagination.perPage)
    let paginatedApartments = []
    for (let i = 0; i < pages; i++) {
      let pageApartments = apartments.slice(i * pagination.perPage, (i + 1) * pagination.perPage)
      paginatedApartments.push(pageApartments);
    }
    if (paginatedApartments.length === 0) {
      console.log("No apartments");
      paginatedApartments = [[]];
    }
    setPagination({
      ...pagination,
      pages: pages,
      apartments: paginatedApartments
    });
    console.log(pagination.apartments);
  }, [pagination, apartments]);

  const sortApartments = useCallback(() => {
    let sortedApartments = [...apartments];
    switch (sort) {
      case "price-asc":
        sortedApartments = apartments.sort((a, b) => a.rent < b.rent)
        break;
      case "price-desc":
        sortedApartments = apartments.sort((a, b) => a.rent > b.rent)
        break;
      case "size-asc":
        sortedApartments = apartments.sort((a, b) => a.size < b.size)
        break;
      case "size-desc":
        sortedApartments = apartments.sort((a, b) => b.size > a.size)
        break;
      case "creation-asc":
        sortedApartments = apartments.sort((a, b) => new Date(a.created) < new Date(b.created))
        break;
      case "creation-desc":
        sortedApartments = apartments.sort((a, b) => new Date(b.created) > new Date(a.created))
        break;
      case "release-asc":
        sortedApartments = apartments.sort((a, b) => new Date(a.release) > new Date(b.release))
        break;
      case "release-desc":
        sortedApartments = apartments.sort((a, b) => new Date(b.release) < new Date(a.release))
        break;
      case "applications-asc":
        sortedApartments = apartments.sort((a, b) => a.applicationsCount < b.applicationsCount)
        break;
      case "applications-desc":
        sortedApartments = apartments.sort((a, b) => a.applicationsCount > b.applicationsCount)
        break;
      default:
        sortedApartments = apartments.sort((a, b) => a.rent - b.rent)
        break;
    }
    paginateApartments(sortedApartments);
  }, [sort, apartments, paginateApartments]);
  
  useEffect(() => {
    if(token === false) {
      navigate("/login");
    }
    if(profile.role === 'Rentee') {
      navigate("/");
    }
    // if company is not set, navigate to company info page
    if(company._id === undefined) {
      navigate("/company");
    }
  }, [navigate, token, profile, company]);

  useEffect(() => {
    const getApartments = async () => {
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
    getApartments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sortApartments, [sort, apartments]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(paginateApartments, [pagination.perPage, apartments]);

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

  const onSortChange = (event) => {
    console.log(event.target.value)
    setSort(event.target.value);
  }

  const onPerPageChange = (event) => {
    setPagination({
      ...pagination,
      perPage: parseInt(event.target.value)
    })
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
          {(message.error === true) && (
            <Grid item xs={12}>
              <Alert severity="error">{message.message}</Alert>
            </Grid>
          )}
          <Grid item xs={12} sm={5} md={5}>
            <FormControl fullWidth>
              <InputLabel id="per-page-label">Kohteita sivulla</InputLabel>
              <Select
                labelId="per-page-label"
                id="per-page"
                name="perPage"
                value={pagination.perPage}
                label="Kohteita sivulla"
                onChange={onPerPageChange}>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="10">10</MenuItem>
                <MenuItem value="20">20</MenuItem>
                <MenuItem value="40">40</MenuItem>
                <MenuItem value="60">60</MenuItem>
                <MenuItem value="80">80</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5} md={5}>
            <FormControl fullWidth>
              <InputLabel id="order-label">Järjestys</InputLabel>
              <Select
                labelId="order-label"
                id="order"
                name="sort"
                value={sort}
                label="Järjestys"
                onChange={onSortChange}>
                <MenuItem value="price-asc">Hinnan mukaan nouseva</MenuItem>
                <MenuItem value="price-desc">Hinnan mukaan laskeva</MenuItem>
                <MenuItem value="release-asc">Vapautumisen mukaan nouseva</MenuItem>
                <MenuItem value="release-desc">Vapautumisen mukaan laskeva</MenuItem>
                <MenuItem value="creation-asc">Luomisen mukaan nouseva</MenuItem>
                <MenuItem value="creation-desc">Luomisen mukaan laskeva</MenuItem>
                <MenuItem value="size-asc">Pinta-alan mukaan nouseva</MenuItem>
                <MenuItem value="size-desc">Pinta-alan mukaan laskeva</MenuItem>
                <MenuItem value="applications-asc">Hakujen määrän mukaan nouseva</MenuItem>
                <MenuItem value="applications-desc">Hakujen määrän mukaan laskeva</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
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
                  { (pagination.apartments !== undefined) && pagination.apartments[pagination.currentPage-1].map((apartment) => (
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
                      <TableCell align="right">{apartment.rent}</TableCell>
                      <TableCell align="right">{apartment.available}</TableCell>
                      <TableCell align="right">
                        <Button fullWidth sx={{marginBottom: "4px"}} variant="contained" color="info" size="small" onClick={() => navigate("/company/apartment", { state : apartment })}>Muokkaa</Button>
                        {(apartment.paid) ? "Julkaistu" : <Button fullWidth variant="contained" color="primary" size="small">Maksa</Button> }
                      </TableCell>
                      <TableCell align="right">
                        <Button fullWidth sx={{marginBottom: "4px"}} variant="contained" color="secondary" size="small" onClick={() => navigate("/company/applications/" + apartment._id)}>Hakemukset {apartment.applicationsCount}</Button>
                        <Button fullWidth variant="contained" color="error" size="small" onClick={() => handleDelete(apartment._id)}>Poista</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item container xs={12} spacing={2} sx={{marginBottom: "25px"}}>
            <Grid item xs={4}>
              <Button fullWidth variant="outlined" disabled={pagination.currentPage === 1} onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}>Edellinen sivu</Button>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" align="center" sx={{marginTop: "8px"}}>
                Sivu {pagination.currentPage} / {pagination.pages}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="outlined" disabled={pagination.currentPage === pagination.pages} onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}>Seuraava sivu</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Aparments