import React from 'react';
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
  return (
    <nav className='d-flex justify-content-center my-4'>
      <MDBPagination>
        <MDBPaginationItem disabled={currentPage === 1}>
          <MDBPaginationLink href='#' aria-label='Previous' onClick={() => paginate(currentPage - 1)}>
            <span aria-hidden='true'>«</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
        {pageNumbers.map(number => (
            <MDBPaginationItem key={number} active={number === currentPage}>
                <MDBPaginationLink href='#' onClick={() => paginate(number)}>
                    {number}
                </MDBPaginationLink>
            </MDBPaginationItem>
        ))}
        <MDBPaginationItem disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}>
          <MDBPaginationLink href='#' aria-label='Next' onClick={() => paginate(currentPage + 1)}>
            <span aria-hidden='true'>»</span>
          </MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>
  );
}

export default Pagination;