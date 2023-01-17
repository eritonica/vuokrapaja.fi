import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Alert, Typography, Paper } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setCompany } from '../../appSlice';


const Profile = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.app.token);
	const profile = useSelector((state) => state.app.profile);
	const company = useSelector((state) => ( state.app.company ));
	const [message, setMessage] = useState({
		error: "",
		success: ""
	});

	useEffect(() => {
    if(token === false) {
      navigate("/login");
    }
    if(profile.role === 'Rentee') {
      navigate("/");
    }
  }, [navigate, token, profile]);

	const onChange = (e) => {
		dispatch(setCompany({...company, [e.target.name]: e.target.value}));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if(company.new === true) {
			let response = await fetch("/api/companies", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				body: JSON.stringify(company)
			});
			let body = await response.json();
			// console.log(body);
			if(body.message === "Company created.") {
				setMessage({ success: "Tiedot päivitetty."});
				dispatch(setCompany({...body.company, new: false}));
			} else if(body.message === "Company already exists.") {
				setMessage({ error: "Yritys on jo olemassa. Ota heihin yhteyttä."});
			}
		} else {
			let response = await fetch("/api/companies/" + company._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				body: JSON.stringify(company)
			});
			let body = await response.json();
			// console.log(body);
			if(body.message === "Company updated.") {
				setMessage({ success: "Tiedot päivitetty."});
				dispatch(setCompany({...company, new: false}));
			} else if(body.message === "Company not found.") {
				setMessage({ error: body.message});
			}
		}
	}

	return (
		<Container maxWidth="md" component={Paper}>
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, pb: 4, mb: 4 }}>
				<Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="h1" gutterBottom>Yritys</Typography>
          </Grid>
        </Grid>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Nimi"
							name="name"
							onChange={onChange}
							required
							value={company.name}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Y-tunnus"
							name="ycode"
							onChange={onChange}
							required
							value={company.ycode}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							multiline
							rows={4}
							label="Kuvaus"
							name="description"
							onChange={onChange}
							value={company.description}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Kotisivu"
							name="website"
							onChange={onChange}
							value={company.website}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							type="email"
							label="Asiakaspalvelun sähköposti"
							name="email"
							onChange={onChange}
							value={company.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							type="tel"
							label="Asiakaspalvelun puhelinnumero"
							name="phone"
							onChange={onChange}
							value={company.phone}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							type="address"
							label="Käyntiosoite"
							name="address"
							onChange={onChange}
							value={company.address}
						/>
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
				</Grid>
			</Box>
		</Container>
	);

};

export default Profile;