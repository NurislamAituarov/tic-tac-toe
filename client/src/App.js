import { Navigate, Route, Routes } from 'react-router-dom';
import { Squares } from './components/Squares/Squares';

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<Squares />}></Route>
      <Route path="/" element={<Navigate to={`${(+new Date()).toString(16)}`} />} />
    </Routes>
  );
}

export default App;
