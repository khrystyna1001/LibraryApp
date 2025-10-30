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
    const [cBook, setcBook] = useState(null);
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

    const defaultIssue = {
        id: 'Issue Book - id assigned at creation',
        book_id: null,
        visitor_id: null
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const selectUser = (user) => {
        setCurrentUser(fetchedUsers.find(u => user === u))
    }

    const selectBook = (book) => {
        setcBook(fetchedBooks.find(b => book === b))
    }

    useEffect(() => {

        if (!isOpen) {
            setFormData(null);
            return;
        }
    
        if (currentBook && fetchedBooks.length === 0 && fetchedUsers.length === 0) {
            return;
        }
    
        if (currentBook) {
            setFormData({
                id: currentBook.id,
                book_id: cBook.id || '',
                visitor_id: currentUser.id || '',
            });
        } else {
            setFormData(defaultIssue);
        }
    }, [currentBook, isOpen, fetchedBooks, fetchedUsers]);

    useEffect(() => {
        if (isOpen) { 
            fetchBooks();
            fetchUsers();
            selectUser();
        }
    }, [isOpen, user.isAuthenticated]);

    if (!formData) {
        return null;
    };

    const modalTitle = 'Issue Book';
    const submitText = 'Issue';

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
                            value={formData.id || 'N/A'} 
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
                            value={''}
                            onChange={(e, data) => selectBook(data.value)}
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
                            value={''}
                            onChange={() => selectUser(user)}
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
                >
                    <Icon name='check' />
                    {isSaving ? 'Saving...' : submitText}
                </Button>
            </ModalActions>
        </Modal>
    )
}

export default IssueBookModal;