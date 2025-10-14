import React, { useState, useEffect } from 'react';

import {
    Modal,
    ModalHeader,
    ModalContent,
    ModalActions,
    Button,
    Icon,
    Input,
    Form,
    FormField,
    Dropdown,
    Label,
    Divider,
    FormTextArea,
    Header
} from 'semantic-ui-react';

import { useAuth } from '../utils/authContext';
import { getItem, getItems, updateItem } from '../api';

const EditAuthorModal = ({ currentAuthor, isOpen, onClose, onSave, isSaving }) => {

    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [fetchedBooks, setFetchedBooks] = useState([]);
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

    const handleAddBook = (selectedBookId) => {
        const newBookObject = fetchedBooks.find(
            (a) => a.id === selectedBookId
        );
        
        if (newBookObject) {
            setFormData((prevFormData) => {
                const isBookAlreadyAdded = prevFormData.books_written.some(
                    (book) => book.id === newBookObject.id
                );

                if (!isBookAlreadyAdded) {
                    return {
                        ...prevFormData,
                        author: [...prevFormData.books_written, newBookObject],
                    };
                }

                return prevFormData;
            });
        } else {
            console.error(`Book with ID ${selectedBookId} not found.`);
        }
    }
    
    /**
     * Handles removing an author from the author list.
     * @param {string} bookIdToRemove - The ID of the author to remove.
     */
    const handleRemoveBook = (bookIdToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            books_written: prevFormData.books_written.filter(
                (book) => book.id !== bookIdToRemove
            ),
        }));
    };

    const bookOptions = fetchedBooks.map(book => ({
        key: book.id,
        text: book.title,
        value: book.id,
    }));

    const fetchBooks = async () => {
        
        if (!user.isAuthenticated) {
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const fetchedBooks = await getItems('books', token);

            if (typeof fetchedBooks === 'object' && fetchedBooks !== null) {
                setFetchedBooks(fetchedBooks);
            } else {
                console.error("API did not return any books:", fetchedBooks);
                setFetchedBooks([]);
            }
        } catch (error) {
            console.error("Failed to fetch books:", error);
            setFetchedBooks([]);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async () => {
        const bookIds = formData.books_written.map(book => book.id);

        const updatedAuthor = {
            ...currentAuthor, 
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            full_name: formData.first_name + " " + formData.last_name,
            books_written: bookIds,
        };

        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            
            const response = await updateItem(
                "authors", 
                formData.id, 
                token, 
                updatedAuthor,
            );
            
            console.log('API Response:', response);
            
            if (response) {
                const authorToSave = {
                    ...updatedAuthor,
                    books_written: formData.books_written
                };

                onSave(authorToSave);
                onClose();
            }
        } catch (e) {
            console.error("Failed to update author data:", e.response ? e.response.data : e);
        }
    };

    useEffect(() => {

        if (currentAuthor) {
            
            setFormData({
                id: currentAuthor.id,
                first_name: currentAuthor.first_name,
                last_name: currentAuthor.last_name,
                role: currentAuthor.role,
                full_name: currentAuthor.full_name,
                books_written: Array.isArray(currentAuthor.books_written ? currentAuthor.books_written : [currentAuthor.books_written].filter(Boolean))
            });
        }
    }, [currentAuthor]);

    useEffect(() => {
        if (isOpen) { 
            fetchBooks();
        }
    }, [isOpen, user.isAuthenticated]);

    if (!formData) {
        return null;
    };

    return (
        <Modal
            onClose={onClose}
            open={isOpen}
            size='small'
        >
            <ModalHeader>
                <Icon name='user circle' />
                Edit Author Profile
            </ModalHeader>
            <ModalContent>
                <Form>
                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Author ID
                        </label>
                        <Input 
                            value={formData.id || 'N/A'} 
                            disabled
                            icon='hashtag'
                            iconPosition='left'
                            fluid
                        />
                    </FormField>

                    <FormField required>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            First Name
                        </label>
                        <Input
                            name='first name'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.first_name || ''} 
                            disabled={!isAdmin}
                            icon='user'
                            iconPosition='left'
                            placeholder='Enter first name title'
                            fluid
                        />
                        <Input
                            name='last name'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.last_name || ''} 
                            disabled={!isAdmin}
                            placeholder='Enter last name title'
                            fluid
                        />
                    </FormField>

                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Description
                        </label>
                        <FormTextArea
                            name='role'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.role || ''} 
                            disabled
                            iconPosition='left'
                            fluid
                        />
                    </FormField>

                    <FormField required>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Full Name
                        </label>
                        <Input
                            name='full name'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.full_name || ''} 
                            disabled
                            fluid
                        />
                    </FormField>

                    <Divider />

                    <Header as='h4' dividing>
                        <Icon name='book' />
                        Books
                    </Header>

                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Add Book
                        </label>
                        <Dropdown
                            placeholder='Select Book to Add'
                            fluid
                            selection
                            options={bookOptions}
                            value={''}
                            onChange={(e, { value }) => handleAddBook(value)} 
                            disabled={!isAdmin}
                            search
                        />
                    </FormField>
                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                            Current Books ({formData.books_written.length})
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: '8px',
                            minHeight: '40px',
                            padding: '10px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e0e0e0'
                        }}>
                            {formData.books_written.length > 0 ? (
                                formData.books_written.map(book => (
                                    <Label 
                                        key={book.id} 
                                        size='large' 
                                        color='blue'
                                    >
                                        {book.title}
                                        {isAdmin && (
                                            <Icon 
                                                name='delete' 
                                                onClick={() => handleRemoveBook(book.id)} 
                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                            />
                                        )}
                                    </Label>
                                ))
                            ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>
                                    No books assigned yet.
                                </span>
                            )}
                        </div>
                    </FormField>

                    {!isAdmin && (
                        <div style={{ 
                            marginTop: '16px', 
                            padding: '12px', 
                            backgroundColor: '#fff3cd', 
                            borderRadius: '6px',
                            border: '1px solid #ffc107',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Icon name='lock' color='orange' />
                            <span style={{ fontSize: '0.9em', color: '#856404' }}>
                                Only administrators can edit author information
                            </span>
                        </div>
                    )}
                </Form>
            </ModalContent>
            <ModalActions style={{ backgroundColor: '#fafafa' }}>
                <Button onClick={onClose} basic>
                    <Icon name='close' />
                    Cancel
                </Button>
                <Button 
                    primary
                    onClick={handleFormSubmit} 
                    disabled={!isAdmin || isSaving}
                    loading={isSaving}
                >
                    <Icon name='check' />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </ModalActions>
        </Modal>
    )
}

export default EditAuthorModal;