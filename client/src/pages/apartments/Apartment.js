import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Grid, Typography, Paper, Table, TableBody, TableCell, TableRow, Button } from "@mui/material";
import { useSelector } from 'react-redux';
import DocumentMeta from 'react-document-meta';

import ImageList from './ImageList';
import Map from './Map';

/**
 * Apartment Component - A React component that displays detailed information about a single apartment.
 *
 * @component
 * @example
 * return (
 *   <Apartment />
 * );
 *
 * @returns {JSX.Element} A JSX Element representing the Apartment component.
 */
const Apartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [apartment, setApartment] = useState({});
  const token = useSelector(state => state.token);
  let meta = {
    title: '',
    description: "",
    canonical: 'http://vuokrapaja.fi/apartments/',
    meta: {
      charset: 'utf-8',
      name: {
          keywords: 'react,meta,document,html,tags,asunto,vuokra,toimisto,varasto,halli,talli,kerrostalo,omakotitalo,rivitalo,paritalo'
      }
    }
  }

  const [cellWidth, setCellWidth] = useState("50%");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (id === undefined) {
      navigate("/apartments/search");
    } else {
      const fetchApartment = async () => {
        let response = await fetch('/api/search/apartment/' + id, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "token": token
          },
        });
        let body = await response.json();
        if (body.message === "success") {
          // console.log(body.apartment);
          setApartment(body.apartment);
          meta.title = body.apartment.address;
          meta.description = body.apartment.description;
          meta.canonical = meta.canonical + "/" + id;
        }
      }
      fetchApartment();
    }
  }, [id, navigate, token]);
  
  /**
   * Handles the click event when the user wants to apply for the apartment.
   */
  const handleApplicationClick = () => {
    navigate("/application/" + id);
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <DocumentMeta {...meta} />
      <Box sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Typography variant="h3" component="h3" gutterBottom>
              { apartment.address + ", " + apartment.zip + ", " + apartment.city }
            </Typography>
            <Typography variant="h4" component="h4" gutterBottom>
              {apartment.rooms + ", " + apartment.type + ", " + apartment.rent + "€/kk, " + apartment.size + "m²"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            { apartment.images && <ImageList images={apartment.images} /> }
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, margin: 'auto', flexGrow: 1 }}>
              { apartment.address && <Map address={apartment.address + ",+" + apartment.city + ",+" + apartment.country} /> }
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
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell width={cellWidth}><b>Koko</b></TableCell>
                  <TableCell>{apartment.rooms + ", " + apartment.size} m²</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Vapautuminen</b></TableCell>
                  <TableCell>{new Date(apartment.release).toLocaleDateString("fi-FI")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Ilmoitettu</b></TableCell>
                  <TableCell>{new Date(apartment.created).toLocaleDateString("fi-FI")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Asunnon käyttötarkoitus</b></TableCell>
                  <TableCell>{apartment.use}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Asunnon tyyppi</b></TableCell>
                  <TableCell>{apartment.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Kerros</b></TableCell>
                  <TableCell>{apartment.floor}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Keittiön tyyppi</b></TableCell>
                  <TableCell>{apartment.kitchenType}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Asunnon kunto</b></TableCell>
                  <TableCell>{apartment.condition}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Rakennusvuosi</b></TableCell>
                  <TableCell>{apartment.buildingYear}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Kustannukset
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell width={cellWidth}><b>Vuokra</b></TableCell>
                  <TableCell>{apartment.rent} €/kk</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Vakuus</b></TableCell>
                  <TableCell>{(apartment.deposit) ? apartment.deposit.join(", ") : "Ei määritelty."}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Sähkömaksu</b></TableCell>
                  <TableCell>{(apartment.electricitySeperate === true) ? "Oma sopimus" : apartment.electricity + " €/kk"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Vesimaksu</b></TableCell>
                  <TableCell>{(apartment.waterSeperate === true) ? "Vesi kulutuksen mukaan" : apartment.water + " €/kk henkilöä kohden"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Lämmitysmaksu</b></TableCell>
                  <TableCell>{(apartment.heatingSeperate === true) ? "Ei kuulu vuokraan" : "Lämmitys kuuluu vuokraan"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Lämmitysmuoto</b></TableCell>
                  <TableCell>{apartment.heating}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Lisätiedot
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell width={cellWidth}><b>Asunnossa on</b></TableCell>
                  <TableCell>{(apartment.has) && apartment.has.join(", ")}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell width={cellWidth}><b>Asunto sopii</b></TableCell>
                  <TableCell>{(apartment.suitable) && apartment.suitable.join(", ")}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>
              Yhteystiedot
            </Typography>
            <Table size="small">
              <TableBody>
                { apartment.company && 
                  <TableRow>
                    <TableCell width={cellWidth}><b>Yritys</b></TableCell>
                    <TableCell>{apartment.company.name}</TableCell>
                  </TableRow>
                }
                { apartment.location &&
                  <TableRow>
                    <TableCell width={cellWidth}><b>Käyntiosoite</b></TableCell>
                    <TableCell>{apartment.location}</TableCell>
                  </TableRow>
                }
                { apartment.contact &&
                  <TableRow>
                    <TableCell width={cellWidth}><b>Yhteyshenkilö</b></TableCell>
                    <TableCell>{apartment.contact}</TableCell>
                  </TableRow>
                }
                { apartment.phone && 
                  <TableRow>
                    <TableCell width={cellWidth}><b>Puhelinnumero</b></TableCell>
                    <TableCell>{apartment.phone}</TableCell>
                  </TableRow>
                }
                { apartment.email && 
                  <TableRow>
                    <TableCell width={cellWidth}><b>Sähköposti</b></TableCell>
                    <TableCell>{apartment.email}</TableCell>
                  </TableRow>
                }
                { apartment.website &&
                  <TableRow>
                    <TableCell width={cellWidth}><b>Nettisivu</b></TableCell>
                    <TableCell>{apartment.website}</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="primary" onClick={handleApplicationClick}>
              Hae asuntoa
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Apartment