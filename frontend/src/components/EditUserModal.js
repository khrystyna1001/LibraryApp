import React, { useState, useEffect, useCallback } from 'react';

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
} from 'semantic-ui-react';

import { useAuth } from '../utils/authContext';
import { getItem, createItem, getItems, deleteItem } from '../api';

const UserEditModal = ({ currentUser, isOpen, onClose, onSave, isSaving, isAdding }) => {

    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [tokens, setTokens] = useState([]);
    const [isLoadingTokens, setIsLoadingTokens] = useState(false);
    const currentRole = user.role && user.role ? user.role : 'Visitor';
    const isAdmin = currentRole === 'admin';

    const generateTokenString = (length = 40) => {
        let newToken = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            newToken += characters.charAt(randomInd);
        }
        return newToken;
    }
    
    const defaultUser = {
        id: 'New User - ID assigned on creation',
        username: '',
        role: 'Visitor',
    };

    const handleGenerateTokenClick = () => {
        const newToken = generateTokenString();
        setFormData(prevData => ({
            ...prevData,
            currentToken: newToken,
        }));
    }

    const fetchTokensData = useCallback(async () => {
        if (!isOpen) return;
        setIsLoadingTokens(true);
        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            const fetchedTokens = await getItems('tokens', token);

            if (Array.isArray(fetchedTokens)) {
                setTokens(fetchedTokens);
            }
        } catch (e) {
            console.error("Failed to fetch all tokens:", e);
            setTokens([]);
        } finally {
            setIsLoadingTokens(false);
        }
    }, [isOpen]);
    
    const groupOptions = [
        { key: 'a', text: 'Admin', value: 'admin' },
        { key: 'l', text: 'Librarian', value: 'librarian' },
        { key: 'v', text: 'Visitor', value: 'visitor' },
    ];
    
    const getRoleColor = (role) => {
        switch(role) {
            case 'admin': return 'red';
            case 'librarian': return 'blue';
            case 'visitor': return 'grey';
            default: return 'grey';
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchTokensData();
        }
    }, [isOpen, fetchTokensData]);

    useEffect(() => {
        if (!isOpen) {
            setFormData(null);
            setTokens([]);
            return;
        }
    
        if (currentUser) {
            const userRole = (currentUser.groups && currentUser.groups[0]) 
                ? currentUser.groups[0] 
                : 'visitor';
            
            setFormData({
                id: currentUser.id,
                username: currentUser.username,
                role: userRole, 
                currentToken: 'Loading...'
            });

        } else {
            const initialToken = generateTokenString();
            setFormData({
                ...defaultUser,
                currentToken: initialToken,
                password: initialToken 
            });
        }
    }, [currentUser, isOpen]);

    useEffect(() => {
        if (isOpen && currentUser && !isLoadingTokens) {
            const tokenData = tokens.find(token => token.user === currentUser.id);
            const tokenKey = tokenData?.key;
            
            setFormData(prevData => {
                if (!prevData) return null;
                const tokenValue = tokenKey || 'N/A';
                if (prevData.currentToken === 'Loading...' || prevData.currentToken !== tokenValue) {
                    return ({
                        ...prevData,
                        currentToken: tokenValue,
                        tokenId: tokenData?.key 
                    });
                }
                return prevData;
            });
        }
    }, [isOpen, currentUser, tokens, isLoadingTokens]);

    if (!formData) return null; 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleRoleOnChange = (role) => {
        console.log('Changing role to:', role, 'Current formData:', formData);
        setFormData({
            ...formData,
            role: role,
        });
        console.log('Updated formData:', { ...formData, role: role });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('token') || 'mock_token_123';

            const userPayload = {
                username: formData.username,
                groups: [formData.role],
                password: formData.currentToken, 
            };

            if (isAdding) {
                onSave(userPayload);
            } else {
                const currentTokenObject = tokens.find(t => t.user === currentUser.id);

                let tokenPayload = { 
                    key: formData.currentToken,
                    user: currentUser.id,
                    created: Date.now(),
                };
                
                if (currentTokenObject) {
                    if (formData.currentToken !== currentTokenObject.key) {
                        await deleteItem('tokens', currentTokenObject.key, authToken);
                        await createItem('tokens', authToken, tokenPayload);
                    }
                } else {
                    await createItem('tokens', authToken, tokenPayload);
                }

                const updatedUser = {
                    username: formData.username,
                    groups: [formData.role],
                    password: formData.currentToken, 
                };
                onSave({...currentUser, ...updatedUser}); 
            }
        } catch (e) {
            console.error("User save process failed:", e)
        }
    };

    if (!formData) {
        return null;
    };

    const modalTitle = isAdding ? 'Add New User' : 'Edit User Profile';
    const submitText = isAdding ? 'Create User' : 'Save Changes';

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
                            User ID
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
                            Username
                        </label>
                        <Input
                            name='username'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.username || ''} 
                            disabled={!isAdmin}
                            icon='user'
                            iconPosition='left'
                            placeholder='Enter username'
                            fluid
                        />
                    </FormField>

                    <FormField required>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
                            Token
                        </label>
                        <Input
                            name='token'
                            type='text'
                            onChange={handleInputChange} 
                            value={formData.currentToken || ''} 
                            disabled={!isAdmin}
                            placeholder='N/A'
                            fluid
                            action={
                                <Button onClick={handleGenerateTokenClick}disabled={!isAdmin || (!isAdding && !currentUser)} 
                                type='button'>
                                {isAdding ? 'Generate' : 'New Token'}
                                </Button>
                            }
                        />
                        
                    </FormField>

                    <Divider />

                    <FormField>
                        <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                            User Role
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
                                color={getRoleColor(formData.role)} 
                                size='large'
                                style={{ textTransform: 'capitalize' }}
                            >
                                <Icon name='shield' />
                                {formData.role || 'Visitor'}
                            </Label>
                            <div style={{ flex: 1 }} />
                            <Dropdown
                                button
                                disabled={!isAdmin}
                                className='icon'
                                labeled
                                icon='edit'
                                text={isAdmin ? 'Change Role' : 'Locked'}
                                color={isAdmin ? 'teal' : 'grey'}
                            >
                                <DropdownMenu>
                                    {groupOptions.map(option => (
                                        <DropdownItem
                                            key={option.key}
                                            text={option.text}
                                            value={option.value}
                                            icon='shield'
                                            onClick={() => handleRoleOnChange(option.value)}
                                        />
                                    ))}
                                </DropdownMenu>
                            </Dropdown>
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
                                Only administrators can edit user information
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
                    {isSaving ? 'Saving...' : submitText}
                </Button>
            </ModalActions>
        </Modal>
    )
}

export default UserEditModal;