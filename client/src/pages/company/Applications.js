import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Container, Box, Button, Typography, Alert, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';


import { useDispatch, useSelector } from 'react-redux';
import { setCompany } from '../../appSlice';


const Applications = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const company = useSelector(state => state.app.company);
  const token = useSelector(state => state.app.token);
  const [applications, setApplications] = useState([]);
  const [apartment, setApartment] = useState({});
  const [message, setMessage] = useState({ error: false, message: ""});
  const [sort, setSort] = useState("creation-asc")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pages: 1,
    perPage: 20,
    applications : [applications],
  });

  /**
   * Paginates the applications.
   * @function
   */
  const paginateApplications = useCallback(() => {
    const pages = Math.ceil(applications.length / pagination.perPage)
    let paginatedApplications = []
    for(let i = 0; i < pages; i++) {
      let pageApplications = applications.slice(i * pagination.perPage, (i + 1) * pagination.perPage)
      paginatedApplications.push(pageApplications);
    }
    setPagination({
      ...pagination,
      pages: pages,
      applications: paginatedApplications
    });
    // console.log("Paginating applications");
  }, [pagination, applications]);

  /**
   * Sorts the applications based on the selected sorting option.
   * @function
   */
  const sortApplications = useCallback(() => {
    let sortedApplications = [...applications];
    switch (sort) {
      case "applicants-asc":
        sortedApplications = applications.sort((a, b) => a.applicantsCount - b.applicantsCount);
        break;
      case "applicants-desc":
        sortedApplications = applications.sort((a, b) => a.applicantsCount - b.applicantsCount);
        sortApplications = sortApplications.reverse();
        break;
      case "creation-asc":
        sortedApplications = applications.sort((a, b) => new Date(a.created) - new Date(b.created));
        break;
      case "creation-desc":
        sortedApplications = applications.sort((a, b) => new Date(a.created) - new Date(b.created));
        sortApplications = sortApplications.reverse();
        break;
      default:
        sortedApplications = applications.sort((a, b) => a.applicantsCount - b.applicantsCount);
        break;
    }
    paginateApplications(sortedApplications);
  }, [sort, applications, paginateApplications]);
  

  useEffect(() => {
    // console.log(id);
    const getApartment = async () => {
      const response = await fetch(`/api/apartments/company/${company._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      const data = await response.json();
      // console.log(data);
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
      // console.log("Applications applicants", data);
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(sortApplications, [sort, applications]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(paginateApplications, [pagination.perPage, applications]);

  /**
   * Handles the change of sorting option.
   * @function
   * @param {Event} event - The event object representing the change event.
   */
  const onSortChange = (event) => {
    // console.log(event.target.value)
    setSort(event.target.value);
  }

  /**
   * Handles the change of applications per page.
   * @function
   * @param {Event} event - The event object representing the change event.
   */
  const onPerPageChange = (event) => {
    setPagination({
      ...pagination,
      perPage: parseInt(event.target.value)
    })
  }

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
          <Grid item xs={12} sm={5} md={5}>
            <FormControl fullWidth>
              <InputLabel id="per-page-label">Hakemuksia sivulla</InputLabel>
              <Select
                labelId="per-page-label"
                id="per-page"
                name="perPage"
                value={pagination.perPage}
                label="Hakemuksia sivulla"
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
                <MenuItem value="creation-asc">Hakemusajan mukaan nouseva</MenuItem>
                <MenuItem value="creation-desc">Hakemusajan mukaan laskeva</MenuItem>
                <MenuItem value="applicants-asc">Hakijoiden määrän mukaan nouseva</MenuItem>
                <MenuItem value="applicants-desc">Hakijoiden määrän mukaan laskeva</MenuItem>
              </Select>
            </FormControl>
          </Grid>
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
                  { (pagination.applications.length > 0) && pagination.applications[pagination.currentPage - 1].map((application) => (
                    <TableRow
                      key={application._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        { (application.applicants[0] === undefined) ? "Ei hakijaa" : application.applicants[0].name }
                      </TableCell>
                      <TableCell align="right">{application.applicantsCount}</TableCell>
                      <TableCell align="right">
                        {
                          (application.status === "pending") ? "Käsittelyssä" : 
                          (application.status === "accepted") ? "Hyväksytty" :
                          (application.status === "rejected") ? "Hylätty" :
                          (application.status === "cancelled") ? "Peruttu" :
                          (application.status === "waiting") ? "Odottaa" :
                          "Tuntematon"
                        }
                      </TableCell>
                      <TableCell align="right">
                        <Button fullWidth sx={{marginBottom: "4px"}} variant="contained" color="secondary" size="small" onClick={() => navigate("/company/application/" + application._id)}>Näytä</Button>
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
};

export default Applications;