import { useNavigate } from 'react-router-dom';
import { Typography, Paper} from '@mui/material';


import Grid from '@mui/material/Unstable_Grid2';

const ApartmentCard = ({ apartment }) => {

  const navigate = useNavigate();

  const onApartmentClick = () => {
    navigate(`/apartments/${apartment._id}`);
  }

  return (
    <Paper sx={{ p: 2, margin: 'auto', maxWidth: 600, flexGrow: 1 }}>
      <Grid container spacing={2}  onClick={onApartmentClick}>
        <Grid item xs={4}  style={{ cursor: 'pointer' }}>
          <Grid item xs={12}>
            <Typography gutterBottom variant="subitle1">
              {apartment.type}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <img src={"/" + apartment.images[0].path} alt={apartment.images[0].name} width="100%" height="100px" />
          </Grid>
        </Grid>
        <Grid item xs={6} container direction="column" spacing={2}  style={{ cursor: 'pointer' }}>
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
          <Grid item xs>
            <Typography variant="body2">
              {apartment.rent} €/kk {apartment.rental}
            </Typography>
            <Typography variant="body2">
              { new Date(apartment.release) < new Date() ? "Vapautuu heti" : "Vapautuu " + new Date(apartment.release).toLocaleDateString("fi-FI") }
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={2} container direction="column" spacing={2} textAlign="right"  style={{ cursor: 'pointer' }}>
          <Grid item xs>
            <Typography variant="subtitle1">{apartment.rooms}</Typography>
            <Typography variant="subtitle1">{apartment.size} m²</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default ApartmentCard;