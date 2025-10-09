import React from 'react';
import ReactDOM from 'react-dom';
import { 
  MenuItem,
  Icon,
  Menu,
  Button,
} from 'semantic-ui-react';

const AdminNavbar = () => {
  const [visible, setVisible] = React.useState(false)

  const handleVisibility = () => {
    setVisible(!visible)
  }

return(
    <>
      <Button style={{ visibility: visible ? 'hidden' : 'visible', marginLeft: '15px', marginTop: '10px', marginBottom: '10px' }} onClick={handleVisibility}>
        <Icon name='bars'></Icon>
        Admin Manage
      </Button>
      
      {visible && ReactDOM.createPortal(
        <>
          <div 
            onClick={handleVisibility}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              zIndex: 999
            }}
          />
          
          <div style={{
            position: 'fixed',
            top: '50px',
            bottom: 0,
            left: 0,
            width: '150px',
            backgroundColor: 'white',
            zIndex: 1000,
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            overflowY: 'auto'
          }}>
            <Menu vertical fluid icon='labeled' style={{ border: 'none', boxShadow: 'none', margin: 0 }}>
              <MenuItem as='a' href='/admin/books'>
                <Icon name='book' />
                Books
              </MenuItem>
              <MenuItem as='a' href='/admin/authors'>
                <Icon name='user' />
                Authors
              </MenuItem>
              <MenuItem as='a' href='/admin/users'>
                <Icon name='group' />
                Users
              </MenuItem>
              <MenuItem>
                <Button onClick={handleVisibility} basic fluid>
                  <Icon name='close' />
                </Button>
              </MenuItem>
            </Menu>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default AdminNavbar;