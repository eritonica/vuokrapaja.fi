import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import ApartmentCard from "./ApartmentCard"

const ApartmentListLatest = ({apartments}) => {
  
  return (
    <Box mt={2}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            Uusimmat kohteet
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" align="center"  sx={{marginTop: "20px"}}>
            Kohteita {apartments.length}
          </Typography>
        </Grid>
        {apartments.map((apartment) => (
          <Grid item xs={12} sm={6} md={6} key={apartment._id}>
            <ApartmentCard apartment={apartment} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default ApartmentListLatest