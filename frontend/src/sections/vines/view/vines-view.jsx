import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

import { vines } from "src/_mock/vines";

import VineCard from "../vine-card";
import VineSort from "../vine-sort";
import VineFilters from "../vine-filters";
import { Box, Button, Modal, TextField } from "@mui/material";
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
          <TextField
            id="outlined-required"
            label="Planting Date"
            fullWidth
            sx={{ mb: 2 }}
          />
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
