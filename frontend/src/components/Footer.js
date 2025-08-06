import React from 'react';

import {
    MDBFooter,
    MDBContainer,
    MDBRow,
  } from 'mdb-react-ui-kit';
  

function Footer() {
    return(
        <MDBFooter className='bg-secondary fixed-bottom'>
        <MDBContainer className='p-4'>
            <MDBRow>
                <h5 className='text-uppercase'>Footer Content</h5>

                <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis molestias.
                Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam voluptatem veniam,
                est atque cumque eum delectus sint!
                </p>
            </MDBRow>
        </MDBContainer>
    </MDBFooter>
    )
}

export default Footer;