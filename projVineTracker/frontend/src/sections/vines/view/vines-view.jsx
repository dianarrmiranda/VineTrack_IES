import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { vines } from "src/_mock/vines";

import VineCard from "../vine-card";
import VineSort from "../vine-sort";
import VineFilters from "../vine-filters";
import {
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

const grapes = [
  "Concord",
  "Chardonnay",
  "Cabernet Sauvignon",
  "Merlot",
  "Thompson Seedless",
  "Zinfandel",
  "Muscat",
  "Pinot Noir",
  "Riesling",
  "Shiraz/Syrah",
];

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
  console.log(vines);

 // useEffect(() => {
 //   const initialize = async () => {
 //     const user = JSON.parse(localStorage.getItem("user"));
 //     if (user === null ){
 //       Route.push("/login");
 //     }
 //     user && fetchData(`user/view?id=${user.id}&token=${user.token}`).then((res) => {
 //       setUserInfo(res);
 //     })
 //   }
 //   initialize();
 // }, []);

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [grapeType, setGrapeType] = useState([]);

  const handleChangeTypeGrapes = (event) => {
    const {
      target: { value },
    } = event;
    setGrapeType(typeof value === "string" ? value.split(",") : value);
  };

  const [fileName, setFileName] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
  };
  const handleClearClick = () => {
    setFileName("");
    // Aqui você pode também limpar o arquivo do input hidden
    document.querySelector('input[type="file"]').value = "";
  };

  const handleAddVine = () => {
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
    if (size < 0 || size === "" ) {
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
    //max tamanho imagem 1MB
    if (file !== null && file.size > 1000000) {
      setAlertImageSize(true);
    }else{
      setAlertImageSize(false);
    }

    if (name.length >= 3 && location.length >= 3 && size >= 0 && file !== null && regex.exec(fileName) && file.size <= 1000000) {
      const user = JSON.parse(localStorage.getItem("user"));
      
      const formData = new FormData();
      formData.append("name", name);
      formData.append("location", location);
      formData.append("size", size);
      formData.append("date", plantingDate);
      formData.append("img", file);
      formData.append("users", user.id);
      formData.append("typeGrap", grapeTypeIds.map(id => id));
      formData.append("file", file, file.name);

      const res = postData("vine/add", formData);

      res.then((response) => {
        if (response) {
          console.log("Register successful");
          setName("");
          setLocation("");
          setSize("");
          setPlantingDate("");
          setFileName("");
          setFile(null);
          setGrapeType([]);
          setGrapeTypeIds([]);
          setOpen(false);
          handleClose();

          fetchData(`user/view/${user.id}`).then((res) => {
            const { vines } = res;
            setVines({vines}.vines);
          })
        }
      }
      );
    }
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
          />
          <TextField
            required
            id="outlined-required"
            label="Location"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            required
            id="outlined-number"
            type="number"
            label="Size (m²)"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            id="outlined-required"
            label="Type of Vine"
            fullWidth
            sx={{ mb: 2 }}
          />
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
                <MenuItem key={grape} value={grape}>
                  <Checkbox checked={grapeType.indexOf(grape) > -1} />
                  <ListItemText primary={grape} />
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
              />
            </LocalizationProvider>
          </div>
          <InputLabel sx={{ mb: 1 }}> Image</InputLabel>
          <Grid container spacing={2}>
            <Grid item xs={4}>
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
            <Grid item xs={8}>
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
          {alertImageSize && (<Alert severity="error" sx={{ mb: 2 }}> Please upload an image with a maximum size of 1MB </Alert> )}
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
