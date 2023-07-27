import { useEffect, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert, Typography, Avatar} from '@mui/material';
import { FormControl, Modal, InputLabel, Select, MenuItem, Paper, Tooltip } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Grid from '@mui/material/Unstable_Grid2';

import FileUploader from '../components/FileUploader.js';

import { useSelector, useDispatch } from 'react-redux';
import { setProfile, setCompany } from '../appSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

/**
 * Represents the Profile component for displaying and updating user profile information.
 * @function
 * @param {Object} props - The component's props.
 * @returns {JSX.Element} The JSX element containing the Profile component.
 */
const Profile = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const profile = useSelector((state) => state.app.profile);
  const company = useSelector((state) => state.app.company);
  const [message, setMessage] = useState(false);
  const [passwordForm, setPasswordForm] = useState(false);
  const [modal, setModal] = useState({ username: false, password: false, email: false, avatar: false});

  useEffect(() => {
    let getData = async () => {
      // Get Profile from server
      let result = await fetch("/api/profiles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
      });
      let prof = await result.json();
      // console.log("Logging profile");
      // console.log(prof);
      if(!prof.message) {
        dispatch(setProfile({
          ...prof,
          new: false,
        }));
      } else if(prof.message === "Unauthorized") {
        navigate("/");
      }
    }
    if(token !== false) {
      getData();
    }
    // Don't know yet how to handle dispatch with useEffect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  /**
   * Handles opening the specified modal.
   * @param {string} which - The type of modal to open.
   */
  const handleOpenModal = (which) => {
    setMessage(false);
    setModal({ ...modal, [which]: true });
  }

  /**
   * Handles closing the specified modal.
   * @param {string} which - The type of modal to close.
   */
  const handleCloseModal = (which) => {
    setMessage(false);
    setModal({ ...modal, [which]: false });
  }

  /**
   * Handles opening the username modal.
   */
  const handleOpenUsernameModal = () => {
    handleOpenModal("username");
  }

  /**
   * Handles closing the username modal.
   */
  const handleCloseUsernameModal = () => {
    handleCloseModal("username");
  };

  /**
   * Handles opening the email modal.
   */
  const handleOpenEmailModal = () => {
    handleOpenModal("email");
  }

  /**
   * Handles closing the email modal.
   */
  const handleCloseEmailModal = () => {
    handleCloseModal("email");
  };

  /**
   * Handles opening the password modal.
   */
  const handleOpenPasswordModal = () => {
    handleOpenModal("password");
  }

  /**
   * Handles closing the password modal.
   */
  const handleClosePasswordModal = () => {
    handleCloseModal("password");
  };
  const handleOpenAvatarModal = () => {
    handleOpenModal("avatar");
  }
  const handleCloseAvatarModal = () => {
    handleCloseModal("avatar");
  };


  /**
   * Handles changes in the profile form input fields.
   * @param {Event} e - The input field change event.
   */
  const onProfileFormChange = (e) => {
    setMessage(false);
    dispatch(setProfile({ ...profile, [e.target.name]: e.target.value }));
  };


  /**
   * Handles changes in the password form input fields.
   * @param {Event} e - The input field change event.
   */
  const onPasswordFormChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  }

  /**
   * Handles changes in the username form input fields.
   * @param {Event} e - The input field change event.
   */
  const onUsernameFormChange = (e) => {
    setMessage(false);
    dispatch(setProfile({ ...profile, [e.target.name]: e.target.value }));
  };

  /**
   * Handles changes in the email form input fields.
   * @param {Event} e - The input field change event.
   */
  const onEmailFormChange = (e) => {
    setMessage(false);
    dispatch(setProfile({ ...profile, [e.target.name]: e.target.value }));
  };

  /**
   * Updates the user profile on the server.
   * @param {Object} profile - The updated user profile data.
   */
  const updateProfile = async (profile) => {
    if(profile.new === true) {
      let result = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
        body: JSON.stringify(profile),
      });
      let body = await result.json();
      // console.log(body);
      if(body.message === "Profile created.") {
        setMessage({ success: "Uusi profiili luotu sinulle."});
      } else {
        setMessage({ error :"Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen." });
      }
    } else if(profile.new === false) {
      let result = await fetch("/api/profiles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "token": token
        },
        body: JSON.stringify(profile),
      });
      let body = await result.json();
      // console.log(body);
      if(body.message === "Profile updated.") {
        setMessage({ success :"Profiilisi päivitetty."});
      } else {
        setMessage({ error :"Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen."});
      }
    }
  }

  /**
   * Handles the profile form submit event.
   * @async
   * @param {Event} e - The form submit event.
   */
  const handleProfileFormSubmit = async (e) => {
    if(e) e.preventDefault();
    updateProfile(profile);
  }

  /**
   * Updates the user account on the server.
   * @param {Object} data - The updated account data.
   * @returns {Object} The response data from the server.
   */
  const updateAccount = async (data) => {
    let result = await fetch("/api/profiles", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "token": token
      },
      body: JSON.stringify(profile),
    });
    let body = await result.json();
    // console.log(body);
    return body;
  }

  /**
   * Handles the password form submit event.
   * @async
   * @param {Event} e - The form submit event.
   */
  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault();
    if(passwordForm.new.length < 8) {
      setMessage({ error : "Salasanan tarvitsee olla vähintään 8 merkkiä pitkä."});
      return;
    }
    if(/\d/.test(passwordForm.new) === false) {
      setMessage({ error : "Salasanan tarvitsee sisältää vähintään yksi numero."});
      return;
    }
    if(passwordForm.new !== passwordForm.confirm) {
      setMessage({ error : "Salasanat eivät vastaa toisiaan."});
      return;
    }
    let data = {
      username: profile.username,
      email: profile.remail,
      password: passwordForm.new,
    }
    let result = await updateAccount(data);
    if(result.message === "Profile updated.") {
      setMessage({ success :"Salasanasi päivitetty. Sulje ikkuna tästä."});
    } else {
      setMessage({ error :"Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen."});
    }
  }

  /**
   * Handles the username form submit event.
   * @async
   * @param {Event} e - The form submit event.
   */
  const handleUsernameFormSubmit = async (e) => {
    e.preventDefault();
    let data = {
      username: profile.username,
    }
    let result = await updateAccount(data);
    if(result.message === "Profile updated.") {
      setMessage({ success :"Käyttäjätunnuksesi päivitetty. Sulje ikkuna tästä."});
    } else {
      setMessage({ error :"Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen."});
    }
  }

  /**
   * Handles the email form submit event.
   * @async
   * @param {Event} e - The form submit event.
   */
  const handleEmailFormSubmit = async (e) => {
    e.preventDefault();
    let data = {
      email: profile.remail,
    }
    let result = await updateAccount(data);
    if(result.message === "Profile updated.") {
      setMessage({ success :"Sähköpostisi päivitetty. Sulje ikkuna tästä."});
    } else {
      setMessage({ error :"Odottamaton virhe tapahtui, yritä hetken kuluttua uudelleen."});
    }
  }

  /**
   * Handles the avatar form submit event.
   * @param {Object} data - The avatar data from the FileUploader component.
   */
  const handleAvatarFormSubmit = async (data) => {
    // console.log(data);
    if(profile.avatar) {
      await fetch("/api/files", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "token": token,
        },
        body: JSON.stringify({
          filename: profile.avatar
        })
      });
    }
    dispatch(setProfile({ ...profile, avatar: data.file.path }));
    handleCloseAvatarModal();
    updateProfile({
      ...profile,
      avatar: data.file.path
    })
  }

  return (
    <Container maxWidth="md" component={Paper}>
      <Box component={'form'} onSubmit={handleProfileFormSubmit} sx={{ mt: 4, pb: 4, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>Profiili</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}  sx={{ height: "220px", width: "220px", marginRight: "30px", marginBottom: "30px"}}>
            <Tooltip title="Vaihda profiilikuvaa">
                <Avatar alt={profile.username} src={profile.avatar} onClick={handleOpenAvatarModal} sx={{ height: "220px", width: "220px"}}/>
            </Tooltip>
            <Modal
              open={modal.avatar}
              onClose={handleCloseAvatarModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
                <Box sx={modalStyle}>
                  <FileUploader fileUploadCallback={handleAvatarFormSubmit} />
                </Box>
            </Modal>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h6" component="h2" gutterBottom>{profile.name}</Typography>
            <Typography variant="body1" component="p" gutterBottom>
              {profile.description}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Käyttäjätiedot</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth disabled label="Käyttäjätunnus" name="username" value={profile.username} onChange={onProfileFormChange} />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth sx={{p:1.9}} variant="contained" color="primary" onClick={handleOpenUsernameModal}>Vaihda käyttäjätunnus</Button>
            <Modal
              open={modal.username}
              onClose={handleCloseUsernameModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Valitse uusi käyttäjätunnus
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Käyttäjätunnus"
                      name="username"
                      autoComplete="nothing"
                      onChange={onUsernameFormChange}
                    />
                  </Grid>
                  {message.error && 
                    <Grid item xs={12}>
                      <Alert severity="error">{message.error}</Alert>
                    </Grid>
                  }
                  {message.success && 
                    <Grid item xs={12}>
                      <Alert severity="success" onClick={handleCloseUsernameModal}>{message.success}</Alert>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleUsernameFormSubmit}>
                      Tallenna
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth disabled label="Sähköposti" name="email" value={ profile.remail } onChange={onProfileFormChange} />
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth sx={{p:1.9}} variant="contained" color="primary" onClick={handleOpenEmailModal}>Vaihda sähköposti</Button>
            <Modal
              open={modal.email}
              onClose={handleCloseEmailModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Valitse uusi sähköpostiosoite
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="email"
                      label="Sähköposti"
                      name="remail"
                      autoComplete="nothing"
                      onChange={onEmailFormChange}
                    />
                  </Grid>
                  {message.error && 
                    <Grid item xs={12}>
                      <Alert severity="error">{message.error}</Alert>
                    </Grid>
                  }
                  {message.success && 
                    <Grid item xs={12}>
                      <Alert severity="success" onClick={handleCloseEmailModal}>{message.success}</Alert>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handleEmailFormSubmit}>
                      Tallenna
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth variant="contained" color="warning" onClick={handleOpenPasswordModal}>Vaihda salasana</Button>
            <Modal
              open={modal.password}
              onClose={handleClosePasswordModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box sx={modalStyle} component="form">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" component="h1" gutterBottom>
                      Valitse uusi salasana
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Salasana"
                      name="new"
                      autoComplete="nothing"
                      onChange={onPasswordFormChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Salasana varmistus"
                      name="confirm"
                      autoComplete="nothing"
                      onChange={onPasswordFormChange}
                    />
                  </Grid>
                  {message.error && 
                    <Grid item xs={12}>
                      <Alert severity="error">{message.error}</Alert>
                    </Grid>
                  }
                  {message.success && 
                    <Grid item xs={12}>
                      <Alert severity="success" onClick={handleClosePasswordModal}>{message.success}</Alert>
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Button fullWidth type="submit" variant="contained" color="primary" onClick={handlePasswordFormSubmit}>
                      Tallenna
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Modal>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Tiedot sinusta</Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="type-label">Tyyppi *</InputLabel>
              <Select
                required
                labelId="type-label"
                name="type"
                value={profile.type}
                onChange={onProfileFormChange}
                label="Tyyppi *">
                <MenuItem value={"Rentee"}>Vuokralainen</MenuItem>
                <MenuItem value={"Renter"}>Vuokranantaja</MenuItem>
                <MenuItem value={"Broker"}>Kiinteistönvälittäjä</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Nimi" name="name" value={profile.name} onChange={onProfileFormChange} helperText="Sinun etu ja sukunimesi." />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline label="Kuvaus" rows={4} name="description" value={profile.description} onChange={onProfileFormChange} placeholder="Sinun profiilisi kuvaus. Kerro itsestäsi." />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Ammatti" name="profession" value={profile.profession} onChange={onProfileFormChange} />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Syntymäpäivä"
                value={profile.birthday}
                onChange={(newValue) => {
                  dispatch(setProfile({...profile, birthday: newValue }));
                }}
                renderInput={(params) => <TextField {...params} fullWidth helperText={params?.inputProps?.placeholder} />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Yhteystiedot</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotiosoite" name="address" value={profile.address} onChange={onProfileFormChange} helperText="Mäkiläisenkuja 2, 25230 Kartano" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Puhelinnumero" name="phone" value={profile.phone} onChange={onProfileFormChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Julkinen sähköposti" name="email" value={profile.email} onChange={onProfileFormChange} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={4}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h2" gutterBottom>Muut tiedot:</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Kotisivu" name="website" value={profile.website} onChange={onProfileFormChange} />
          </Grid>
        </Grid>
        <Grid container spacing={2} mt={1} mb={4}>
          { message.error && ( 
            <Grid item xs={12}>
              <Alert severity="error">{message.error}</Alert>
            </Grid>
          )}
          { message.success && (
            <Grid item xs={12}>
              <Alert severity="success">{message.success}</Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth> Tallenna </Button>
          </Grid>
          { profile.type !== "Rentee" && (
            <Grid item xs={12}>
              <Alert severity="info">
                Jos olet vuokranantaja tai asunnon välittäjä <Link to="/company">luo yritys profiilisi.</Link>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  )
}

export default Profile;