import React, { useState } from 'react';
import { Menu, 
  Button 
} from 'semantic-ui-react';

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

      <Menu>
          <Button
            onClick={toggleSidebar} 
            className="navbar-toggler"
            type="button"
            noRipple
            aria-expanded={isOpen} 
            aria-label="Toggle navigation"
          >
          </Button>
      </Menu>
    </>
  );
}
