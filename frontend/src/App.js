import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import About from './pages/About';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' Component={Home}></Route>
          <Route path='/about' Component={About}></Route>
          <Route path='/books' Component={Books}></Route>
          <Route path='/authors' Component={Authors}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
