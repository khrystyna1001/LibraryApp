import React from 'react'
import {
  ModalHeader,
  ModalActions,
  Button,
  Modal,
} from 'semantic-ui-react'
import { deleteItem } from '../api';

function DeleteModal({ item, itemName, apiItemName, isOpen, onClose, onDelete }) {
  const handleDeleteItem = async (e) => {
    e.preventDefault();
          const token = localStorage.getItem('token') || 'mock-token';
          const { id } = item;
  
          try {
              await deleteItem(`${apiItemName}`, id, token);
              onDelete(id); 
              onClose();
          } catch (error) {
              console.error(`Failed to delete ${itemName} via API:`, error);
          } finally {
              onClose();
          }
      }

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
    >
      <ModalHeader>Are you sure you want to delete {itemName}?</ModalHeader>
      <ModalActions>
        <Button color='black' onClick={onClose}>
          No
        </Button>
        <Button
          content="Yes"
          labelPosition='right'
          icon='checkmark'
          onClick={handleDeleteItem}
          negative
        />
      </ModalActions>
    </Modal>
  )
}

export default DeleteModal;