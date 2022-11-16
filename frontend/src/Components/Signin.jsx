import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { isLoggedIn, setSession, validateEmail } from "../util/helpers";
import { setAuthToken, signIn } from "../api";


const theme = createTheme();

export const SignIn = () => {

	const [msg, setMsg] = React.useState('');
	const [validate, setEmailValidate] = React.useState('');
	let navigate = useNavigate();

	React.useEffect(()=>{
		if(isLoggedIn()) {
			navigate('/dashboard');
		}
	},[])

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const payload = { employeeId: data.get("employeeId"), password: data.get("password") };

		if (validateForm(payload)) {
			setMsg(''); setEmailValidate('')			
			const response = await signIn(payload);
			if (response.data && response.data.success) {
				setAuthToken(response.data.token);
				setSession(response.data.token);
				navigate("/");
			} else {
				setMsg(response.data.message)
			}
		}
	};

	const validateForm = (payload) => {
		if (!(payload.employeeId && payload.password)) {
			setMsg('Please fill the required fields!');
			return false;
		}
		return true;
	}


	return (
		<>
		<div className="main-wrapper">
		<ThemeProvider theme={theme}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<Box
						sx={{
							marginTop: 8,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>

						<Typography component="h1" variant="h5">
							Sign in
						</Typography>
						<Typography className="error-msg" component="h5" variant="h5">
							{msg}
						</Typography>
						<Box
							component="form"
							onSubmit={handleSubmit}
							noValidate
							sx={{ mt: 1 }}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="Employee ID"
								name="employeeId"
								error = {validate.length > 0}
								helperText={validate}
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
							/>
							<FormControlLabel
								control={<Checkbox value="remember" color="primary" />}
								label="Remember me"
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign In
							</Button>
						</Box>
					</Box>
				</Container>
			</ThemeProvider>
		</div>
		</>
	);
}
