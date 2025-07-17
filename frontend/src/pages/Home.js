import React from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';

function Home() {
    return (
        <React.Fragment>
            <NavBar />
            <Card body className='m-3'>This is some text within a card body.</Card>
        </React.Fragment>
    )
}

export default Home;