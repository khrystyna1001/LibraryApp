import React from 'react';
import { Segment, 
    Container, 
    Grid, 
    List, 
    Header, 
    Divider 
} from 'semantic-ui-react';
  

function Footer() {
    return(
        <div style={{ position: 'fixed', width: '100%', bottom: '0' }}>
            <Segment inverted vertical style={{ margin: '25em 0em 0em 0em', padding: '5em 0em' }}>
                <Container textAlign='center'>
                    <List horizontal inverted divided link size='small'>
                    <List.Item as='a' href='#'>
                        Site Map
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Contact Us
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Terms and Conditions
                    </List.Item>
                    <List.Item as='a' href='#'>
                        Privacy Policy
                    </List.Item>
                    </List>
                </Container>
            </Segment>
        </div>
    )
}

export default Footer;