import { useState } from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "src/routes/hooks";

import { bgGradient } from "src/theme/css";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";
import { fetchData, postData } from "src/utils";
import { Alert } from "@mui/material";

// ----------------------------------------------------------------------

export default function RegisterUserView() {
  const theme = useTheme();

  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassowrd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [alertPassword, setAlertPassword] = useState(false);
  const [alertEmail, setAlertEmail] = useState(false);
  const [alertName, setAlertName] = useState(false);
  const [alertPasswordMacth, setAlertPasswordMacth] = useState(false);
  const [alertEmailCheck, setAlertEmailCheck] = useState(false);

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[.!@#$%^&*()_+]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleName = (event) => {
    setName(event.target.value);
    if (name.length > 3) { setAlertName(false);}
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
    if (emailRegex.test(email) === true) { setAlertEmail(false);}
  };

  const handlePassword = (event) => {
    setPassowrd(event.target.value);
    if (passwordRegex.test(password) === true) { setAlertPassword(false);}
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    if (password === confirmPassword) { setAlertPasswordMacth(false);}
  };

  const handleClick = () => {

    if (passwordRegex.test(password) === false) { setAlertPassword(true);}
    else { setAlertPassword(false); }

    if (password !== confirmPassword) { setAlertPasswordMacth(true);}
    else { setAlertPasswordMacth(false);}

    if (emailRegex.test(email) === false) { setAlertEmail(true);}
    else { setAlertEmail(false);}

    if (name.length < 3) { setAlertName(true);}
    else { setAlertName(false);}

    const checkEmail = fetchData(`user/email/${email}`);
    checkEmail.then((res) => {if (res) { setAlertEmailCheck(true);} else {setAlertEmailCheck(false);}});



    if (passwordRegex.test(password) === true && password === confirmPassword && emailRegex.test(email) === true && name.length >= 3 && alertEmailCheck === false) {

      // Dados no formato raw JSON
      const res = postData("user/add", {
         name: name,
         email: email,
         password: password,
         role: "user",
      });

      res.then(response => {
        if (response) {
        console.log("Register successful");
        setName("");
        setEmail("");
        setPassowrd("");
        setConfirmPassword("");

        const { id, name } = response;

        localStorage.setItem("user", JSON.stringify({ id, name }));

        router.replace("/");
        
      } else {
        console.log("Registration failed");
      }
      })
      .catch(error => {
      console.error("Error:", error);
      });
    }
  };



  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="name" label="Name" onChange={handleName}/>
        {alertName && <Alert severity="warning">Name should be at least 3 characters long.</Alert>}
        
        <TextField name="email" label="Email address" onChange={handleEmail}/>
        {alertEmail && <Alert severity="warning">Email address is not valid.</Alert>}
        {alertEmailCheck && <Alert severity="error">Email address already exists.</Alert>}

        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          onChange={handlePassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {alertPassword && <Alert severity="warning">Password should be at least 8 characters long and contain at least one number, one lowercase, one uppercase letter and one caracter special.</Alert>}

        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          onChange={handleConfirmPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {alertPasswordMacth && <Alert severity="error">Passwords should match! Make sure you enter the same password in both fields.</Alert>}
        <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        >
          Register
        </LoadingButton>
      </Stack>
      
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" mb={3}>Register in VineTrack</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
