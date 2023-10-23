import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Nav from './Nav';

import Usernavbar from './Usernavbar';

export default function EditRestaurant() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const restaurantId = location.state.restaurantId;
    const [timezones, setTimezones] = useState([]);
    const [timezoneLoading, setTimezoneLoading] = useState(true);
    const [restaurant, setRestaurant] = useState({
        name: '',
        type: '',
        email: '',
        number: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        address: '',
        timezone: '',
        nickname:''
    });

    useEffect(() => {
        fetchRestaurantData();
        fetchTimezones();
    }, []);

    // const fetchRestaurantData = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3001/api/getrestaurants?restaurantid=${restaurantId}`);
    //         const json = await response.json();
            
            
    //         console.error('Error fetching restauradsant:', json);
    //             setRestaurant(json.restaurant);
    //     } catch (error) {
    //         console.error('Error fetching restaurant:', error);
    //     }
    // };

    const fetchRestaurantData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurants/${restaurantId}`);
            const json = await response.json();
            
            if (json.Success) {
                setRestaurant(json.restaurant);
            } else {
                console.error('Error fetching restaurant:', json.message);
            }
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        }
    };
    

    const handleSaveClick = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(restaurant)
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Userpanel/Restaurents');
            } else {
                console.error('Error updating restaurant:', json.message);
            }
        } catch (error) {
            console.error('Error updating restaurant:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setRestaurant({ ...restaurant, [name]: value });
    };

    const fetchTimezones = () => {
        // Fetch timezones from your backend and populate the timezones state
        fetch('http://localhost:3001/api/timezones')
            .then((response) => response.json())
            .then((data) => {
                setTimezones(data);
                setTimezoneLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching timezones:', error);
            });
    };

    const handleTimezoneChange = (selectedOption) => {
        setRestaurant({ ...restaurant, timezone: selectedOption.value });
    };

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-lg-2 col-md-3  vh-lg-100 vh-md-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                        <Usernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Nav/>
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Restaurant</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Userpanel/restaurents" className='txtclr text-decoration-none'>Restaurant</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Restaurant</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputtext1" class="form-label">Restaurant Name *</label>
                                                    <input type="text" class="form-control" name="name" value={restaurant.name} onChange={handleInputChange} placeholder='Restaurant Name' id="exampleInputtext1"/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputtext3" class="form-label">Nickname</label>
                                                    <input type="text" class="form-control" name="nickname" value={restaurant.nickname} onChange={handleInputChange} placeholder='Nickname' id="exampleInputtext3"/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputtext2" class="form-label">Restaurant Type *</label>
                                                    <select class="form-select" name='type' value={restaurant.type} onChange={handleInputChange} aria-label="Default select example">
                                                        <option selected>Select Restaurant Type</option>
                                                        <option value="Cafe">Cafe</option>
                                                        <option value="Hotel">Hotel</option>
                                                        <option value="Food Truck">Food Truck</option>
                                                        <option value="Quick Service Restaurant">Quick Service Restaurant</option>
                                                        <option value="Pub/Bar">Pub/Bar</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1" class="form-label">Contact Email</label>
                                                    <input type="email" class="form-control" name="email" value={restaurant.email} onChange={handleInputChange} placeholder='Contact Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4"> 
                                                <div class="mb-3">
                                                    <label for="Number" class="form-label">Phone Number *</label>
                                                    <input type="number" name='number' class="form-control" value={restaurant.number} onChange={handleInputChange} placeholder='Phone Number' id="phonenumber"/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="City " class="form-label">City </label>
                                                    <input type="text " name='city' value={restaurant.city} onChange={handleInputChange} class="form-control" placeholder='City ' id="City "/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="State " class="form-label">State </label>
                                                    <input type="text " name='state' value={restaurant.state} onChange={handleInputChange} class="form-control" placeholder='State ' id="State "/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="Country  " class="form-label">Country  </label>
                                                    <input type="text  "  name='country' value={restaurant.country} onChange={handleInputChange} class="form-control" placeholder='Country  ' id="Country  "/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div className='mb-3'>
                                                    <label htmlFor='Timezone' className='form-label'>
                                                        Timezone
                                                    </label>
                                                    <Select
                                                        name='timezone'
                                                        options={timezones.map((tz) => ({ value: tz, label: tz }))}
                                                        onChange={handleTimezoneChange}
                                                        value={{ value: restaurant.timezone, label: restaurant.timezone }}
                                                        placeholder='Select Timezone'
                                                        isSearchable
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="Zip  " class="form-label">Zip  </label>
                                                    <input type="text  " name='zip' value={restaurant.zip} onChange={handleInputChange} class="form-control" placeholder='Zip  ' id="Zip  "/>
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-4">
                                                <div class="mb-3">
                                                    <label for="Address" class="form-label">Address</label>
                                                    <input type="message" name='address' value={restaurant.address} onChange={handleInputChange} class="form-control" placeholder='Address' id="Address"/>
                                                </div>
                                            </div>
                                        </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
    );
}
