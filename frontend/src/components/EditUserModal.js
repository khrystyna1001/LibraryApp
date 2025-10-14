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
} from 'semantic-ui-react';

import { useAuth } from '../utils/authContext';
import { getItem, updateItem, getItems } from '../api';

const UserEditModal = ({ currentUser, isOpen, onClose, onSave, isSaving }) => {

    const { user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [tokens, setTokens] = useState([]);
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

    const handleTokenFind = async (user) => {
        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            const fetchedTokens = await getItems('tokens', token);

            if (fetchedTokens) {
                setTokens(fetchedTokens);
            }

            const t = tokens.find(token => token.user === user.id)?.key
            console.log(t)
            return t;

        } catch (e) {
            console.log("Failed to fetch user tokens:", e)
        }
    }

    const generateToken = (length) => {
        let newToken = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            newToken += characters.charAt(randomInd);
        }

        setFormData({
            ...formData,
            currentToken: newToken || ''
        });
        return newToken;
    }
    
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
            console.log('Setting initial formData (Token Loading...):', userRole);

            const fetchToken = async () => {
                const tokenKey = await handleTokenFind(currentUser);
                
                setFormData(prevData => ({
                    ...prevData,
                    currentToken: tokenKey || ''
                }));
            }

            fetchToken();
        }
    }, [currentUser]);

    if (!formData) return null; 

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const updatedUser = {
            username: formData.username,
            role: [formData.role], 
            // currentToken: handleTokenFind(currentUser)
        };

        try {
            const token = localStorage.getItem('token') || 'mock_token_123';
            
            const response = await updateItem(
                "users", 
                formData.id, 
                token, 
                updatedUser
            );
            
            console.log('API Response:', response);
            
            if (response) {
                console.log("Updated User Data Successfully", updatedUser);
                onSave({...currentUser, ...updatedUser});
                onClose();
            }
        } catch (e) {
            console.error("Failed to update user data:", e.response ? e.response.data : e);
        }
    };

    const handleRoleOnChange = (role) => {
        console.log('Changing role to:', role, 'Current formData:', formData);
        setFormData({
            ...formData,
            role: role,
        });
        console.log('Updated formData:', { ...formData, role: role });
    }

    

    return (
        <Modal
            onClose={onClose}
            open={isOpen}
            size='small'
        >
            <ModalHeader>
                <Icon name='user circle' />
                Edit User Profile
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
                                <Button>
                                    Generate Token
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
                                {formData.role || 'visitor'}
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </ModalActions>
        </Modal>
    )
}

export default UserEditModal;