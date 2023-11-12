import { useState } from "react";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";

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

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Vines
      </Typography>

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
    </Container>
  );
}
