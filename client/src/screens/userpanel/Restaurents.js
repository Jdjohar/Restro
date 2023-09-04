import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';

export default function Restaurents() {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedrestaurants, setselectedrestaurants] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchdata(); // Fetch data when the component mounts
    }, []);

    const handleAddClick = () => {
        navigate('/Userpanel/Addrestaurent');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://localhost:3001/api/restaurants/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setRestaurants(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleMenuViewClick = (restaurant) => {
        let restaurantId = restaurant._id;
        navigate('/Userpanel/Menu', { state: { restaurantId } });
    };
    const handleEditClick = (restaurant) => {
        setselectedrestaurants(restaurant);
        let restaurantId = restaurant._id;
        navigate('/Userpanel/EditRestaurant', { state: { restaurantId } });
    };

    const handleDeleteClick = async (restaurantId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}`, {
                method: 'DELETE'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata(); // Refresh the restaurants list
            } else {
                console.error('Error deleting restaurant:', json.message);
            }
        } catch (error) {
            console.error('Error deleting restaurant:', error);
        }
    };

  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>

                <div className="col-10">
                    <div className="bg-white mt-5 p-3 box mb-5">
                        <div className='row'>
                            <div className="col-4 me-auto">
                                <p className='h5'>Restaurants</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Restaurants</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-2">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        <div className="row px-2">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">Restaurant Name </th>
                                        <th scope="col">Restaurant Type </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">Menu </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {restaurants.map((restaurant, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{restaurant.name}</td>
                                                <td>{restaurant.type}</td>
                                                <td>{restaurant.email}</td>
                                                <td>{restaurant.number}</td> 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(restaurant)}>
                                                        <i class="fa-solid fa-eye"></i>
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
    </div>
  )
}
