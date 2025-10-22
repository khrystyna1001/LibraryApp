import Books from './pages/Books';
import Authors from './pages/Authors';
import About from './pages/About';
import Book from './pages/Book';
import Author from './pages/Author';
import Login from './pages/Login';
import PrivateRoute from './utils/privateRoute';
import UserPage from './pages/UserPage';
import Home from './pages/Home';
import UnauthorizedPage from './pages/Unauthorized'
import SearchResultsPage from './pages/SearchResult';

import { Route, Routes } from 'react-router-dom';
import AdminBooks from './pages/AdminBooks';
import AdminAuthors from './pages/AdminAuthors';
import AdminUsers from './pages/AdminUsers';
import User from './pages/User';
import NotFound from './pages/NotFound';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path='/home/' Component={Home}></Route>
          <Route path='/login/' Component={Login}></Route>
          <Route path='/about/' Component={About}></Route>
          <Route path='/books/' Component={Books}></Route>
          <Route path='/authors/' Component={Authors}></Route>
          <Route path='/books/:bookID/' Component={Book}></Route>
          <Route path='/my_profile/' Component={UserPage}></Route>
          <Route path='/authors/:authorID/' Component={Author}></Route>
          <Route path='/search' Component={SearchResultsPage}></Route>
          <Route path='/user/:userID/' Component={User}></Route>
          <Route path='/unauthorized/' Component={UnauthorizedPage}></Route>
          
          
          <Route element={<PrivateRoute allowedRoles={['admin']} />}>
            <Route path="/admin/books" element={<AdminBooks />} />
            <Route path="/admin/authors" element={<AdminAuthors />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
          
          <Route path='*' Component={NotFound}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
