import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import VineCard from "../vine-card";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Iconify from "src/components/iconify";

import { styled } from "@mui/material/styles";
import { Route } from "react-router-dom";
import { fetchData, postData } from "src/utils";

// ----------------------------------------------------------------------

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.default",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function VinesView() {
  const [vines, setVines] = useState([]);
  const [grapes, setGrapes] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [grapeType, setGrapeType] = useState([]);
  const [grapeTypeIds, setGrapeTypeIds] = useState([]);
  const [grapeTypeNames, setGrapeTypeNames] = useState([]);
  const [plantingDate, setPlantingDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [city, setCity] = useState("");

  const [ grapeNewName, setGrapeNewName] = useState("");
  const [ grapeNewType, setGrapeNewType ] = useState("");

  const [alertName, setAlertName] = useState(false);
  const [alertLocation, setAlertLocation] = useState(false);
  const [alertSize, setAlertSize] = useState(false);
  const [alertImage, setAlertImage] = useState(false);
  const [alertImageSize, setAlertImageSize] = useState(false);
  const [alertCity, setAlertCity] = useState(false);

  const [alertNewNameGrape, setAlertNewNameGrape] = useState(false);
  const [alertNewTypeGrape, setAlertNewTypeGrape] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
      const initialize = async () => {
        if (user === null ){
          Route.push("/login");
        }
        user && fetchData(`users/${user.id}`, user.token).then((res) => {
          const { vines } = res;
          setVines({vines}.vines);
        })
        fetchData(`grapes`, user.token).then((res) => {
          setGrapes(res);
        })
      }
      initialize();
    }, []);

  const handleChangeTypeGrapes = (event) => {
    
    const {
      target: { value },
    } = event;
   
    const filteredValue = value.filter(element => element !== undefined);
     
    setGrapeType(typeof filteredValue === "string" ? filteredValue.split(",") : filteredValue);

    setGrapeTypeNames(filteredValue);
    setAreaGrapes(prevAreaGrapes => {
      const newAreaGrapes = {};
      Object.keys(prevAreaGrapes).forEach(grapeName => {
        if (filteredValue.includes(grapeName)) {
          newAreaGrapes[grapeName] = prevAreaGrapes[grapeName];
        }
      });

      return newAreaGrapes;
    });

    const ids = [];
    grapes.forEach((grape) => {
      filteredValue.forEach((grapeName) => {
        if (grape.name === grapeName) {
          ids.push(grape.id);
        }
      });
    });
    setGrapeTypeIds(ids);
   };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
    setFileName(file.name);
  };
  const handleClearClick = () => {
    setFileName("");
    document.querySelector('input[type="file"]').value = "";
  };

  const handleAddVine = () => {
    if (name < 3) {
      setAlertName(true);
    } else {
      setAlertName(false);
    }
    if (location < 3) {
      setAlertLocation(true);
    } else {
      setAlertLocation(false);
    }
    if (size < 0 || size === "") {
      setAlertSize(true);
    } else {
      setAlertSize(false);
    }
    const regex = /(\.jpg|\.jpeg|\.png)$/i;
    if (file === null || !regex.exec(fileName)) {
      setAlertImage(true);
    } else {
      setAlertImage(false);
    }
    
    if (file !== null && file.size > 1000024) {
      setAlertImageSize(true);
    } else {
      setAlertImageSize(false);
    }

    if (city === ""){
      setAlertCity(true);
    }
    else {
      setAlertCity(false);
    }

    let gp = {};

    if (grapeTypeIds.length > 1) {
      const totalArea = Object.values(areaGrapes).reduce((total, value) => total + parseFloat(value), 0);
      if (totalArea !== Number(size)){ setAlertAreaGrapes(true); } else { setAlertAreaGrapes(false); }
    }else {
      gp = grapeTypeNames.map((grape) => ({ [grape]: size }))[0];
      setAreaGrapes(gp);
      setAlertAreaGrapes(false);
    }

    if (
      name.length >= 3 &&
      location.length >= 3 &&
      size >= 0 &&
      file !== null &&
      regex.exec(fileName) &&
      file.size <= 1000000 &&
      city !== "" &&
      ((Object.values(areaGrapes).reduce((total, value) => total + parseFloat(value), 0) === Number(size) && grapeTypeIds.length > 1) || grapeTypeIds.length === 1 )
    ) {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("city", city);
      formData.append("size", size);
      formData.append("date", plantingDate);
      formData.append("img", file);
      formData.append("users", user.id);
      formData.append(
        "typeGrap",
        grapeTypeIds.map((id) => id)
      );
      formData.append("file", file, file.name);
      formData.append("areaGrapes", grapeTypeIds.length > 1 ? JSON.stringify(areaGrapes) : JSON.stringify(gp));


      const res = postData("vines", formData, user.token);

      res.then((response) => {
        if (response) {
          console.log("Register successful");
          setName("");
          setLocation("");
          setCity("");
          setSize("");
          setPlantingDate("");
          setFileName("");
          setFile(null);
          setGrapeType([]);
          setGrapeTypeIds([]);
          setOpen(false);
          handleClose();

          fetchData(`users/${user.id}`, user.token).then((res) => {
            const { vines } = res;
            setVines({ vines }.vines);
          });
        }
      });
    }
  };

  const handleAddGrape = () => {
    if (grapeNewName.length < 3){
      setAlertNewNameGrape(true)
    }else {
      setAlertNewNameGrape(false)
    }
    if (grapeNewType.length < 3){
      setAlertNewTypeGrape(true)
    }else {
      setAlertNewTypeGrape(false)
    }

    if (grapeNewName.length >= 3 && grapeNewType.length >= 3){
      
      const res = postData("grapes", {
        name: grapeNewName,
        type: grapeNewType
     }, user.token);

      res.then((response) => {
        if (response) {
          console.log("Register successful");
          setGrapeNewName("");
          setGrapeNewType("");
          setOpen1(false);
          handleClose1();

          fetchData(`grapes`, user.token).then((res) => {
            setGrapes(res);
          });
        }
      });
    }
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('http://api.ipma.pt/public-data/forecast/locations.json')
      .then(response => response.json())
      .then(data => setCities(data.map(city => city.local)))
      .catch(err => console.error(err));
  }, []);

  const [areaGrapes, setAreaGrapes] = useState({});
  const [alertAreaGrapes, setAlertAreaGrapes] = useState(false);

  

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Vines
      </Typography>
      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={handleOpen}
      >
        Add Vine
      </Button>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >

      </Stack>

      <Grid container spacing={3}>
        {vines.map((vine) => (
          <Grid key={vine.id} xs={12} sm={6} md={3}>
            <VineCard vine={vine} setVines={setVines} />
          </Grid>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Add a New Vine
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="Name of Vine"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          {alertName && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Name must be at least 3 characters long{" "}
            </Alert>
          )}
          <TextField
            required
            id="outlined-required"
            label="Location"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
          {alertLocation && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Location must be at least 3 characters long{" "}
            </Alert>
          )}
          <Autocomplete
            disablePortal
            required
            id="combo-box-demo"
            label="City"
            options={cities}
            sx={{ mb: 2 }}
            renderInput={(params) => <TextField {...params} label="City" />}
            onChange={(event, newValue) => setCity(newValue)}
          />
          {alertCity && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Please select a city{" "}
            </Alert>
          )}
          <TextField
            required
            id="outlined-number"
            type="number"
            label="Size (m²)"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setSize(e.target.value)}
            value={size}
          />
          {alertSize && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Size must be a positive number{" "}
            </Alert>
          )}
          <div>
            <InputLabel id="demo-multiple-checkbox-label">
              Type of Grapes
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={grapeType}
              onChange={handleChangeTypeGrapes}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              fullWidth
              sx={{ mb: 2 }}
            >
              {grapes.map((grape) => (
                <MenuItem key={grape.id} value={grape.name}>
                  <Checkbox checked={grapeType.indexOf(grape.name) > -1} />
                  <ListItemText primary={grape.name} />
                </MenuItem>
              ))}
              <MenuItem onClick={handleOpen1} sx={{mt: 2}} >
                <Iconify icon="eva:plus-fill" />
                <ListItemText primary="  Add a New Grape" />
              </MenuItem>
            </Select>
          </div>
          {grapeType.length > 1 && (
             grapeTypeNames.map((grape) => (
              <>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography 
                    id="modal-modal-title"
                    variant="p"
                    component="p"
                    sx={{ mb: 2,  mr: 1}}
                  >
                    {grape}:
                  </Typography>
                  <TextField
                    required
                    id="outlined-required"
                    label="Area (m²)"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={areaGrapes[grape] || ''}
                    onChange={(e) => {
                      setAreaGrapes(prevAreaGrapes => ({
                        ...prevAreaGrapes,
                        [grape]: e.target.value
                      }));
                    }}
                  />
                </div>
              </>
             ))
            )}
          {alertAreaGrapes && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              The sum of the areas of the grapes must be equal to the vine area{" "}
            </Alert>
          )}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Planting Date"
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ mb: 2 }}
                onChange={(newValue) => {
                  setPlantingDate(newValue);
                }}
              />
            </LocalizationProvider>
          </div>
          <InputLabel sx={{ mb: 1 }}> Image</InputLabel>
          <Grid container spacing={2}>
            <Grid xs={4}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<Iconify icon="ep:upload-filled" />}
                onChange={handleFileChange}
                fullWidth
                sx={{ p: 2 }}
              >
                Upload
                <VisuallyHiddenInput type="file" />
              </Button>
            </Grid>
            <Grid xs={8}>
              {fileName && (
                <TextField
                  value={fileName}
                  fullWidth
                  disabled
                  InputProps={{
                    endAdornment: (
                      <Iconify
                        icon="twemoji:cross-mark"
                        onClick={handleClearClick}
                        cursor="pointer"
                      />
                    ),
                  }}
                />
              )}
            </Grid>
          </Grid>
          {alertImage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Please upload a valid image{" "}
            </Alert>
          )}
          {alertImageSize && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {" "}
              Please upload an image with a maximum size of 1MB{" "}
            </Alert>
          )}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddVine}
          >
            Add Vine
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mt: 3, ml: 2 }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal
        open={open1}
        onClose={handleClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Add a New Grape
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setGrapeNewName(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="Type"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setGrapeNewType(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleAddGrape}
          >
            Add Grape
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mt: 3, ml: 2 }}
            onClick={handleClose1}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
