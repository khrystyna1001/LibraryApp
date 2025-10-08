import React from 'react';
import { Icon, 
  Pagination 
} from 'semantic-ui-react';

const Paginate = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePaginationChange = (e, { activePage }) => {
      if (activePage !== currentPage) {
        paginate(activePage)
      }
    }

    if (totalPages <= 1) {
      return null;
    }

  return (
    <Pagination
    
    defaultActivePage={1}
    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
    prevItem={{ content: <Icon name='angle left' />, icon: true }}
    nextItem={{ content: <Icon name='angle right' />, icon: true }}

    totalPages={totalPages}
    onPageChange={handlePaginationChange}
  />
  );
}

export default Paginate;