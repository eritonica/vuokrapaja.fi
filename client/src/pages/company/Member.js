import { useEffect, useState } from 'react';
import { Container, Box, TextField, Button, Modal, Typography, Alert, Select, MenuItem } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setCompany } from '../../appSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Member = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const company = useSelector((state) => state.app.company);
  const [form, setForm] = useState("");
  const [error, setError] = useState('');

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
	}

  const changeMember = async (e) => {

  }

  const deleteMember = async (member) => {
    let response = await fetch("/api/companies/members/" + member._id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    });
    let body = await response.json();
    console.log(body);
    if(body.message === "Member deleted.") {
      let members = await getMembers();
      dispatch(setCompany({...company, members: members}));
      setError("");
    } else {
      setError(body.message);
    }

  }

  useEffect(() => {
    let fetchData = async () => {
      let members = await getMembers();
      dispatch(setCompany({...company, members: members}));
    }
    fetchData();
  }, []);

  useEffect(() => {
    console.log("company members:", company.members);
  }, [company]);

  const addMember = async () => {
    setError("");
    let response = await fetch('/api/companies/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
           username: form.addition,
           company: company._id,
           role: "",
           permissions : "",
        }),
    });
    let body = await response.json();
    return body;
  }

  const getMembers = async () => {
    setError("");
    let response = await fetch('/api/companies/members/' + company._id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    });
    let body = await response.json();
    return body.members;
  }

  const handleAddMember = async (e) => {
    e.preventDefault();
    let res = await addMember();
    if (res.message === 'Member created.') {
      let members = await getMembers();
      dispatch(setCompany({...company, members: members}));
      handleClose();
      
    } else if (res.message === 'Member already exists.') {
      setError('Käyttäjä on jo yrityksen jäsen.');
    } else if (res.message === 'You do not have permission to create members.') {
      setError('Sinulla ei ole oikeutta lisätä jäsentä.');
    } else if (res.message === 'Company not found.') {
      setError("Yritystä ei löytynyt");
    } else if (res.message === "Account does not exist.") {
      setError("Käyttäjää ei löytynyt");
    }
  };

  // username, email, name, role, persmissions, actions
  return (
    <Container maxWidth="md">
      <Box component="form" sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h1" gutterBottom>
              Yrityksen työntekijät
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Lisää työntekijä
            </Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Lisää työntekijä
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Käyttäjätunnus"
                      name="addition"
                      autoComplete="nothing"
                      onChange={onChange}
                    />
                  </Grid>
                  {error && 
                    <Grid item xs={12}>
                      <Alert severity="error">{error}</Alert>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleAddMember}>
                      Lisää
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12} >
            <Typography variant="body1" component="p" gutterBottom>
              Tähän tulee yrityksen työntekijät jotka käyttävät palvelua.
            </Typography>
          </Grid>
        </Grid>
        <TableContainer component={Paper} sx={{mt:2}}>
          <Table sx={{ minWidth: 650 }} aria-label="members">
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="row">
                  Käyttäjätunnus
                </TableCell>
                <TableCell align="right">Sähköposti</TableCell>
                <TableCell align="right">Nimi</TableCell>
                <TableCell align="right">Rooli</TableCell>
                <TableCell align="right">Oikeudet</TableCell>
                <TableCell align="right">Toiminnot</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { (company.members && company.members.length > 0) ? company.members.map((member) => (
                <TableRow key={member._id}>
                  <TableCell component="td" scope="row">
                    {member.username}
                  </TableCell>
                  <TableCell align="right">
                    {member.email}
                  </TableCell>
                  <TableCell align="right">
                    {member.name}
                  </TableCell>
                  <TableCell align="right">
                    {member.role}
                  </TableCell>
                  <TableCell align="right">
                    {member.permissions}
                  </TableCell>
                  <TableCell align="right">
                    <Button fullWidth sx={{mb:1}} variant="contained" color="primary" onClick={changeMember}>
                      Muokkaa
                    </Button>
                    <Button fullWidth variant="contained" color="secondary" onClick={() => { deleteMember(member)} }>
                      Poista
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell component="th" scope="row">
                    Ei jäseniä
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Member;