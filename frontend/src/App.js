import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import About from './pages/About';
import Book from './pages/Book';
import Author from './pages/Author';
import Login from './pages/Login';

import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/' Component={Home}></Route>
          <Route path='/login' Component={Login}></Route>
          <Route path='/about' Component={About}></Route>
          <Route path='/books' Component={Books}></Route>
          <Route path='/authors' Component={Authors}></Route>
          <Route path='/books/:bookID' Component={Book}></Route>
          <Route path='/authors/:authorID' Component={Author}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
