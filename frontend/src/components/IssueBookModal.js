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
    Divider,
    Header
} from 'semantic-ui-react';

import { useAuth } from '../utils/authContext';
import { getItem, getItems } from '../api';

const IssueBookModal = ({ currentBook, isOpen, onClose, onSave, isSaving, isAdding }) => {

    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [fetchedBooks, setFetchedBooks] = useState([]);
    const [fetchedUsers, setFetchedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentBooks, setCurrentBooks] = useState(null);
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

    const defaultIssue = {
        id: 'Issue Book - id assigned at creation',
        book_id: currentBook?.id || null,
        visitor_id: currentUser?.id || null
    };

    const bookOptions = fetchedBooks.map(book => ({
        key: book.id,
        text: book.title,
        value: book.id,
    }));

    const userOptions = fetchedUsers.map(user => ({
        user: user.id,
        text: user.username,
        value: user.id,
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

    const fetchUsers = async () => {
        
        if (!user.isAuthenticated) {
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const fetchedUsers = await getItems('users', token);

            if (typeof fetchedUsers === 'object' && fetchedUsers !== null) {
                setFetchedUsers(fetchedUsers);
            } else {
                console.error("API did not return any users:", fetchedUsers);
                setFetchedUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            setFetchedUsers([]);
        }
    }

    const selectUser = (e, { value }) => {
        const selectedUser = fetchedUsers.find(u => u.id === value);
        setCurrentUser(selectedUser);
        setFormData(prev => ({
            ...prev,
            visitor_id: value
        }));
    }

    const selectBook = (e, { value }) => {
        const selectedBook = fetchedBooks.find(b => b.id === value);
        setCurrentBooks(selectedBook);
        setFormData(prev => ({
            ...prev,
            book_id: value
        }));
    }

    const handleFormSubmit = async () => {
        const issuedBook = {
            id: formData.book_id,
            user_id: formData.visitor_id
        };
        onSave(issuedBook);
    };

    useEffect(() => {

        if (!isOpen) {
            setFormData(null);
            return;
        }
    
        if (currentBook && fetchedBooks.length === 0 && fetchedUsers.length === 0) {
            return;
        }
    
        if (currentBooks && currentUser) {
            setFormData({
                id: currentBooks.id,
                book_id: currentBooks.id || '',
                visitor_id: currentUser.id || '', 
            });
        } else {
            setFormData({
                id: defaultIssue.id,
                book_id: defaultIssue.book_id || '',
                visitor_id: defaultIssue.visitor_id || ''
            });
        }
    }, [currentBook, isOpen, fetchedBooks, fetchedUsers, currentUser]);

    useEffect(() => {
        if (isOpen) { 
            fetchBooks();
            fetchUsers();
        }
    }, [isOpen, user.isAuthenticated]);

    useEffect(() => {
        setCurrentBooks(currentBook);
        setCurrentUser(user);
    }, [currentBook, user]);

    if (!formData) {
        return null;
    };

    const modalTitle = 'Issue Book';
    const submitText = 'Issue';
    const bookValue = currentBooks?.id;
    const userValue = currentUser?.id;

    return (
        <Modal
            onClose={onClose}
            open={isOpen}
            size='small'
        >
            <ModalHeader>
                <Icon name={isAdding ? 'add' : 'edit'} /> 
                {modalTitle}
            </ModalHeader>
            <ModalContent>
                <Form>
                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Issue ID
                        </label>
                        <Input 
                            value={formData?.id || 'N/A'} 
                            disabled
                            icon='hashtag'
                            iconPosition='left'
                            fluid
                        />
                    </FormField>

                    <Divider />

                    <Header as='h4' dividing>
                        <Icon name='book' />
                        Select Book
                    </Header>

                    <FormField>
                        <Dropdown
                            placeholder='Select Book'
                            fluid
                            selection
                            options={bookOptions}
                            onChange={selectBook}
                            value={bookValue}
                            disabled={!isAdmin}
                            search
                        />
                    </FormField>

                    <Divider />

                    <Header as='h4' dividing>
                        <Icon name='user' />
                        Select Visitor
                    </Header>

                    <FormField>
                        <Dropdown
                            placeholder='Select Visitor'
                            fluid
                            selection
                            options={userOptions}
                            value={userValue}
                            onChange={selectUser}
                            disabled={!isAdmin}
                            search
                        />
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
                    disabled={!isAdmin || isSaving}
                    loading={isSaving}
                    onClick={handleFormSubmit} 
                >
                    <Icon name='check' />
                    {isSaving ? 'Saving...' : submitText}
                </Button>
            </ModalActions>
        </Modal>
    )
}

export default IssueBookModal;