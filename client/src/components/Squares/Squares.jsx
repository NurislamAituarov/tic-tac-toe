import { useEffect, useState } from 'react';
import cn from 'classnames';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './Squares.scss';

import { addConnectedUserName } from '../../redux/action';
import StagesModal from '../Winner/StagesModal';
import TemporaryDrawer from '../popUp';
import fon from '../../images/fon.jpg';
import { Button } from '@mui/material';
import CustomizedNotification from '../CustomNotification';

const successFullArr = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const socket = new WebSocket(`${process.env.REACT_APP_URL}`, 'echo-protocol');

export function Squares() {
  const valueUserName = useSelector((state) => state.userName);
  const connectedUser = useSelector((state) => state.connectedUser);

  const [state, setState] = useState({
    squares: Array(9).fill(null),
    count: 0,
  });
  const [playIndex, setPlayIndex] = useState(null);
  const [indexArr, setIndexArr] = useState();
  const [winUser, setWinUser] = useState('');

  const [joined, setJoined] = useState(true);
  const [openWinner, setOpenWinner] = useState(false);
  const [draw, setDraw] = useState(false);
  const [notification, setNotification] = useState('');

  const params = useParams();
  const dispatch = useDispatch();

  // При нажатии на квадрат, приходит от сервера индекс квадрата
  useEffect(() => {
    if (playIndex !== null) {
      addValue(playIndex);
    }
  }, [playIndex]);

  // Соединение с websocket и получение сообщение от сервера
  useEffect(() => {
    const socket = new WebSocket(`${process.env.REACT_APP_URL}`, 'echo-protocol');
    if (valueUserName) {
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            method: 'connection',
            id: params.id,
            username: valueUserName,
          }),
        );
      };

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.method) {
          case 'connection':
            console.log(`Пользователь ${msg.username} присоидинился`);
            dispatch(addConnectedUserName(msg.username));
            break;
          case 'draw':
            setState((state) => ({ ...state, username: msg.username }));
            setPlayIndex(msg.playIndex);
            setWinUser(msg.username);
            break;
          default:
            return;
        }
      };
    }
  }, [valueUserName]);

  // Срабатывает при сохрaнении игрока
  useEffect(() => {
    setJoined(true);
    setTimeout(() => {
      setJoined(false);
    }, 2000);
  }, [connectedUser]);

  // Функция которая выясняет победу или ничью
  function isWinner() {
    let s = state.count % 2 === 0 ? 'X' : 'O';

    for (let i = 0; i < successFullArr.length; i++) {
      let el = successFullArr[i];

      if (state.squares[el[0]] === s && state.squares[el[1]] === s && state.squares[el[2]] === s) {
        setOpenWinner(true);
        setIndexArr(i);
        setTimeout(() => {
          setState({ squares: Array(9).fill(null) });
          setState((state) => ({ ...state, count: 0, notTea: false }));
          setIndexArr(null);
          setOpenWinner(false);
        }, 1000);
        break;
      }
    }

    successFullArr.forEach((el, i) => {
      // if (state.squares[el[0]] === s && state.squares[el[1]] === s && state.squares[el[2]] === s) {
      //   console.log('winner');
      //   setOpenWinner(true);
      //   setIndexArr(i);
      //   setTimeout(() => {
      //     setState({ squares: Array(9).fill(null) });
      //     setState((state) => ({ ...state, count: 0, notTea: false }));
      //     setIndexArr(null);
      //   }, 2000);
      // } else {
      //   state.count === 8 && console.log('ничья');
      // }
    });
  }

  // Функция при клике на квадрат
  function addValue(index) {
    if (state.squares[index] === null && state.count !== 9) {
      state.squares[index] = state.count % 2 === 0 ? 'X' : 'O';
      setState((state) => ({ ...state, count: state.count + 1 }));
      isWinner();
    } else {
      alert('Эта ячейка занята, выберите другую');
    }
  }

  // Функция отправляющая сообщения на сервер
  function onIndexSocket(index) {
    if (state.squares[index] === null && state.username !== valueUserName) {
      setNotification(false);
      socket.send(
        JSON.stringify({
          method: 'draw',
          id: params.id,
          username: valueUserName,
          playIndex: index,
        }),
      );
    } else if (state.squares[index] !== null) {
      setNotification('busy');
    } else {
      setNotification('not your move');
    }
  }

  if (state.count === 9 && !openWinner) {
    setState((state) => ({
      ...state,
      squares: Array(9).fill(null),
      count: 0,
    }));
    setDraw(true);
    setIndexArr(null);
  }

  return (
    <>
      <img className="fon" src={fon} alt="" />
      <div className="App">
        {state.squares.map((el, i) => {
          return (
            <Button
              variant="outlined"
              onClick={() => onIndexSocket(i)}
              key={i}
              className="square__item">
              <p>{el}</p>
            </Button>
          );
        })}
        <div
          className={cn(
            'square__success_line',
            { square__success_vertical1: indexArr === 3 },
            { square__success_vertical2: indexArr === 4 },
            { square__success_vertical3: indexArr === 5 },
            { square__success_horizontal1: indexArr === 0 },
            { square__success_horizontal2: indexArr === 1 },
            { square__success_horizontal3: indexArr === 2 },
            { square__success_diagonal1: indexArr === 6 },
            { square__success_diagonal2: indexArr === 7 },
          )}></div>
      </div>
      <TemporaryDrawer />

      {connectedUser.length > 0 && (
        <StagesModal
          open={joined}
          setOpen={setJoined}
          user={winUser}
          connectedUser={connectedUser}
        />
      )}
      {draw && <StagesModal open={draw} setOpen={setDraw} user="draw" />}
      {openWinner && <StagesModal open={openWinner} setOpen={setOpenWinner} user={winUser} />}
      {notification && (
        <CustomizedNotification notification={notification} setNotification={setNotification} />
      )}
    </>
  );
}
