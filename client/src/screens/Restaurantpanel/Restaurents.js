import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function Restaurents() {
    const [ loading, setloading ] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedrestaurants, setselectedrestaurants] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
          fetchdata();
      }, []);

    const handleAddClick = () => {
        navigate('/Restaurantpanel/Addrestaurent');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("merchantid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/restaurants/${userid}`, {
                headers: {
                  'Authorization': authToken,
                }
              });

              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }

              else{
                const json = await response.json();
                
                if (Array.isArray(json)) {
                    setRestaurants(json);
                }
                setloading(false);

              }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleMenuViewClick = (restaurant) => {
        let restaurantId = restaurant._id;
        navigate('/Restaurantpanel/Menu', { state: { restaurantId } });
    };
    const handleEditClick = (restaurant) => {
        setselectedrestaurants(restaurant);
        let restaurantId = restaurant._id;
        navigate('/Restaurantpanel/EditRestaurant', { state: { restaurantId } });
    };

    const handleDeleteClick = async (restaurantId) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/delrestaurants/${restaurantId}`, {
                method: 'GET',
                headers: {
                    'Authorization': authToken,
                  }
            });

            if (response.status === 401) {
              const json = await response.json();
              setAlertMessage(json.message);
              setloading(false);
              window.scrollTo(0,0);
              return; // Stop further execution
            }

            else{
                const json = await response.json();
        
                if (json.Success) {
                    fetchdata(); 
                } else {
                    console.error('Error deleting restaurant:', json.message);
                }
            }
        } catch (error) {
            console.error('Error deleting restaurant:', error);
        }
    };

    const handleDuplicateClick = async (restaurantId) => {
        try {
            const userid = localStorage.getItem("merchantid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/duplicateRestaurant/${restaurantId}/${userid}`, {
                method: 'GET',
                headers: {
                    'Authorization': authToken,
                  }
            });
    
            const textResponse = await response.text();
            
            // Check if response is empty or undefined
            if (!textResponse) {
                console.error('Empty response received');
                return;
            }

            if (response.status === 401) {
                const json = JSON.parse(textResponse);
                setAlertMessage(json.message);
                setloading(false);
                return; // Stop further execution
              }

              else{
                const json = JSON.parse(textResponse);
                if (json.success) {
                    console.log('Restaurant duplicated successfully');
                    fetchdata();
                } else {
                    console.error('Error duplicating Restaurant:', json.message);
                }
              }
        } catch (error) {
            console.error('Error duplicating Restaurant:', error);
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
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div>
                    
                    <div className='mx-5 mt-5'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>

                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Merchant</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Merchants</li>
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
                                        <th scope="col">Merchant Name </th>
                                        <th scope="col">Nickname </th>
                                        <th scope="col">Merchant Type </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">Menu </th>
                                        <th scope="col">Duplicate </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {restaurants.map((restaurant, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{restaurant.name}</td>
                                                <td>{restaurant.nickname}</td>
                                                <td>{restaurant.type}</td>
                                                <td>{restaurant.email}</td>
                                                <td>{restaurant.number}</td> 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(restaurant)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td>
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={() => handleDuplicateClick(restaurant._id)}>
                                                        <i class="fa-solid fa-copy"></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(restaurant)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(restaurant._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                                <td>{restaurant.createdAt}</td>
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
