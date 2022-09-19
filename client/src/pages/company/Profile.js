import { useState } from 'react';
import { Container, Box, TextField, Button, Alert, Typography } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import { useSelector, useDispatch } from 'react-redux';
import { setCompany } from '../../appSlice';


const Profile = (props) => {
	const dispatch = useDispatch();
	const token = useSelector((state) => state.app.token);
	const company = useSelector((state) => ( state.app.company ));
	const [error, setError] = useState("");

	const onChange = (e) => {
		dispatch(setCompany({...company, [e.target.name]: e.target.value}));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if(company.new === true) {
			let response = await fetch("http://localhost:8080/api/companies", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				body: JSON.stringify(company)
			});
			let body = await response.json();
			console.log(body);
			if(body.message === "Company created.") {
				dispatch(setCompany({...company, new: false}));
			} else if(body.message === "Company already exists.") {
				setError("Yritys on jo olemassa. Ota heihin yhteyttä.");
			}
		} else {
			let response = await fetch("http://localhost:8080/api/companies/" + company._id, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"token": token
				},
				body: JSON.stringify(company)
			});
			let body = await response.json();
			console.log(body);
			if(body.message === "Company updated.") {
				dispatch(setCompany({...company, new: false}));
			} else if(body.message === "Company not found.") {
				setError(body.message);
			}
		}
	}

	return (
		<Container maxWidth="sm">
			<Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
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
							value={company.name}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Y-tunnus"
							name="ycode"
							onChange={onChange}
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
							label="Asiakaspalvelun sähköposti"
							name="email"
							onChange={onChange}
							value={company.email}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Asiakaspalvelun puhelinnumero"
							name="phone"
							onChange={onChange}
							value={company.phone}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							fullWidth
							label="Käyntiosoite"
							name="address"
							onChange={onChange}
							value={company.address}
						/>
					</Grid>
				</Grid>
				{ error && ( 
					<Grid item xs={12}>
						<Alert severity="error">{error}</Alert>
					</Grid>
				)}
				<Grid container spacing={2} mt={1} mb={4}>
					<Grid item xs={12}>
						<Button type="submit" variant="contained" fullWidth> Tallenna </Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);

};

export default Profile;