import "./DashBoard.css"
import { usersApi } from "../App";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,faPenToSquare,faFloppyDisk,faXmark } from '@fortawesome/free-solid-svg-icons'

const DashBoard = () => {
    const firstPage = 1
    const [users, setUser] = useState([])
    const [currentPage, setCurrentPage] = useState(firstPage)
    const [userEntriesPerPage] = useState(10)
    const [usersChecked, setUsersChecked] = useState([])
    const [userEditId, setUserEditId] = useState(null)
    const [editedValues, setEditedValues] = useState({})

    // url for fetching the user data 
    const url = `${usersApi.endpoint}`

    // Pagination Logic
    const indexOfLastEntry = currentPage * userEntriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - userEntriesPerPage;
    const entriesPerPage = users.slice(indexOfFirstEntry, indexOfLastEntry)
    const totalPages = Math.ceil(users.length / entriesPerPage.length)
    
    // function triggered when page is changed
    const changePage = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    // function for taking the user to next page on click
    const changeToNextPage = ()  => {
        if(currentPage < totalPages){
            setCurrentPage(currentPage + 1)
        }
    }
    const changeToLastPage = () => {
        if(currentPage !== totalPages){
            setCurrentPage(totalPages)
        }
    }
    const changeToFirstPage = () => {
        if(currentPage !== firstPage){
            setCurrentPage(firstPage)
        }
    }
    const changeToPreviousPage = () => {
        if(currentPage !== firstPage){
            setCurrentPage(currentPage - 1)
        }
    }

    // function for searching the user based on role, email and name
    const filterUsers = async (e) => {
        const searchTerm = e.target.value
        if (searchTerm === "") {
            try {
                const response = await axios.get(url)
                setUser(response.data)
                return response.data
            } catch (error) {
                return null
            }
        }
        if (searchTerm !== "") {
            const filteredUsers = users.filter(user => {
                return (
                    user.name.includes(searchTerm) ||
                    user.role.includes(searchTerm) ||
                    user.email.includes(searchTerm)
                );
            });
            setUser(filteredUsers);
        }

    }

    // function triggered when main checkbox is clicked
    const handleAllCheckboxes = (event) => {
        if (event.target.checked) {
            const usersSelected = entriesPerPage.map(user => user.name)
            setUsersChecked(usersSelected)
        }
        else {
            setUsersChecked([])
        }
    }
    // function for each individual checkboxes of the entries
    const handleIndividualCheckbox = (event, user) => {
        if (event.target.checked) {
            setUsersChecked([...usersChecked, user.name])
        }
        else {
            setUsersChecked(usersChecked.filter(userEntry => userEntry !== user.name))
        }
    }

    // function for editing the user entry in place
    const handleEdit = (userId) => {
        setUserEditId(userId)
    }

    // function triggered when changing the value in the input field after edit is clicked
    const handleInputChange = (userId, fieldName, value) => {
        setEditedValues(prevEditedValues => ({
            ...prevEditedValues,
            [userId]: {
                ...prevEditedValues[userId],
                [fieldName]: value,
            },
        }))
    }
    // This function saves the edited values
    const handleInputSave = (userId) => {
        const updatedUser = users.map(user => {
            if (user.id === userId && editedValues[userId]) {
                return { ...user, ...editedValues[userId] }
            }
            return user
        })
        setUser(updatedUser)
        setEditedValues({})
        setUserEditId(null)
    }
    // function cancels the handleInputChange 
    const handleCancel = () => {
        setEditedValues({})
        setUserEditId(null)
    }
    // function deletes the userEntry in place
    const handleDelete = (id) => {
        setUser(users.filter(user => user.id !== id))
    }
    const handleSelectedDelete = () => {
        setUser(users.filter(user => !usersChecked.includes(user.name)))
    }

    // users data fetched during the initial render and on page load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(url)
                setUser(response.data)
                return response.data
            }
            catch (error) {
                if (error.response && error.response.status === 500) {
                    return null
                }
                else {
                    return null
                }
            }
    
        }
        fetchUser()
    }, [url])

    useEffect(() => {
        console.log(currentPage);
      }, [currentPage]);

    // UI displayed on the dashboard
    return (
        <section className="dashboard-container">
            {/* Search Box UI */}
            <header className="search-container">
                <input
                    className="search-bar"
                    type="text"
                    onChange={(e) => filterUsers(e)}
                    placeholder="Search by Name, email or role"
                >

                </input>
            </header>
            {/* Static UI of user titles displaying main checkbox, name, role, email and actions to be performed*/}
            <section className="userTitle-container">
                    <input
                        className="user-title"
                        type="checkbox"
                        checked={usersChecked.length === entriesPerPage.length}
                        onChange={handleAllCheckboxes}
                    >
                    </input>
                    <h3 className="user-title">Name</h3>
                    <h3 className="user-title">Email</h3>
                    <h3 className="user-title">Role</h3>
                    <h3 className="user-title">Actions</h3>
            </section>

            {/* User entries UI */}
            <section className="user-entries">
                {entriesPerPage.map(user => {
                    return (
                        <>
                        <div className="userEntry-container" key={user.id}>
                            {userEditId === user.id ? (
                                    <section className="userEntry-values">   
                                        <input
                                            id={user.id}
                                            type="checkbox"
                                            checked={usersChecked.includes(user.name)}
                                            onChange={(event) => {
                                                handleIndividualCheckbox(event, user)
                                            }}
                                        >
                                        </input>
                                        <input
                                            className="input-edit"
                                            value={editedValues[user.id]?.name || ''}
                                            onChange={(e) => handleInputChange(user.id, 'name', e.target.value)}>
                                        </input>
                                       
                                        <input
                                            className="input-edit"
                                            value={editedValues[user.id]?.email || ''}
                                            onChange={(e) => handleInputChange(user.id, 'email', e.target.value)}>
                                        </input>
                                        
                                        <input
                                            className="input-edit"
                                            value={editedValues[user.id]?.role || ''}
                                            onChange={(e) => handleInputChange(user.id, 'role', e.target.value)}>
                                        </input>
                                        
                                        <section className="user-btn">
                                            <button className="userEntrySave-btn" onClick={() => handleInputSave(user.id)}><FontAwesomeIcon icon={faFloppyDisk} /></button>
                                            <button className="userEntryCancelEditing-btn" onClick={() => handleCancel()}><FontAwesomeIcon icon={faXmark} /></button>
                                        </section>
                                    </section>
                            ) :
                                (
                                    // flex-child-2
                                    <section className="userEntry-values">
                                        <input
                                            id={user.id}
                                            type="checkbox"
                                            checked={usersChecked.includes(user.name)}
                                            onChange={(event) => {
                                                handleIndividualCheckbox(event, user)
                                            }}
                                        >
                                        </input>
                                        <input className="input-readOnly" value={user.name} readOnly></input>
                                        
                                        <input className="input-readOnly" value={user.email} readOnly></input>
                                        
                                        <input className="input-readOnly" value={user.role} readOnly></input>
                                        
                                        <section className="user-btn">
                                            <button className="userEntryEdit-btn" onClick={() => handleEdit(user.id)}><FontAwesomeIcon icon={faPenToSquare} /></button>
                                            <button className="userEntryDelete-btn" onClick={() => handleDelete(user.id)}><FontAwesomeIcon icon={faTrash} /></button>  
                                        </section>
                                    </section>
                                )}

                        
                        </div>
                        </>
                    )
                    
                })}
                
            </section>
                <section className="footer-container">
                    <button onClick={() => handleSelectedDelete()} className="deleteSelected-btn">Delete Selected</button>
                </section>
                <Pagination 
                    entriesPerPage={userEntriesPerPage} 
                    totalEntries={users.length} 
                    paginate={changePage} 
                    nextPage={changeToNextPage} 
                    lastPage={changeToLastPage}
                    firstPage={changeToFirstPage}
                    previousPage={changeToPreviousPage}
                    currentPage={currentPage}
                />
            </section>
    )
}

export default DashBoard