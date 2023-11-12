import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Iconify from "src/components/iconify/iconify";
import Box from "@mui/material/Box";

import { vines } from "src/_mock/vines";

import VineCard from "../vine-card";
import VineSort from "../vine-sort";
import VineFilters from "../vine-filters";

// ----------------------------------------------------------------------

export default function VinesView() {
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const [value, setValue] = useState(null);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Vines
      </Typography>

      <Button
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="eva:plus-fill" />}
        onClick={() => document.getElementById("modalAddVine").showModal()}
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

      <dialog id="modalAddVine" className="modal">
        <div className="modal-box" style={{ backgroundColor: "#F9FAFB" }}>
          <h3 className="font-bold text-lg mb-5">Add a New Vine!</h3>

          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                required
                id="outlined-required"
                label="Name of Vine"
                fullWidth
              />
              <TextField
                required
                id="outlined-disabled"
                label="Localização"
                fullWidth
              />
              <TextField
                id="outlined-number"
                label="Size (m²)"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <TextField
                id="outlined-disabled"
                label="Type of Grapes"
                fullWidth
              />
              <TextField
                id="outlined-disabled"
                label="Planting Date "
                fullWidth
              />
            </div>
          </Box>
          <div className="modal-action">
            <form method="dialog">
              <button type="submit" className="btn btn-primary mr-2">
                Submit
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </Container>
  );
}
