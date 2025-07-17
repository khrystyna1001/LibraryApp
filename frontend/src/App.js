import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' Component={Home}></Route>
          <Route path='/nav' Component={Home}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
