import React from "react";
import "./Pagination.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faLessThan,faAnglesLeft,faAnglesRight,faGreaterThan} from '@fortawesome/free-solid-svg-icons'

const Pagination = ({entriesPerPage,totalEntries,paginate,nextPage,lastPage,firstPage,previousPage,currentPage}) => {
    const pageNumbers = []
    const totalPages = Math.ceil(totalEntries / entriesPerPage)

    for(let i = 1;i <= totalPages; i++){
        pageNumbers.push(i)
    }
    
    return(
            <nav>
                <div className="pagination">
                    <button 
                        className="page-buttons"
                        onClick={() => paginate(firstPage)} 
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button> 
                    <button 
                        className="page-buttons"
                        onClick={() => paginate(previousPage)} 
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faLessThan} />
                    </button>
                    {
                    pageNumbers.map(number => {
                        return <button onClick={() => paginate(number)} className="page-buttons">
                                    {number}
                                </button>
                    })
                    }
                    <button 
                        className="page-buttons"
                        onClick={() => paginate(nextPage)} 
                        disabled={currentPage === totalPages} 
                    >
                        <FontAwesomeIcon icon={faGreaterThan} />
                    </button>
                    <button 
                        className="page-buttons"
                        onClick={() => paginate(lastPage)} 
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </div>
            </nav>
    )
}

export default Pagination;