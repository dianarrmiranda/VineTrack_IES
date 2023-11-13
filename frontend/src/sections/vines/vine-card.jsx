import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import { ColorPreview } from "src/components/color-utils";

// ----------------------------------------------------------------------

export default function VineCard({ vine }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(vine.status === "sale" && "error") || "info"}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: "absolute",
        textTransform: "uppercase",
      }}
    >
      {vine.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={vine.name}
      src={vine.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: "cover",
        position: "absolute",
      }}
    />
  );

  return (
    <Card>
      <Box sx={{ pt: "100%", position: "relative" }}>
        {vine.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
          href={`/vineDetails/${vine.id}`}
        >
          {vine.name}
        </Link>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <ColorPreview colors={vine.colors} />
          {vine.size} m²
        </Stack>
      </Stack>
    </Card>
  );
}

VineCard.propTypes = {
  vine: PropTypes.object,
};
