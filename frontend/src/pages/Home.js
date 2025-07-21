import React, {Component} from 'react';
import NavBar from '../components/Navigation';
import Card from 'react-bootstrap/Card';

class Home extends Component {
    render() {
         return (
            <React.Fragment>
                <NavBar />
                <Card body className='m-3 mx-5 px-3'>This is some text within a card body.</Card>
            </React.Fragment>
        )
    }
   
}

export default Home;