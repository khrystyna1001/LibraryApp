import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import { 
    MDBCard
} from 'mdb-react-ui-kit'

class About extends Component {
    render() {
         return (
            <React.Fragment>
                <NavBar />
                <MDBCard alignment='center' className='m-4'>This is some text within a card body in the ABOUT page.</MDBCard>
            </React.Fragment>
        )
    }
   
}
export default About;