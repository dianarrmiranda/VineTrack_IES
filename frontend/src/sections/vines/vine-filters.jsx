import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ColorPicker } from "src/components/color-utils";

// ----------------------------------------------------------------------

export const SORT_OPTIONS = [
  { value: "sizeDesc", label: "Size: High-Low" },
  { value: "sizeAsc", label: "Size: Low-High" },
];
export const GRAPE_OPTIONS = [
  "Cabernet Sauvignon",
  "Merlot",
  "Pinot Noir",
  "Syrah/Shiraz",
  "Chardonnay",
  "Sauvignon Blanc",
  "Riesling",
  "Pinot Grigio/Pinot Gris",
  "Grenache",
  "Cinsault",
];
export const SIZE_OPTIONS = [
  { value: "below", label: "Below 25000 m²" },
  { value: "between", label: "Between 25000 - 75000 m²" },
  { value: "above", label: "Above 75000 m²" },
];
export const COLOR_OPTIONS = [
  "#800020", //Vermelho Borgonha
  "#7B1113", //Vermelho Vinho
  "#922B3E", //Vermelho Rubi
  "#4E2A5A", //Púrpura Profundo
  "#FFD700", //Dourado
  "#90EE90", //Verde Claro
  "#FFE4B5", //Amarelo Marfim
  "#C0C0C0", //Cinza Claro
  "#FFA07A", //Salmão Claro
  "#D18F96", //Rosa claro
  "#F88379", //Rosa suave
];

// ----------------------------------------------------------------------

export default function VineFilters({
  openFilter,
  onOpenFilter,
  onCloseFilter,
}) {
  const renderGrapes = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Types of Grapes</Typography>
      <FormGroup>
        {GRAPE_OPTIONS.map((item) => (
          <FormControlLabel key={item} control={<Checkbox />} label={item} />
        ))}
      </FormGroup>
    </Stack>
  );

  const renderColors = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Colors</Typography>
      <ColorPicker
        name="colors"
        selected={[]}
        colors={COLOR_OPTIONS}
        onSelectColor={(color) => [].includes(color)}
        sx={{ maxWidth: 38 * 4 }}
      />
    </Stack>
  );

  const renderSize = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">Size</Typography>
      <RadioGroup>
        {SIZE_OPTIONS.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        Filters&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 280, border: "none", overflow: "hidden" },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderGrapes}

            {renderColors}

            {renderSize}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

VineFilters.propTypes = {
  openFilter: PropTypes.bool,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};
