import { useSelector } from "react-redux";
import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Container, Box, Button, Typography, Alert, Grid } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';


const CompanyApplication = (props) => {
  const { id } = useParams();
  const company = useSelector(state => state.app.company);
  const token = useSelector(state => state.app.token);
  const [application, setApplication] = useState({});
  const [message, setMessage] = useState({ error: false, message: ""});

  const fetchApplication = useCallback(() => {
    const fetchApplication = async () => {
      const response = await fetch(`/api/applications/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "token": token,
        }
      });
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        setMessage({ error: true, message: responseData.message });
      } else {
        console.log(responseData.application.creator);
        setApplication(responseData.application);
      }
    }
    fetchApplication();
  }, [id, token]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchApplication, [fetchApplication]);

  const handleReject = async () => {
    const response = await fetch(`/api/applications/reject/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      }
    });
    const responseData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      setMessage({ error: true, message: responseData.message });
    } else {
      setMessage({ error: false, message: responseData.message });
    }
  }

  const handleAccept = async () => {
    const response = await fetch(`/api/applications/accept/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "token": token,
      }
    });
    const responseData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      setMessage({ error: true, message: responseData.message });
    } else {
      setMessage({ error: false, message: responseData.message });
    }
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <Box sx={{ my: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            { application && (
              (application.status === "pending") 
              ? <Typography variant="h4" color="primary"  component="h1" gutterBottom>
                 Hakemus käsiteltävänä
                </Typography>
              : (application.status === "accepted") 
              ? <Typography variant="h4" color="success" component="h1" gutterBottom>
                 Hakemus hyväksytty
                </Typography>
              : (application.status === "rejected") 
              ? <Typography variant="h4" color="error" component="h1" gutterBottom>
                  Hakemus hylätty
                </Typography>
              : (application.status === "cancelled") 
              ? <Typography variant="h4" color="warning" component="h1" gutterBottom>
                  Hakemus peruttu
                </Typography>
              : (application.status === "waiting")
              ? <Typography variant="h4" color="info" component="h1" gutterBottom>
                  Hakemus odottaa
                </Typography>
              : <Typography variant="h4" color="secondary" component="h1" gutterBottom>
                  Hakemus
                </Typography>
            )}
          </Grid>
          {message.error && 
            <Grid item xs={12}>
              <Alert severity="error">{message.message}</Alert>
            </Grid>
          }
          <Grid item xs={12} component={Paper}>
            <Typography variant="h5" component="h2" gutterBottom>
              Hakijat
            </Typography>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="Hakijat">
                <TableHead>
                  <TableRow>
                    <TableCell>Nimi</TableCell>
                    <TableCell align="right">Syntymäpäivä</TableCell>
                    <TableCell align="right">Puhelinnumero</TableCell>
                    <TableCell align="right">Sähköposti</TableCell>
                    <TableCell align="right">Työpaikka</TableCell>
                    <TableCell align="right">Tulot (€)</TableCell>
                    <TableCell align="right">Tupakointi</TableCell>
                    <TableCell align="right">Luottotiedot</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {application && application.applicants && application.applicants.map((applicant) => (
                    <TableRow
                      key={applicant._id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {applicant.name}
                      </TableCell>
                      <TableCell align="right">{applicant.birthday}</TableCell>
                      <TableCell align="right">{applicant.phone}</TableCell>
                      <TableCell align="right">{applicant.email}</TableCell>
                      <TableCell align="right">{applicant.workplace}</TableCell>
                      <TableCell align="right">{applicant.monthlyIncome}</TableCell>
                      <TableCell align="right">{applicant.smoking}</TableCell>
                      <TableCell align="right">
                      { (applicant.credits === "bad") ? "Merkintä" : (applicant.credits === "good") ? "Ei merkintää" : "Ei tietoa" }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{mt: 2, mb: 2}}  component={Paper}>
            <Typography variant="h5" component="h2" gutterBottom>
              Yhteenveto
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Haluttu sopimuksen aloitus päivä " secondary={application.desiredStart} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Haluttu sopimuksen lopetus päivä" secondary={application.desiredStop} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Sopiva vakuus" secondary={(application.deposit === undefined) ? "" : application.deposit.join(", ")} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Lemmikkieläimet" secondary={application.pets} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Syy muutton" secondary={application.reason} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Lisätietoja luottotiedoista" secondary={application.creditDescription} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Lisätietoja vuokranantajalle" secondary={application.description} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Nähnyt kohteen" secondary={
                  (application.visitation === "notSeen") ? "Ei, ei tarvetta nähdä kohdetta." : 
                  (application.visitation === "seen") ? "Kyllä olemme nähneet kohteen." : 
                  (application.visitation === "wantToSee") ? "Ei, haluamme nähdä kohteen ennen sopimuksen allekirjoitusta." : "Ei tietoa"
                }/>
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={2}></Grid>
          { application && (application.status === "pending" && application.creator !== undefined) && (
            <Grid item xs={8}>
              <Button fullWidth variant="contained" color="primary">Pyydä hakijoiden henkilötunnuksia luottotietojen tarkistukseen</Button>
            </Grid>
          )}
          <Grid item xs={2}></Grid>
          { application && (application.status !== "accepted" && application.status !== "rejected" && application.status !== "cancelled") && (
            <Grid item xs={12} sx={{mt: 2, mb: 2, pb: 2}}  component={Paper}>
              <Typography variant="h5" component="h2" gutterBottom>
                Hyväksy tai hylkää hakemus
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" color="success" onClick={handleAccept}>Hyväksy</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained" color="error" onClick={handleReject}>Hylkää</Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default CompanyApplication;