import React, { useState, useEffect } from 'react';
import Servicenavbar from './Servicenavbar';
import { useNavigate } from 'react-router-dom';
import Servicenav from './Servicenav';
import { ColorRing } from  'react-loader-spinner'

export default function Business() {
    const [ loading, setloading ] = useState(true);
    const [business, setBusiness] = useState([]);
    const [selectedbusiness, setselectedbusiness] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Service Provider') {
          navigate('/login');
        }
        fetchdata();
      
    }, []);

    const handleAddClick = () => {
        navigate('/Businesspanel/Addbusiness');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`https://real-estate-1kn6.onrender.com/api/business/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setBusiness(json);
            }
            setloading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleMenuViewClick = (business) => {
        let businessId = business._id;
        navigate('/Businesspanel/Services', { state: { businessId } });
    };
    const handleEditClick = (business) => {
        setselectedbusiness(business);
        let businessId = business._id;
        navigate('/Businesspanel/Editbusiness', { state: { businessId } });
    };

    const handleDeleteClick = async (businessId) => {
        try {
            const response = await fetch(`https://real-estate-1kn6.onrender.com/api/delbusinessdata/${businessId}`, {
                method: 'GET'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata();
            } else {
                console.error('Error deleting business:', json.message);
            }
        } catch (error) {
            console.error('Error deleting business:', error);
        }
    };

    // const handleDuplicateClick = async (businessId) => {
    //     try {
    //         const userid = localStorage.getItem("userid");
    //         const response = await fetch(`https://real-estate-1kn6.onrender.com/api/duplicateBusiness/${businessId}/${userid}`, {
    //             method: 'GET'
    //         });

    //         const json = await response.json();

    //         if (json.success) {
    //             console.log('Business duplicated successfully');
    //             fetchdata();
    //         } else {
    //             console.error('Error duplicating business:', json.message);
    //         }
    //     } catch (error) {
    //         console.error('Error duplicating business:', error);
    //     }
    // };

    const handleDuplicateClick = async (businessId) => {
        try {
            const userid = localStorage.getItem("userid");
            const response = await fetch(`https://real-estate-1kn6.onrender.com/api/duplicateBusiness/${businessId}/${userid}`, {
                method: 'GET'
            });
    
            const textResponse = await response.text();
            
            // Check if response is empty or undefined
            if (!textResponse) {
                console.error('Empty response received');
                return;
            }
    
            const json = JSON.parse(textResponse);
    
            if (json.success) {
                console.log('Business duplicated successfully');
                fetchdata();
            } else {
                console.error('Error duplicating business:', json.message);
            }
        } catch (error) {
            console.error('Error duplicating business:', error);
        }
    };

  return (
    <div className='bg'>
    {
    loading?
    <div className='row'>
      <ColorRing
    // width={200}
    loading={loading}
    // size={500}
    display="flex"
    justify-content= "center"
    align-items="center"
    aria-label="Loading Spinner"
    data-testid="loader"        
  />
    </div>:
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Servicenavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Servicenav/>
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Business</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Businesspanel/Businessdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Business</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">Business Name </th>
                                        <th scope="col">Nickname </th>
                                        <th scope="col">Business Type </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">Service </th>
                                        <th scope="col">Duplicate </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {business.map((business, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{business.name}</td>
                                                <td>{business.nickname}</td>
                                                <td>{business.type}</td>
                                                <td>{business.email}</td>
                                                <td>{business.number}</td> 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(business)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td>
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={() => handleDuplicateClick(business._id)}>
                                                        <i class="fa-solid fa-copy"></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(business)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(business._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                                <td>{business.createdAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}
    </div>
  )
}
