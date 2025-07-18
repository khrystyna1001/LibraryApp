import React from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';

function Books() {
    return (
        <React.Fragment>
            <NavBar />
            <Card body className='m-3 mx-5 px-3'>This is some text within a card body in the BOOKS page.</Card>
        </React.Fragment>
    )
}

export default Books;