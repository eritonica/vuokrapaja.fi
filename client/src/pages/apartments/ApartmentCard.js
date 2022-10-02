import { Container, Box, TextField, Button, Typography, Paper, Autocomplete, FormControlLabel, Alert } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

const ApartmentCard = ({ apartment }) => {
  console.log(apartment);
  return (
    <Paper sx={{ p: 2, margin: 'auto', maxWidth: 600, flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item>
          <img src={apartment.images[0].path} alt={apartment.images[0].name} width="100%" />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1">
                {apartment.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {apartment.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {apartment.cityArea} {apartment.city}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" style={{ cursor: 'pointer' }}>
                {apartment.rent} €/kk {apartment.rental}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{apartment.rooms}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">{apartment.size} m²</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ApartmentCard;