import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material"
import ApartmentCard from "./ApartmentCard"


/**
 * ApartmentListLatest Component - A React component that displays a list of the latest apartments.
 *
 * @component
 * @example
 * return (
 *   <ApartmentListLatest apartments={latestApartmentDataArray} />
 * );
 *
 * @param {Object} props - The component props.
 * @param {Array} props.apartments - An array of the latest apartment objects to display in the list.
 * @returns {JSX.Element} A JSX Element representing the ApartmentListLatest component.
 */
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