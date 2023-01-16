import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Modal, Typography, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setCompany } from '../../appSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 250,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Member = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const company = useSelector((state) => state.app.company);
  const [memberAddForm, setMemberAddForm] = useState("");
  const [memberModForm, setMemberModForm] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if(token === false) {
      navigate("/login");
    }
    if(profile.role === 'Rentee') {
      navigate("/");
    }
    // if company is not set, navigate to company info page
    if(company._id === undefined) {
      navigate("/company");
    }
  }, [navigate, token, profile, company]);

  const [modal, setModal] = useState({
    add: false,
    mod: false,
  });

  const handleOpenMemberAddModal = () => setModal({...modal, add: true});
  const handleCloseMemberAddModal = () => setModal({...modal, add: false});

  const handleOpenMemberModModal = (member) => {
    setMemberModForm({
      ...member
    });
    console.log(memberModForm);
    setModal({...modal, mod: true});
  }

  const handleCloseMemberModModal = () => {
    setModal({...modal, mod: false});
  }

  const onChange = (e) => {
    setMemberAddForm({...memberAddForm, [e.target.name]: e.target.value});
	}

  const onChangeMember = async (e) => {
    setMemberModForm({...memberModForm, [e.target.name]: e.target.value});
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
    if(token !== false) {
      fetchData();
    }
    // Don't know yet how to handle dispatch with useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company._id]);

  const addMember = async () => {
    setError("");
    let response = await fetch('/api/companies/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
           username: memberAddForm.member,
           company: company._id,
           role: "",
           permissions : "",
        }),
    });
    let body = await response.json();
    return body;
  }

  const modMember = async () => {
    setError("");
    let response = await fetch('/api/companies/members/' + memberModForm._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        account: memberModForm.account,
        company: company._id,
        role: memberModForm.role,
        permissions : memberModForm.permissions,
      }),
    });
    let body = await response.json();
    return body;
  }

  const handleMemberAddForm = async (e) => {
    e.preventDefault();
    let res = await addMember();
    if (res.message === 'Member created.') {
      let members = await getMembers();
      dispatch(setCompany({...company, members: members}));
      handleCloseMemberAddModal();
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

  const handleMemberModForm = async (e) => {
    e.preventDefault();
    let res = await modMember();
    if (res.message === 'Member updated.') {
      let members = await getMembers();
      dispatch(setCompany({...company, members: members}));
      handleCloseMemberModModal();
    } else if (res.message === 'Member not found.') {
      setError('Jäsentä ei löytynyt.');
    } else if (res.message === 'You do not have permission to update members.') {
      setError('Sinulla ei ole oikeutta muokata jäsentä.');
    } else if (res.message === 'Company not found.') {
      setError("Yritystä ei löytynyt");
    }
  }

  const translateRole = (role) => {
    if(role === "admin") {
      return "Ylläpitäjä";
    } else if(role === "boss") {
      return "Johtaja";
    } else if(role === "worker") {
      return "Työntekijä";
    } else if(role === "customer") {
      return "Asiakas";
    } else {
      return "Ei roolia";
    }
  }

  const translatePermissions = (permissions) => {
    if(permissions === "read | write | delete") {
      return "Luku, kirjoitus ja poisto";
    } else if(permissions === "read | write") {
      return "Luku ja kirjoitus";
    } else if(permissions === "read") {
      return "Luku";
    } else {
      return "Ei oikeuksia";
    }
  }

  // username, email, name, role, permissions, actions
  return (
    <Container maxWidth="md" component={Paper}>
      <Box component="form" sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>
              Yrityksen työntekijät
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleOpenMemberAddModal}>
              Lisää työntekijä
            </Button>
            <Modal
              open={modal.add}
              onClose={handleCloseMemberAddModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Lisää työntekijä
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Käyttäjätunnus"
                      name="member"
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
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleMemberAddForm}>
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
                    {
                      (member.username) ? member.username : "Ei käyttäjätunnusta"
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      (member.email) ? member.email : "Ei sähköpostia"
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      (member.name) ? member.name : "Ei nimeä"
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      translateRole(member.role)
                    }
                  </TableCell>
                  <TableCell align="right">
                    {
                      translatePermissions(member.permissions)
                    }
                  </TableCell>
                  <TableCell align="right">
                    <Button fullWidth sx={{mb:1}} variant="contained" color="primary" onClick={() => handleOpenMemberModModal(member)}>
                      Muokkaa
                    </Button>
                    <Modal
                      open={modal.mod}
                      onClose={handleCloseMemberModModal}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description">
                      <Box sx={modalStyle} component="form">
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="h6" component="h1" gutterBottom>
                              Valitse työntekijän rooli ja oikeudet
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="select-label">Rooli</InputLabel>
                              <Select
                                fullWidth
                                labelId="select-label"
                                id="role-select"
                                value={memberModForm.role}
                                label="Rooli"
                                name="role"
                                onChange={onChangeMember}>
                                <MenuItem value="boss">Johtaja</MenuItem>
                                <MenuItem value="admin">Ylläpitäjä</MenuItem>
                                <MenuItem value="worker">Työntekijä</MenuItem>
                                <MenuItem value="customer">Asiakas</MenuItem>
                                <MenuItem value="">Ei mikään</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="select-label">Oikeudet</InputLabel>
                              <Select
                                fullWidth
                                labelId="select-label"
                                id="permissions-select"
                                value={memberModForm.permissions}
                                label="Oikeudet"
                                name="permissions"
                                onChange={onChangeMember}>
                                <MenuItem value="read | write | delete">Luku/Kirjoitus/Poisto</MenuItem>
                                <MenuItem value="read | write">Luku/Kirjoitus</MenuItem>
                                <MenuItem value="read">Luku</MenuItem>
                                <MenuItem value="">Ei mitään</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12}>
                            <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleMemberModForm}>
                              Tallenna
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
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