import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 410,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

export default function StagesModal({ setOpen, open, user, connectedUser }) {
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={open}>
          <Box sx={style}>
            {connectedUser && (
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Пользователь {connectedUser} присоидинился!
              </Typography>
            )}

            {!connectedUser && user !== 'draw' && (
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Пользователь {user} победил!
              </Typography>
            )}

            {user === 'draw' && (
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Ничья
              </Typography>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
