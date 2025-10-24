import React, { Component } from 'react';
import NavBar from '../components/Navigation';
import Footer from '../components/Footer';
import {
    Card,
    CardContent,
} from 'semantic-ui-react';

class Home extends Component {
    render() {
         return (
            <React.Fragment>
                <NavBar />
                <Card style={{ margin: 'auto', marginTop: '45px', width: '900px' }}>
                    <CardContent>This system allows you to effortlessly manage your book catalog,
                                keep track of authors, and administer user accounts with ease.
                                Use the navigation above to begin exploring your collection [HOME].</CardContent>
                </Card>
                <Footer />
            </React.Fragment>
        )
    }
   
}
export default Home;