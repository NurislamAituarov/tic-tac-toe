import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { addUserName } from '../../redux/action';

import './popUp.scss';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    value: '',
    hiddenBtn: false,
  });
  const dispatch = useDispatch();

  const toggleDrawer = (anchor, open) => (event) => {
    dispatch(addUserName(state.value));
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open, value: '', hiddenBtn: true });
  };

  const list = (anchor) => (
    <Box
      className="wrapper__popUp"
      sx={{ width: anchor === 'top' ? 'auto' : 250 }}
      role="presentation">
      <p className="subtitle">Давайте начнем играть</p>
      <div className="Register">
        <TextField
          id="standard-basic"
          label="Введите имя"
          variant="standard"
          value={state.value}
          onChange={(e) => setState((state) => ({ ...state, value: e.target.value }))}
        />
        <Button onClick={state.value ? toggleDrawer(anchor, false) : null} variant="contained">
          Сохранить
        </Button>
      </div>
    </Box>
  );

  return (
    <div className="btn__popUp">
      {['top'].map((anchor) => (
        <React.Fragment key={anchor}>
          {!state.hiddenBtn && (
            <Button style={{ fontSize: '25px' }} onClick={toggleDrawer(anchor, true)}>
              Начать
            </Button>
          )}
          <Drawer anchor={anchor} open={state[anchor]}>
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
