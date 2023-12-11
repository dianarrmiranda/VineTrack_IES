import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

import Label from "src/components/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, IconButton, Modal, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import { deleteData, fetchData } from "src/utils";

// ----------------------------------------------------------------------

      ////{vine.colors.length > 0 && (
      //   <Stack
      //   direction="row"
      //   alignItems="center"
      //   justifyContent="space-between"
      // >
      //   <ColorPreview colors={vine.colors} />
      //   {vine.size} m²
      // </Stack>
      //)}
export default function VineCard({ vine, setVines}) {

  const [image, setImage] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.REACT_APP_SERVER_URL}:8080/vines/image/${vine.id}`, {
      responseType: 'arraybuffer',
    })
    .then((response) => {
      let image = btoa(
        new Uint8Array(response.data)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setImage(`data:;base64,${image}`);
    });
   }, [vine.id]);
    
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
  

  const renderImg = (
    <Box
      component="img"
      alt={vine.name}
      src={image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: "cover",
        position: "absolute",
      }}
    />
  );

  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    const res = deleteData(`vines/${vine.id}`);
    res.then((data) => {
      console.log(data);
      console.log(`Vine ${vine.id} deleted!`);
      const user = JSON.parse(localStorage.getItem("user"));
      fetchData(`users/${user.id}`).then((res) => {
        const { vines } = res;
        setVines({vines}.vines);
      });
    });
    setOpen(false);

  }


  return (
    <div>
      
    <Card>
      <Box sx={{ pt: "100%", position: "relative" }}>
        {vine.status && renderStatus}

        {renderImg}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 3 }}>
      <Link
        color="inherit"
        underline="hover"
        variant="subtitle2"
        noWrap
        href={`/vineDetails/${vine.id}`}
      >
        {vine.name}
      </Link>
      <IconButton aria-label="delete" color="error" size="large" onClick={handleOpen}>
        <Iconify icon="mdi:delete"  />
      </IconButton>
    </Stack>
    </Card>
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
            Delete Vine
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            Are you sure you want to delete vine <b>{vine.name}</b>?
          </Typography>
          
          <Button variant="contained" color="error" sx={{ mt: 3 }} onClick={handleDelete}>
            Yes
          </Button>
          <Button
            variant="contained"
            color="inherit"
            sx={{ mt: 3, ml: 2 }}
            onClick={handleClose}
          >
            No
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

VineCard.propTypes = {
  vine: PropTypes.object,
  setVines: PropTypes.func,
};