import { useState, useEffect } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import ApartmentCard from "./ApartmentCard"

const ApartmentList = ({apartments}) => {
  const [sort, setSort] = useState("price-asc")
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pages: 1,
    perPage: 20,
    apartments : [apartments],
  });

  const sortApartments = (apartments) => {
    switch (sort) {
      case "price-asc":
        return apartments.sort((a, b) => a.rent < b.rent)
      case "price-desc":
        return apartments.sort((a, b) => a.rent > b.rent)
      case "size-asc":
        return apartments.sort((a, b) => a.size < b.size)
      case "size-desc":
        return apartments.sort((a, b) => b.size > a.size)
      case "creation-asc":
        return apartments.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt))
      case "creation-desc":
        return apartments.sort((a, b) => new Date(b.createdAt) > new Date(a.createdAt))
      case "release-asc":
        return apartments.sort((a, b) => new Date(a.release) > new Date(b.release))
      default:
        return apartments.sort((a, b) => a.rent - b.rent)
    }
  }

  const paginateApartments = (apartments) => {
    const pages = Math.ceil(apartments.length / pagination.perPage)
    const paginatedApartments = []
    for(let i = 0; i < pages; i++) {
      let pageApartments = apartments.slice(i * pagination.perPage, (i + 1) * pagination.perPage)
      paginatedApartments.push(pageApartments);
    }
    setPagination({
      ...pagination,
      pages: pages,
      apartments: paginatedApartments
    })
  }

  useEffect(() => {
    console.count("UseEffect Pagination update")
    apartments = sortApartments(apartments);
    paginateApartments(apartments);
  }, [pagination.perPage]);

  useEffect(() => {
    console.count("UseEffect Sort update")
    apartments = sortApartments(apartments);
    paginateApartments(apartments); 
  }, [sort]);

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
              value={sort}
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
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="40">40</MenuItem>
              <MenuItem value="60">60</MenuItem>
              <MenuItem value="80">80</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {pagination.apartments[pagination.currentPage-1].map((apartment) => (
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