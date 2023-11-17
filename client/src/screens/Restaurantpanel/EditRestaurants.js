import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Nav from './Nav';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import { ColorRing } from  'react-loader-spinner'

import Usernavbar from './Usernavbar';

export default function EditRestaurant() {
    const [ loading, setloading ] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    const restaurantId = location.state.restaurantId;
    const [timezones, setTimezones] = useState([]);
    const [timezoneLoading, setTimezoneLoading] = useState(true);

    // Add state variables for selected country, state, and city
    // const [selectedCountry, setSelectedCountry] = useState(null);
    // const [selectedState, setSelectedState] = useState(null);
    // const [selectedCity, setSelectedCity] = useState(null);

    const [restaurant, setRestaurant] = useState({
        name: '',
        type: '',
        email: '',
        number: '',
        city: '',
        state: '',
        country: '',
        cityid: 0,
        stateid: 0,
        countryid: 0,
        citydata: '',
        statedata: '',
        countrydata: '',
        zip: '',
        address: '',
        timezone: '',
        nickname: ''
    });

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        fetchRestaurantData();
        fetchTimezones();
        setloading(false);
      }, []);

    const fetchRestaurantData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurants/${restaurantId}`);
            const json = await response.json();
            
            if (json.Success) {
                setRestaurant(json.restaurant);
            } else {
                console.error('Error fetching restaurant:', json.message);
            }
            console.log(restaurant);
        } catch (error) {
            console.error('Error fetching restaurant:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const updatedRestaurant = {
                ...restaurant
            };
            const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRestaurant)
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Restaurantpanel/Restaurents');
                console.log(updatedRestaurant);
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
                    <div className='col-lg-2 col-md-3 vh-lg-100 vh-md-100 b-shadow bg-white d-lg-block d-md-block d-none'>
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
                                    <p className='h5 fw-bold'>Edit Merchant</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Restaurantpanel/restaurants" className='txtclr text-decoration-none'>Merchant</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Merchant</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext1" className="form-label">Merchant Name *</label>
                                            <input type="text" className="form-control" name="name" value={restaurant.name} onChange={handleInputChange} placeholder='Merchant Name' id="exampleInputtext1"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext3" className="form-label">Nickname</label>
                                            <input type="text" className="form-control" name="nickname" value={restaurant.nickname} onChange={handleInputChange} placeholder='Nickname' id="exampleInputtext3"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext2" className="form-label">Merchant Type *</label>
                                            <select className="form-select" name='type' value={restaurant.type} onChange={handleInputChange} aria-label="Default select example">
                                                <option value="">Select Merchant Type</option>
                                                <option value="Cafe">Cafe</option>
                                                <option value="Hotel">Hotel</option>
                                                <option value="Food Truck">Food Truck</option>
                                                <option value="Quick Service Restaurant">Quick Service Merchant</option>
                                                <option value="Pub/Bar">Pub/Bar</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Contact Email</label>
                                            <input type="email" className="form-control" name="email" value={restaurant.email} onChange={handleInputChange} placeholder='Contact Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4"> 
                                        <div className="mb-3">
                                            <label htmlFor="Number" className="form-label">Phone Number *</label>
                                            <input type="number" name='number' className="form-control" value={restaurant.number} onChange={handleInputChange} placeholder='Phone Number' id="phonenumber"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Country" className="form-label">Country</label>
                                            <CountrySelect
                                                name="country"
                                               defaultValue={restaurant.countrydata != '' ? JSON.parse(restaurant.countrydata): null}
                                                onChange={(val) => {
                                                    setRestaurant({...restaurant, country: val.name});
                                                    setRestaurant({...restaurant, countryid: val.id});
                                                    setRestaurant({...restaurant, countrydata: JSON.stringify(val)});
                                                }}
                                                
                                            />
                                        </div>
                                    </div>

                                    {/* <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Country" className="form-label">Country</label>
                                            <CountrySelect
                                                name="country"
                                                defaultValue={JSON.parse(localStorage.getItem("selcountry"))}
                                                onChange={(val) => {
                                                    localStorage.setItem("selcountry", JSON.stringify(val));
                                                 setSelectedCountry(val)
                                                }
                                                }
                                                
                                            />
                                        </div>
                                    </div> */}

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="State" className="form-label">State</label>
                                            <StateSelect
                                                name="state"
                                                countryid={restaurant.countryid != 0 ? restaurant.countryid : 0}
                                                defaultValue={restaurant.statedata != '' ? JSON.parse(restaurant.statedata): null}
                                                onChange={(val) => {
                                                    setRestaurant({...restaurant, state: val.name});
                                                    setRestaurant({...restaurant, stateid: val.id});
                                                    setRestaurant({...restaurant, statedata: JSON.stringify(val)});
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="City" className="form-label">City</label>
                                            <CitySelect
                                                countryid={restaurant ? restaurant.countryid : 0}
                                                stateid={restaurant ? restaurant.stateid : 0}
                                                defaultValue={restaurant.citydata != '' ? JSON.parse(restaurant.citydata): null}
                                                onChange={(val) => {
                                                    setRestaurant({...restaurant, city: val.name});
                                                    setRestaurant({...restaurant, cityid: val.id});
                                                    setRestaurant({...restaurant, citydata: JSON.stringify(val)});
                                                }}
                                                placeHolder="Select City"
                                            />
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
                                        <div className="mb-3">
                                            <label htmlFor="Zip" className="form-label">Zip</label>
                                            <input type="text" name='zip' value={restaurant.zip} onChange={handleInputChange} className="form-control" placeholder='Zip' id="Zip"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Address" className="form-label">Address</label>
                                            <input type="message" name='address' value={restaurant.address} onChange={handleInputChange} className="form-control" placeholder='Address' id="Address"/>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
    );
}
