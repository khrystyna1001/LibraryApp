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
    const currentRole = user.role && user.role ? user.role : 'visitor';
    const isAdmin = currentRole === 'admin';

//     const defaultAuthor = {
//         id: 'New Author - ID assigned on creation',
//         first_name: '',
//         last_name: '',
//         role: 'AUTHOR',
//         full_name: '',
//         books_written: [],
//     };
    
//     /**
//      * Handles removing a book from the book list.
//      * @param {string} bookIdToRemove - The ID of the book to remove.
//      */
//     const handleRemoveBook = (bookIdToRemove) => {
//         setFormData((prevFormData) => ({
//             ...prevFormData,
//             books_written: prevFormData.books_written.filter(
//                 (book) => book.id !== bookIdToRemove
//             ),
//         }));
//     };

//     const bookOptions = fetchedBooks.map(book => ({
//         key: book.id,
//         text: book.title,
//         value: book.id,
//     }));

//     const fetchBooks = async () => {
        
//         if (!user.isAuthenticated) {
//              return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             const fetchedBooks = await getItems('books', token);

//             if (typeof fetchedBooks === 'object' && fetchedBooks !== null) {
//                 setFetchedBooks(fetchedBooks);
//             } else {
//                 console.error("API did not return any books:", fetchedBooks);
//                 setFetchedBooks([]);
//             }
//         } catch (error) {
//             console.error("Failed to fetch books:", error);
//             setFetchedBooks([]);
//         }
//     }

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: value,
//         });
//     };

//     const handleAddBook = (selectedBookId) => {
//         const newBookObject = fetchedBooks.find(
//             (b) => b.id === selectedBookId
//         );
        
//         if (newBookObject) {
//             setFormData((prevFormData) => {
//                 const isBookAlreadyAdded = prevFormData.books_written.some(
//                     (b) => b.id === newBookObject.id
//                 );

//                 if (!isBookAlreadyAdded) {
//                     return {
//                         ...prevFormData,
//                         books_written: [...prevFormData.books_written, newBookObject],
//                     };
//                 }

//                 return prevFormData;
//             });
//         } else {
//             console.error(`Book with ID ${selectedBookId} not found.`);
//         }
//     }

//     const handleFormSubmit = async () => {
//         const bookIds = formData.books_written
//         .filter(book => book && book.id !== null && book.id !== undefined)
//         .map(book => book.id);

//         const updatedAuthor = {
//             ...(isAdding ? {} : { id: formData.id }), 
//             first_name: formData.first_name,
//             last_name: formData.last_name,
//             role: formData.role,
//             full_name: formData.first_name + " " + formData.last_name,
//             books_written: bookIds,
//         };

//         onSave(updatedAuthor);
//     };

//     useEffect(() => {

//         if (!isOpen) {
//             setFormData(null);
//             return;
//         }
    
//         if (currentAuthor && fetchedBooks.length === 0) {
//             return;
//         }
    
//         if (currentAuthor) {
//             const safeBooksWritten = Array.isArray(currentAuthor.books_written) 
//                 ? currentAuthor.books_written 
//                 : [];
    
//             const booksAsObjects = safeBooksWritten
//                 .map(bookIdOrObject => {
//                     const id = typeof bookIdOrObject === 'object' 
//                         ? bookIdOrObject.id 
//                         : bookIdOrObject;
                        
//                     return fetchedBooks.find(book => book.id === id);
//                 })
//                 .filter(book => book);
    
//             setFormData({
//                 id: currentAuthor.id,
//                 first_name: currentAuthor.first_name || '',
//                 last_name: currentAuthor.last_name || '',
//                 role: currentAuthor.role || 'Author',
//                 full_name: currentAuthor.full_name || '',
//                 books_written: booksAsObjects
//             });
//         } else {
//             setFormData(defaultAuthor);
//         }
//     }, [currentAuthor, isOpen, fetchedBooks]);

//     useEffect(() => {
//         if (isOpen) { 
//             fetchBooks();
//         }
//     }, [isOpen, user.isAuthenticated]);

//     if (!formData) {
//         return null;
//     };

//     const modalTitle = isAdding ? 'Add New Author' : 'Edit Author Profile';
//     const submitText = isAdding ? 'Create Author' : 'Save Changes';

//     return (
//         <Modal
//             onClose={onClose}
//             open={isOpen}
//             size='small'
//         >
//             <ModalHeader>
//                 <Icon name={isAdding ? 'add' : 'edit'} /> 
//                 {modalTitle}
//             </ModalHeader>
//             <ModalContent>
//                 <Form>
//                     <FormField>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             Author ID
//                         </label>
//                         <Input 
//                             value={formData.id || 'N/A'} 
//                             disabled
//                             icon='hashtag'
//                             iconPosition='left'
//                             fluid
//                         />
//                     </FormField>

//                     <FormField required>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             First Name
//                         </label>
//                         <Input
//                             name='first_name'
//                             type='text'
//                             onChange={handleInputChange} 
//                             value={formData.first_name || ''} 
//                             disabled={!isAdmin}
//                             placeholder='Enter first name title'
//                             fluid
//                         />
//                     </FormField>

//                     <FormField required>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             Last Name
//                         </label>
//                         <Input
//                             name='last_name'
//                             type='text'
//                             onChange={handleInputChange} 
//                             value={formData.last_name || ''} 
//                             disabled={!isAdmin}
//                             placeholder='Enter last name title'
//                             fluid
//                         />
//                     </FormField>

//                     <FormField>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             Role
//                         </label>
//                         <Input
//                             name='role'
//                             type='text'
//                             value={formData.role || ''} 
//                             disabled
//                             fluid
//                         />
//                     </FormField>

//                     <FormField>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             Full Name
//                         </label>
//                         <Input
//                             name='full_name'
//                             type='text'
//                             value={formData.full_name || ''} 
//                             disabled
//                             fluid
//                         />
//                     </FormField>

//                     <Divider />

//                     <Header as='h4' dividing>
//                         <Icon name='book' />
//                         Books
//                     </Header>

//                     <FormField>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600' }}>
//                             Add Book
//                         </label>
//                         <Dropdown
//                             placeholder='Select Book to Add'
//                             fluid
//                             selection
//                             options={bookOptions}
//                             value={''}
//                             onChange={(e, { value }) => handleAddBook(value)} 
//                             disabled={!isAdmin}
//                             search
//                         />
//                     </FormField>
//                     <FormField>
//                         <label style={{ fontSize: '0.9em', color: '#666', fontWeight: '600', marginBottom: '8px', display: 'block' }}>
//                             Current Books ({formData.books_written.length || '0'})
//                         </label>
//                         <div style={{ 
//                             display: 'flex', 
//                             flexWrap: 'wrap', 
//                             gap: '8px',
//                             minHeight: '40px',
//                             padding: '10px',
//                             backgroundColor: '#f8f9fa',
//                             borderRadius: '4px',
//                             border: '1px solid #e0e0e0'
//                         }}>
//                             {formData.books_written.length > 0 ? (
//                                 formData.books_written.map(book => (
//                                     <Label 
//                                         key={book.id} 
//                                         size='large' 
//                                         color='blue'
//                                     >
//                                         {book.title}
//                                         {isAdmin && (
//                                             <Icon 
//                                                 name='delete' 
//                                                 onClick={() => handleRemoveBook(book.id)} 
//                                                 style={{ cursor: 'pointer', marginLeft: '5px' }}
//                                             />
//                                         )}
//                                     </Label>
//                                 ))
//                             ) : (
//                                 <span style={{ color: '#999', fontStyle: 'italic' }}>
//                                     No books assigned yet.
//                                 </span>
//                             )}
//                         </div>
//                     </FormField>

//                     {!isAdmin && (
//                         <div style={{ 
//                             marginTop: '16px', 
//                             padding: '12px', 
//                             backgroundColor: '#fff3cd', 
//                             borderRadius: '6px',
//                             border: '1px solid #ffc107',
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: '8px'
//                         }}>
//                             <Icon name='lock' color='orange' />
//                             <span style={{ fontSize: '0.9em', color: '#856404' }}>
//                                 Only administrators can edit author information
//                             </span>
//                         </div>
//                     )}
//                 </Form>
//             </ModalContent>
//             <ModalActions style={{ backgroundColor: '#fafafa' }}>
//                 <Button onClick={onClose} basic>
//                     <Icon name='close' />
//                     Cancel
//                 </Button>
//                 <Button 
//                     primary
//                     onClick={handleFormSubmit} 
//                     disabled={!isAdmin || isSaving}
//                     loading={isSaving}
//                 >
//                     <Icon name='check' />
//                     {isSaving ? 'Saving...' : submitText}
//                 </Button>
//             </ModalActions>
//         </Modal>
//     )
// }
}
export default IssueBookModal;