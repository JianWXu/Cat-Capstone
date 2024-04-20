import * as React from 'react';
import {useState, useContext} from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import getSignUpTheme from './getSignUpTheme';
import ToggleColorMode from './ToggleColorMode';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Toggle design language"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

export default function SignUp({signUp, shouldShowSignUp}) {

  const INITIAL_STATE = {
    username: "",
    password: "",
    fName: "",
    lName: "",
    email: ""
}

  const [formData, setFormData] = useState(INITIAL_STATE)
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [fnameError, setfNameError] = React.useState(false);
  const [lnameError, setlNameError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const fName = document.getElementById('firstName');
    const lName = document.getElementById('lastName')
    const username = document.getElementById('username')

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!fName.value || fName.value.length < 1) {
      setfNameError(true);
      setNameErrorMessage('First Name is required.');
      isValid = false;
    } else {
      setfNameError(false);
      setNameErrorMessage('');
    }

    if (!lName.value || lName.value.length < 1) {
      setlNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setlNameError(false);
      setNameErrorMessage('');
    }

    if (!username.value || username.value.length < 1) {
      setUsernameError(true);
      setUsernameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage('');
    }
    
    return isValid;
  };

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleChange = e => {
    const {name, value} = e.target
    setFormData(data => ({
        ...data,
        [name]: value
    }))
}

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
    try{
      signUp({...formData})
      console.log({
        username: data.get('username'),
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),
        email: data.get('email'),
        password: data.get('password'),
      });
    } catch(err){
      console.err("Error signing up", err)
      console.loog("signup unsuccessful")
    }
    
  };

  return (
    <>
    {shouldShowSignUp && (
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
      <CssBaseline />
      <Stack
        component="main"
        direction="column"
        justifyContent="space-between"
        sx={(theme) => ({
          backgroundRepeat: 'no-repeat',
          backgroundImage:
            theme.palette.mode === 'light'
              ? 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))'
              : 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.3), hsl(220, 30%, 5%))',
          pb: { xs: 12, sm: 0 },
        })}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            position: { xs: 'static', sm: 'fixed' },
            width: '100%',
            p: { xs: 2, sm: 4 },
          }}
        >
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            component="a"
            href="/material-ui/getting-started/templates/"
          >
            Back
          </Button>
          <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
        </Stack>
        <Stack
          justifyContent="center"
          sx={{ height: { xs: '100%', sm: '100dvh' }, p: 2 }}
        >
          <Card
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignSelf: 'center',
              width: { xs: '100%', sm: '450px' },
              p: { xs: 2, sm: 4 },
              gap: 4,
              boxShadow:
                theme.palette.mode === 'light'
                  ? 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px, hsla(220, 30%, 5%, 0.05) 0px 0px 0px 1px'
                  : 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px, hsla(220, 30%, 5%, 0.05) 0px 0px 0px 1px',
            })}
          >
            <SitemarkIcon />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Sign up
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  placeholder="username"
                  error={usernameError}
                  helperText={usernameErrorMessage}
                  onChange={handleChange}
                  color={usernameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="fname">First name</FormLabel>
                <TextField
                  autoComplete="fname"
                  name="fname"
                  required
                  fullWidth
                  id="firstName"
                  placeholder="Jon"
                  error={fnameError}
                  helperText={nameErrorMessage}
                  onChange={handleChange}
                  color={fnameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="lname">Last name</FormLabel>
                <TextField
                  autoComplete="lname"
                  name="lname"
                  required
                  fullWidth
                  id="lastName"
                  placeholder="Snow"
                  error={lnameError}
                  helperText={nameErrorMessage}
                  onChange={handleChange}
                  color={lnameError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="your@email.com"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  error={emailError}
                  helperText={emailErrorMessage}
                  onChange={handleChange}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  required
                  fullWidth
                  name="password"
                  placeholder="••••••"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  variant="outlined"
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  onChange={handleChange}
                  color={passwordError ? 'error' : 'primary'}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive updates via email."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
              >
                Sign up
              </Button>
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
            <Divider>
              <Typography color="text.secondary">or</Typography>
            </Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => alert('Sign up with Google')}
                startIcon={<GoogleIcon />}
              >
                Sign up with Google
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => alert('Sign up with Facebook')}
                startIcon={<FacebookIcon />}
              >
                Sign up with Facebook
              </Button>
            </Box>
          </Card>
        </Stack>
      </Stack>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
    </ThemeProvider>
    )}
    
    </>
  );
  
}
