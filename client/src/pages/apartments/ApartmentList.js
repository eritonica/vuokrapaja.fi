import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import ApartmentCard from "./ApartmentCard"

const ApartmentList = ({apartments}) => {
  const [sorting, setSorting] = useState("price-asc");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pages: 1,
    perPage: 5,
    apartments: apartments
  });

  const apartmentsChanged = useCallback(() => {
    let sortedApartments = [...apartments];
    switch (sorting) {
      case "price-asc":
        sortedApartments = apartments.sort((a, b) => a.rent - b.rent);
        break;
      case "price-desc":
        sortedApartments = apartments.sort((a, b) => a.rent - b.rent);
        sortedApartments = sortedApartments.reverse();
        break;
      case "size-asc":
        sortedApartments = apartments.sort((a, b) => a.size - b.size);
        break;
      case "size-desc":
        sortedApartments = apartments.sort((a, b) => b.size - a.size);
        sortedApartments = sortedApartments.reverse();
        break;
      case "creation-asc":
        sortedApartments = apartments.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
        break;
      case "creation-desc":
        sortedApartments = apartments.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        sortedApartments = sortedApartments.reverse();
        break;
      case "release-asc":
        sortedApartments = apartments.sort((a, b) => new Date(a.release).getTime() - new Date(b.release).getTime());
        break;
      case "release-desc":
        sortedApartments = apartments.sort((a, b) => new Date(a.release).getTime() - new Date(b.release).getTime());
        sortedApartments = sortedApartments.reverse();
        break;
      default:
        sortedApartments = apartments.sort((a, b) => a.rent - b.rent);
        break;
    }
    const pages = Math.ceil(sortedApartments.length / pagination.perPage)
    let paginatedApartments = []
    for(let i = 0; i < pages; i++) {
      let pagesStart = pagination.currentPage * pagination.perPage - pagination.perPage;
      let pagesEnd = pagination.currentPage * pagination.perPage;
      console.log(pagesStart + " - " + pagesEnd);
      paginatedApartments = sortedApartments.slice(pagesStart, pagesEnd)
      
    }
    setPagination({
      ...pagination,
      pages: pages,
      apartments: paginatedApartments
    });

  }, [apartments, pagination, sorting])

  useEffect(apartmentsChanged, [apartments, pagination.perPage, pagination.currentPage, sorting]);

  const onSortChange = (event) => {
    console.log("Sort changed");
    setSorting(event.target.value);
  }

  const onPerPageChange = (event) => {
    setPagination({
      ...pagination,
      perPage: parseInt(event.target.value)
    })
  }

  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Löydetyt kohteet
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Typography variant="body2" align="center"  sx={{marginTop: "20px"}}>
            Kohteita {apartments.length}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={5} md={5}>
          <FormControl fullWidth>
            <InputLabel id="order-label">Järjestys</InputLabel>
            <Select
              labelId="order-label"
              id="order"
              name="sort"
              value={sorting}
              label="Järjestys"
              onChange={onSortChange}>
              <MenuItem value="price-asc">Hinnan mukaan nouseva</MenuItem>
              <MenuItem value="price-desc">Hinnan mukaan laskeva</MenuItem>
              <MenuItem value="release-asc">Vapautumisen mukaan nouseva</MenuItem>
              <MenuItem value="creation-asc">Luomisen mukaan nouseva</MenuItem>
              <MenuItem value="creation-desc">Luomisen mukaan laskeva</MenuItem>
              <MenuItem value="size-asc">Pinta-alan mukaan nouseva</MenuItem>
              <MenuItem value="size-desc">Pinta-alan mukaan laskeva</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="60">60</MenuItem>
              <MenuItem value="80">80</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {pagination.apartments.map((apartment) => (
          <Grid item xs={12} sm={6} md={6} key={apartment._id}>
            <ApartmentCard apartment={apartment} />
          </Grid>
        ))}
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
  )
}

export default ApartmentList