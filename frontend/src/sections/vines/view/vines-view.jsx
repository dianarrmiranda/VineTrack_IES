import { useState } from "react";

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

export default function VinesView() {
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
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Vine
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mt: 2, ml: 2 }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
