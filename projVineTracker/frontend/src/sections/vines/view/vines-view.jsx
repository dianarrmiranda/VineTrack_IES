import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import VineCard from "../vine-card";
import VineSort from "../vine-sort";
import VineFilters from "../vine-filters";
import {
  Alert,
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
  
  const [openFilter, setOpenFilter] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [size, setSize] = useState("");
  const [grapeType, setGrapeType] = useState([]);
  const [plantingDate, setPlantingDate] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);

  const [alertName, setAlertName] = useState(false);
  const [alertLocation, setAlertLocation] = useState(false);
  const [alertSize, setAlertSize] = useState(false);
  const [alertImage, setAlertImage] = useState(false);

  useEffect(() => {
      const initialize = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user === null ){
          Route.push("/login");
        }
        user && fetchData(`user/view/${user.id}`).then((res) => {
          const { vines } = res;
          setVines({vines}.vines);
        })
        fetchData(`grape/all`).then((res) => {
          setGrapes(res);
        })
      }
      initialize();
    }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };


  const handleChangeTypeGrapes = (event) => {
    const {
      target: { value },
    } = event;
    console.log("value ", value);
    setGrapeType(
      typeof value === "string" ? value.split(",") : value
    );

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
    console.log("vine added");

    if (name < 3) {
      setAlertName(true);
    }else{
      setAlertName(false);
    }
    if (location < 3) {
      setAlertLocation(true);
    }else{
      setAlertLocation(false);
    }
    if (size < 0 ) {
      setAlertSize(true);
    }else{
      setAlertSize(false);
    }
    const regex = /(\.jpg|\.jpeg|\.png)$/i;
    if (file === null || !regex.exec(fileName)) {
      setAlertImage(true);
    }else{
      setAlertImage(false);
    }

    if (name.length >= 3 && location.length >= 3 && size >= 0 && file !== null && regex.exec(fileName)) {

      const user = JSON.parse(localStorage.getItem("user"));

      //const res = postData("vine/add", {
      //  name: name,
      //  size: size,
      //  date: plantingDate,
      //  location: location,
      //  image: file,
      //  typeGrap: grapeType,
      //  users: [{id: user.id}]
      //});

    }

    handleClose();
  }

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
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <VineFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <VineSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {vines.map((vine) => (
          <Grid key={vine.id} xs={12} sm={6} md={3}>
            <VineCard vine={vine} />
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
          {alertName && (<Alert severity="error" sx={{ mb: 2 }}> Name must be at least 3 characters long </Alert> )}
          <TextField
            required
            id="outlined-required"
            label="Location"
            fullWidth
            sx={{ mb: 2 }}
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
          {alertLocation && (<Alert severity="error" sx={{ mb: 2 }}> Location must be at least 3 characters long </Alert> )}
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
          {alertSize && (<Alert severity="error" sx={{ mb: 2 }}> Size must be a positive number </Alert> )}
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
                <MenuItem key={grape.id} value={grape}>
                  <Checkbox checked={grapeType.indexOf(grape) > -1} />
                  <ListItemText primary={grape.name} />
                </MenuItem>
              ))}
            </Select>
          </div>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Planting Date"
                slotProps={{ textField: { fullWidth: true } }}
                sx={{ mb: 2 }}
                onChange={(e) => setPlantingDate(e.target.value)}
              />
            </LocalizationProvider>
          </div>
          <InputLabel sx={{ mb: 1 }}> Image</InputLabel>
          <Grid container spacing={2}>
            <Grid  xs={4}>
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
            <Grid  xs={8}>
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
          {alertImage && (<Alert severity="error" sx={{ mb: 2 }}> Please upload a valid image </Alert> )}
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleAddVine}>
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
    </Container>
  );
}
