import React, { useState } from 'react';
import { MDBBtn, MDBIcon, MDBNavbar, MDBContainer } from 'mdb-react-ui-kit';

export default function AdminSidebarToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <div className={`custom-collapse ${isOpen ? 'open' : ''}`}>
        <div className="bg-dark p-4"> 
          <h5 className="text-white h4">VIEW DASHBOARD</h5>
          <ul className='text-white'>
            <li><a className='text-white' href='/admin/books'>Books</a></li>
            <li><a className='text-white' href='/admin/authors'>Authors</a></li>
            <li><a className='text-white' href='/admin/users'>Users</a></li>
          </ul>
        </div>
    </div>

      <MDBNavbar dark bgColor='dark'>
        <MDBContainer fluid>
          <MDBBtn
            onClick={toggleSidebar} 
            className="navbar-toggler"
            type="button"
            noRipple
            aria-expanded={isOpen} 
            aria-label="Toggle navigation"
          >
            <MDBIcon fas icon='bars' />
          </MDBBtn>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}
