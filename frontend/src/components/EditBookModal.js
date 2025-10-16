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
    DropdownMenu,
    DropdownItem,
    Label,
    Divider,
    FormTextArea,
    Header
} from 'semantic-ui-react';

import { useAuth } from '../utils/authContext';
import { getItem, getItems, updateItem } from '../api';

const EditBookModal = ({ currentBook, isOpen, onClose, onSave, isSaving }) => {

    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [fetchedAuthors, setFetchedAuthors] = useState([])
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

    const availabilityOptions = [
        { key: 'a', text: 'Available', value: true },
        { key: 'u', text: 'Unavailable', value: false },
    ]

    const getAvilabilityColor = (availability) => {
        switch(availability) {
            case true: return 'green';
            case false: return 'red';
            default: return 'red';
        }
    };

    const handleAddAuthor = (selectedAuthorId) => {
        const newAuthorObject = fetchedAuthors.find(
            (a) => a.id === selectedAuthorId
        );
        
        if (newAuthorObject) {
            setFormData((prevFormData) => {
                const isAuthorAlreadyAdded = prevFormData.author.some(
                    (a) => a.id === newAuthorObject.id
                );

                if (!isAuthorAlreadyAdded) {
                    return {
                        ...prevFormData,
                        author: [...prevFormData.author, newAuthorObject],
                    };
                }

                return prevFormData;
            });
        } else {
            console.error(`Author with ID ${selectedAuthorId} not found.`);
        }
    }
    
    /**
     * Handles removing an author from the author list.
     * @param {string} authorIdToRemove - The ID of the author to remove.
     */
    const handleRemoveAuthor = (authorIdToRemove) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            author: prevFormData.author.filter(
                (a) => a.id !== authorIdToRemove
            ),
        }));
    };

    const authorOptions = fetchedAuthors.map(author => ({
        key: author.id,
        text: author.full_name,
        value: author.id,
    }));

    const fetchAuthors = async () => {
        
        if (!user.isAuthenticated) {
             return;
        }

        try {
            const token = localStorage.getItem('token');
            const fetchedAuthors = await getItems('authors', token);

            if (typeof fetchedAuthors === 'object' && fetchedAuthors !== null) {
                setFetchedAuthors(fetchedAuthors);
            } else {
                console.error("API did not return any authors:", fetchedAuthors);
                setFetchedAuthors([]);
            }
        } catch (error) {
            console.error("Failed to fetch authors:", error);
            setFetchedAuthors([]);
        }
    }

    const handleAvailabilityOnChange = (availability) => {
        console.log('Changing availability to:', availability, 'Current formData:', formData);
        setFormData((prevFormData) => ({
            ...prevFormData,
            is_available: availability,
        }));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async () => {
        const authorIds = formData.author.map(a => a.id);

        const updatedBook = {
            ...currentBook, 
            title: formData.title,
            description: formData.description,
            published_date: formData.published_date,
            is_available: formData.is_available,
            author: authorIds,
        };

        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            
            const response = await updateItem(
                "books", 
                formData.id, 
                token, 
                updatedBook,
            );
            
            console.log('API Response:', response);
            
            if (response) {
                onSave(updatedBook);
                onClose();
            }
        } catch (e) {
            console.error("Failed to update book data:", e.response ? e.response.data : e);
        }
    };

    useEffect(() => {

        if (currentBook) {
            
            setFormData({
                id: currentBook.id,
                title: currentBook.title,
                description: currentBook.description,
                published_date: currentBook.published_date,
                is_available: currentBook.is_available,
                author: Array.isArray(currentBook.author) ? currentBook.author : [currentBook.author].filter(Boolean)
            });
        }
    }, [currentBook]);

    useEffect(() => {
        if (isOpen) { 
            fetchAuthors();
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
                Edit Book Profile
            </ModalHeader>
            <ModalContent>
                <Form>
                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Book ID
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
                            Title
                        </label>
                        <Input
                            name='title'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.title || ''} 
                            disabled={!isAdmin}
                            icon='book'
                            iconPosition='left'
                            placeholder='Enter book title'
                            fluid
                        />
                    </FormField>

                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Description
                        </label>
                        <FormTextArea
                            name='description'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.description || ''} 
                            disabled={!isAdmin}
                            iconPosition='left'
                            placeholder='Enter book title'
                            fluid
                        />
                    </FormField>

                    <FormField required>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Published Date
                        </label>
                        <Input
                            name='published_date'
                            type='date'
                            onChange={handleInputChange} 
                            value={formData.published_date || ''} 
                            disabled={!isAdmin}
                            placeholder='Enter book published date'
                            fluid
                        />
                    </FormField>

                    <FormField required>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Availability
                        </label>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            padding: '12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            border: '1px solid #e0e0e0'
                        }}>
                            <Label 
                                color={getAvilabilityColor(formData.is_available)} 
                                size='large'
                                style={{ textTransform: 'capitalize' }}
                            >
                                <Icon name='shield' />
                                {formData.is_available ? 'Available' : 'Not Available'}
                            </Label>
                            <div style={{ flex: 1 }} />
                            <Dropdown
                                button
                                disabled={!isAdmin}
                                className='icon'
                                labeled
                                icon='edit'
                                text={isAdmin ? 'Change Availability' : 'Locked'}
                                color={isAdmin ? 'teal' : 'grey'}
                            >
                                <DropdownMenu>
                                    {availabilityOptions.map(option => (
                                        <DropdownItem
                                            key={option.key}
                                            text={option.text}
                                            value={option.value}
                                            icon='shield'
                                            onClick={() => handleAvailabilityOnChange(option.value)}
                                        />
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </FormField>

                    <Divider />

                    <Header as='h4' dividing>
                        <Icon name='users' />
                        Authors
                    </Header>

                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Add Author
                        </label>
                        <Dropdown
                            placeholder='Select Author to Add'
                            fluid
                            selection
                            options={authorOptions}
                            value={''}
                            onChange={(e, { value }) => handleAddAuthor(value)} 
                            disabled={!isAdmin}
                            search
                        />
                    </FormField>
                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                            Current Authors ({formData.author.length})
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
                            {formData.author.length > 0 ? (
                                formData.author.map(a => (
                                    <Label 
                                        key={a.id} 
                                        size='large' 
                                        color='blue'
                                    >
                                        {a.full_name}
                                        {isAdmin && (
                                            <Icon 
                                                name='delete' 
                                                onClick={() => handleRemoveAuthor(a.id)} 
                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                            />
                                        )}
                                    </Label>
                                ))
                            ) : (
                                <span style={{ color: '#999', fontStyle: 'italic' }}>
                                    No authors assigned yet.
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
                                Only administrators can edit book information
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

export default EditBookModal;