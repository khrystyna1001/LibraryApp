import React from 'react'
import {
  ModalHeader,
  ModalActions,
  Button,
  Modal,
} from 'semantic-ui-react'
import { deleteItem } from '../api';

function DeleteUserModal({ user, isOpen, onClose, onDelete }) {
  const handleDeleteUser = async (e) => {
    e.preventDefault();
          const token = localStorage.getItem('token') || 'mock-token';
          const { id } = user;
  
          try {
              await deleteItem('users', id, token);
              onDelete(id); 
              onClose();
          } catch (error) {
              console.error("Failed to delete user via API:", error);
          }
      }

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
    >
      <ModalHeader>Are you sure you want to delete {user?.username}?</ModalHeader>
      <ModalActions>
        <Button color='black' onClick={onClose}>
          No
        </Button>
        <Button
          content="Yes"
          labelPosition='right'
          icon='checkmark'
          onClick={handleDeleteUser}
          negative
        />
      </ModalActions>
    </Modal>
  )
}

export default DeleteUserModal;