import React from 'react'
import {
  ModalHeader,
  ModalActions,
  Button,
  Modal,
} from 'semantic-ui-react'
import { returnBook } from '../api';

function ReturnBookModal({ item, itemName, apiItemName, isOpen, onClose, onSave }) {
  const handleReturnItem = async (e) => {
    e.preventDefault();
          const token = localStorage.getItem('token') || 'mock-token';
          const { id } = item;
          const userId = item.borrower.id;

          const returnedBookData = {
            "user_id": userId
          }
  
          try {
              const response = await returnBook(id, `${apiItemName}`, returnedBookData, token);
              onSave(response);
              onClose();
          } catch (error) {
              console.error(`Failed to return ${itemName} via API:`, error);
          } finally {
              onClose();
          }
      }

  return (
    <Modal
      onClose={onClose}
      open={isOpen}
    >
      <ModalHeader>Are you sure you want to take back {itemName}?</ModalHeader>
      <ModalActions>
        <Button color='black' onClick={onClose}>
          No
        </Button>
        <Button
          content="Yes"
          labelPosition='right'
          icon='checkmark'
          onClick={handleReturnItem}
          negative
        />
      </ModalActions>
    </Modal>
  )
}

export default ReturnBookModal;