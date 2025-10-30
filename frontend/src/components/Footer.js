import React from 'react';
import { Segment, 
    Container,
    List,
} from 'semantic-ui-react';
  

function Footer() {
    return(
        <div style={{ width: '100%', marginTop: "180px" }}>
            <Segment inverted vertical style={{ padding: '5em 0em' }}>
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