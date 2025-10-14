import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';
import { 
    Card,
    CardContent
} from 'semantic-ui-react';

class About extends Component {
    render() {
         return (
            <React.Fragment>
                <NavBar />
                <Card style={{ margin: 'auto', marginTop: '45px', width: '900px', height: '200px' }}>
                    <CardContent>This system allows you to effortlessly manage your book catalog,
                                keep track of authors, and administer user accounts with ease.
                                Use the navigation above to begin exploring your collection [ABOUT].</CardContent>
                </Card>
                <Footer />
            </React.Fragment>
        )
    }
   
}
export default About;