import NavBar from "../Components/Dashboard/NavBar";
import Header from "../Components/Dashboard/Header";
import Footer from "../Components/Dashboard/Footer";
import { DashboardHTML } from "../Components/dashboard";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import React, {useState,useEffect} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getUsers,approveUser , blockUser, unblockUser } from "../userredux/useraction";
import { Route  , Link, NavLink, Navigate, useNavigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'



 function Dashboard  (props) {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userDisplay.userInfo);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (key) => {
    try {
      const response = await  fetch(`http://localhost:5000/api/user/search/${key}`, { method: 'GET' }); 
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  
  const offset = currentPage * itemsPerPage;
  let currentPageData = [];
  if (Array.isArray(users)) {
    currentPageData = users.slice(offset, offset + itemsPerPage);
  }  
//for the nagivation between pages Sponssor and Coach
let navigate =useNavigate()
const userLogin =useSelector(state =>state.userLogin)
const {userInfo} =userLogin
  console.log(users);
  useEffect(() => {
    dispatch(getUsers());
    // const interval = setInterval(() => {
    //   setRefresh((prev) => !prev); // toggle the value of refresh every time the interval elapses
    // }, 2000); // interval time in milliseconds
    // return () => clearInterval(interval); // clear the interval on component unmount
  }, [dispatch ]);

 
 const handleRefresh = () => {
   setTimeout(() => {
     dispatch(getUsers());
   }, 1000); 
   console.log("after 1 second");// Refresh after 1 seconds (adjust the number as needed)
 };

  const handleApprove = (id, role) => {
    dispatch(approveUser(id, role));
  };
  

  const handleBlockUser = (id, blocked) => {
    if (blocked) {
      dispatch(unblockUser(id));
    } else {
      dispatch(blockUser(id));
    }
  };

  

  // If the user is not an admin, redirect to the homepage
  
   // handle page change
   const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
 
 const detailRole=(role , id )=>{
  let path =`/${role}/${id}`
        navigate(path)
 };
 

    return ( <>
    
<div>    <div>
  {ReactHtmlParser(DashboardHTML)}   </div>
</div>;        <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
          <NavBar />
          <div className="layout-page">
          <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar">
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <Link className="nav-item nav-link px-0 me-xl-4" to="">
            <i className="bx bx-menu bx-sm"></i>
          </Link>
        </div>
      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <div className="navbar-nav align-items-center">
            <div className="nav-item d-flex align-items-center">
              <i className="bx bx-search fs-4 lh-0"></i>
              
              <input type="text" 
              onChange={(e) => handleSearch(e.target.value)}
                className="form-control border-0 shadow-none"
                placeholder="Search..."
                aria-label="Search..."
              />

              
            </div>
          </div>
          </div>
          </nav>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light"></span> List Account</h4>
        <div className="card">
       
                <h5 className="card-header">Accounts</h5>
                <button className="btn btn-primary" onClick={handleRefresh}>
      <FontAwesomeIcon icon={faSync} /> 
    </button>
                <div className="table-responsive text-nowrap">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>CIN</th>
                        <th>Image</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Role Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <div>

      </div>
                    <tbody className="table-border-bottom-0">
                    { Array.isArray(searchResults) && searchResults?.length > 0 ? (
                         <>
                    {searchResults.map((i) => {
                              return(
                            <tr key={i.id}>
                            
                          <td><i className="fab fa-angular fa-lg text-danger me-3"></i>{i.firstName}</td>
                          <td> {i.lastName}</td> 
                        <td>
                        {i.email}
                        </td>
                        <td>
                        {i.phone}
                        </td>
                        <td>
                        {i.cin}
                        </td>
                        <td>
                        <img style={{width:"200px",height:"auto"}} src={`${process.env.PUBLIC_URL}/images/${i.imageUrl}`} alt="My Image" />
                        </td>
                        <td>
                        <span className="badge bg-label-primary me-1">{i?.role?.name}</span>
                        </td>
                        <td ><span className={i.verify === true ? 'badge bg-label-success me-1' : 'badge bg-label-warning me-1'}>{i.verify ? 'Verifed': 'Not-Verifed'}</span>
                        <span className={i.bloque === true ? 'badge bg-label-warning me-1' :'badge bg-label-success me-1' }>{i.bloque ? 'Blocked': 'Not-Blocked'}</span></td>
                        <td >    <span className={i.status === 'pending' ? 'badge bg-label-warning me-1' : 'badge bg-label-success me-1'}>{i.status === 'approved' ? 'approved' : 'pending'}</span></td>

                        <td>
                        <DropdownButton title="Actions">
                        {i.status === "pending" && (
                     <>
                    {i?.role?.name === "userRole"  ? (
                        <>
                      <Dropdown.Item onClick={() => {
                        Swal.fire({
                          title: 'Do you want to Approve this User as Sponsor?',
                          showDenyButton: true,
                          showCancelButton: true,
                          confirmButtonText: 'Save',
                          denyButtonText: `Don't save`,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleApprove(i._id, "sponsor");
                            Swal.fire('Approved!', '', 'success');
                          } else if (result.isDenied) {
                            Swal.fire('User is not Approved', '', 'info');
                          }
                        });
                      }}>
                        <i className="bx bx-edit-alt me-1"></i> Approve Sponsor
                      </Dropdown.Item>

                      <Dropdown.Item onClick={() => {
                        Swal.fire({
                          title: 'Do you want to Approve this User as Coach?',
                          showDenyButton: true,
                          showCancelButton: true,
                          confirmButtonText: 'Save',
                          denyButtonText: `Don't save`,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            handleApprove(i._id, "coach");
                            Swal.fire('Approved!', '', 'success');
                          } else if (result.isDenied) {
                            Swal.fire('User is not Approved', '', 'info');
                          }
                        });
                      }}>
                        <i className="bx bx-edit-alt me-1"></i>Approve Coach
                      </Dropdown.Item>
                        </>
                      ) : null}
                   </>
                       )}
                      <Dropdown.Item href="#/action-1"> <i className="bx bx-edit-alt me-1"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="" onClick={() => {
                              if (i.bloque) {
                                  Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, UnBlock it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleBlockUser(i._id, true);
                                        handleRefresh();
                                        Swal.fire(
                                          'Unblocked!',
                                          'The user has been unblocked.',
                                          'success'
                                        )
                                    }
                                });
                                  
                              } else {
                                  Swal.fire({
                                      title: 'Are you sure?',
                                      text: "You won't be able to revert this!",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes, Block it!'
                                  }).then((result) => {
                                      if (result.isConfirmed) {
                                          handleBlockUser(i._id, false);

                                          handleRefresh();
                                          Swal.fire(
                                            'Blocked!',
                                            'The user has been blocked.',
                                            'success'
                                          )
                                      }
                                  });
                              }
                          }}>
                            {i.bloque ? (
                                <>
                                    <i className="bx bx-check me-1"></i>Unblock
                                </>
                            ) : (
                                <>
                                    <i className="bx bx-trash me-1"></i>Block
                                </>
                            )}
                        </Dropdown.Item>





 
                          {i?.role?.name === "sponsor" || i?.role?.name === "coach" ? (
                          <Dropdown.Item onClick={() => detailRole(i?.role?.name, i._id)}><i className="bx bx-edit-alt me-1"></i>details</Dropdown.Item>
                          ) : null}
                          </DropdownButton>
                        </td>
                        
                       
                       </tr>
                          
                        )})} 
                        </> 
                        ): (
                        
                       
<>
                        {currentPageData.map((i) => {
                          
                          return(
                              
                            <tr key={i.id}>
                            
                          <td><i className="fab fa-angular fa-lg text-danger me-3"></i>{i.firstName}</td>
                          <td> {i.lastName}</td> 
                        <td>
                        {i.email}
                        </td>
                        <td>
                        {i.phone}
                        </td>
                        <td>
                        {i.cin}
                        </td>
                        <td>
                        <img style={{width:"200px",height:"auto"}} src={`${process.env.PUBLIC_URL}/images/${i.imageUrl}`} alt="My Image" />
                        </td>
                        <td>
                        <span className="badge bg-label-primary me-1">{i?.role?.name}</span>
                        </td>
                        <td ><span className={i.verify === true ? 'badge bg-label-success me-1' : 'badge bg-label-warning me-1'}>{i.verify ? 'Verifed': 'Not-Verifed'}</span>
                        <span className={i.bloque === true ? 'badge bg-label-warning me-1' :'badge bg-label-success me-1' }>{i.bloque ? 'Blocked': 'Not-Blocked'}</span></td>
                        <td >  {i.status === 'approved' ? (
  <span className="badge bg-label-success me-1">approved</span>
) : i.status === 'pendingAsSponsor' || i.status === 'pendingAsCoach' ? (
  <span className="badge bg-label-warning me-1">pending</span>
) : (
  <span className="badge bg-label-secondary me-1">------</span>
)}</td>

                        <td>
                        <DropdownButton title="Actions">
                        {i.status === "pendingAsSponsor" && (
    <>
      {i?.role?.name === "userRole" && (
        <>
          <Dropdown.Item onClick={() => {
            Swal.fire({
              title: 'Do you want to Approve this User as Sponsor?',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Save',
              denyButtonText: `Don't save`,
            }).then((result) => {
              if (result.isConfirmed) {
                handleApprove(i._id, "sponsor");
                handleRefresh();
                Swal.fire('Approved as Sponsor!', '', 'success');
              } else if (result.isDenied) {
                Swal.fire('User is not Approved', '', 'info');
              }
            });
          }}>
            <i className="bx bx-edit-alt me-1"></i> Approve as Sponsor
          </Dropdown.Item>
        </>
      )}
    </>
  )}
  {i.status === "pendingAsCoach" && (
    <>
      {i?.role?.name === "userRole" && (
        <>
          <Dropdown.Item onClick={() => {
            Swal.fire({
              title: 'Do you want to Approve this User as Coach?',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Save',
              denyButtonText: `Don't save`,
            }).then((result) => {
              if (result.isConfirmed) {
                handleApprove(i._id, "coach");
                handleRefresh();
                Swal.fire('Approved as Coach!', '', 'success');
              } else if (result.isDenied) {
                Swal.fire('User is not Approved', '', 'info');
              }
            });
          }}>
            <i className="bx bx-edit-alt me-1"></i>Approve as Coach
          </Dropdown.Item>
        </>
      )}
    </>
  )}
                      <Dropdown.Item href="#/action-1"> <i className="bx bx-edit-alt me-1"></i> Edit</Dropdown.Item>
                      <Dropdown.Item href="" onClick={() => {
                              if (i.bloque) {
                                  Swal.fire({
                                    title: 'Are you sure?',
                                    text: "You won't be able to revert this!",
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#3085d6',
                                    cancelButtonColor: '#d33',
                                    confirmButtonText: 'Yes, UnBlock it!'
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleBlockUser(i._id, true);
                                        handleRefresh();
                                        Swal.fire(
                                          'Unblocked!',
                                          'The user has been unblocked.',
                                          'success'
                                        )
                                    }
                                });
                                  
                              } else {
                                  Swal.fire({
                                      title: 'Are you sure?',
                                      text: "You won't be able to revert this!",
                                      icon: 'warning',
                                      showCancelButton: true,
                                      confirmButtonColor: '#3085d6',
                                      cancelButtonColor: '#d33',
                                      confirmButtonText: 'Yes, Block it!'
                                  }).then((result) => {
                                      if (result.isConfirmed) {
                                          handleBlockUser(i._id, false);
                                          handleRefresh();
                                          Swal.fire(
                                            'Blocked!',
                                            'The user has been blocked.',
                                            'success'
                                          )
                                      }
                                  });
                              }
                          }}>
                            {i.bloque ? (
                                <>
                                    <i className="bx bx-check me-1"></i>Unblock
                                </>
                            ) : (
                                <>
                                    <i className="bx bx-trash me-1"></i>Block
                                </>
                            )}
                        </Dropdown.Item>





 
                          {i?.role?.name === "sponsor" || i?.role?.name === "coach" ? (
                          <Dropdown.Item onClick={() => detailRole(i?.role?.name, i._id)}><i className="bx bx-edit-alt me-1"></i>details</Dropdown.Item>
                          ) : null}
                          </DropdownButton>
                        </td>
                        
                        </tr>
                          )
                        })} 
</>
                        )}
                                            
                    </tbody>
                  </table>
                  <ReactPaginate
        previousLabel={<span className="icon-prev"></span>}
        nextLabel={<span className="icon-next"></span>}
        breakLabel={<span className="break"></span>}
        pageLinkClassName={'page-link'}
        pageCount={Math.ceil(users?.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
                </div>
              </div> 
                
        </div>
        <Footer/>  
         </div> </div>
        
        </div> </div>
      
        
</>
     );
}
export default Dashboard

