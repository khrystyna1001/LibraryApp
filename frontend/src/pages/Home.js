import React, {Component} from 'react';
import NavBar from '../components/Navigation';

import { 
    MDBCard
} from 'mdb-react-ui-kit'

class Home extends Component {
    render() {
         return (
            <React.Fragment>
                <NavBar />
                <MDBCard alignment='center' className='m-4'>This is some text within a card body.</MDBCard>
            </React.Fragment>
        )
    }
   
}

export default Home;