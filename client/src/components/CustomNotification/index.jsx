import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedNotification({ notification, setNotification }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotification(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={!!notification} autoHideDuration={2000} onClose={handleClose}>
        {notification !== 'busy' ? (
          <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
            Сейчас не ваш ход!
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
            Вы не можете выбрать уже отмеченную секцию
          </Alert>
        )}
      </Snackbar>
    </Stack>
  );
}
