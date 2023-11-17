import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Retaiernavbar from './Retaiernavbar';
import Retailernav from './Retailernav';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import { ColorRing } from  'react-loader-spinner'

export default function Editstore() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ loading, setloading ] = useState(true);
    
    const storeId = location.state.storeId;
    const [timezones, setTimezones] = useState([]);
    const [timezoneLoading, setTimezoneLoading] = useState(true);

    const [store, setStore] = useState({
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
      
        if (!authToken || signUpType !== 'Retailer') {
          navigate('/login');
        }
        fetchStoreData();
        fetchTimezones();
        setloading(false);
      }, []);

    const fetchStoreData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getstores/${storeId}`);
            const json = await response.json();
            
            if (json.Success) {
                setStore(json.store);
            } else {
                console.error('Error fetching store:', json.message);
            }
            console.log(store);
        } catch (error) {
            console.error('Error fetching store:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const updatedstore = {
                ...store
            };
            const response = await fetch(`http://localhost:3001/api/updatestore/${storeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedstore)
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Retailerpanel/Store');
                console.log(updatedstore);
            } else {
                console.error('Error updating store:', json.message);
            }
        } catch (error) {
            console.error('Error updating store:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStore({ ...store, [name]: value });
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
        setStore({ ...store, timezone: selectedOption.value });
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
                            <Retaiernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Retailernav/>
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Store</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Retailerpanel/Retailerdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Retailerpanel/Store" className='txtclr text-decoration-none'>Store</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Store</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext1" className="form-label">Store Name *</label>
                                            <input type="text" className="form-control" name="name" value={store.name} onChange={handleInputChange} placeholder='Merchant Name' id="exampleInputtext1"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext3" className="form-label">Nickname</label>
                                            <input type="text" className="form-control" name="nickname" value={store.nickname} onChange={handleInputChange} placeholder='Nickname' id="exampleInputtext3"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext2" className="form-label">Store Type</label>
                                            <select className="form-select" name='type' value={store.type} onChange={handleInputChange} aria-label="Default select example">
                                                <option value="">Select Store Type</option>
                                                <option value="Cafe">Cafe</option>
                                                <option value="Hotel">Hotel</option>
                                                <option value="Food Truck">Food Truck</option>
                                                <option value="Quick Service store">Quick Service Merchant</option>
                                                <option value="Pub/Bar">Pub/Bar</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Contact Email</label>
                                            <input type="email" className="form-control" name="email" value={store.email} onChange={handleInputChange} placeholder='Contact Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4"> 
                                        <div className="mb-3">
                                            <label htmlFor="Number" className="form-label">Phone Number</label>
                                            <input type="number" name='number' className="form-control" value={store.number} onChange={handleInputChange} placeholder='Phone Number' id="phonenumber"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Country" className="form-label">Country</label>
                                            <CountrySelect
                                                name="country"
                                               defaultValue={store.countrydata != '' ? JSON.parse(store.countrydata): null}
                                                onChange={(val) => {
                                                    setStore({...store, country: val.name});
                                                    setStore({...store, countryid: val.id});
                                                    setStore({...store, countrydata: JSON.stringify(val)});
                                                }}
                                                
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="State" className="form-label">State</label>
                                            <StateSelect
                                                name="state"
                                                countryid={store.countryid != 0 ? store.countryid : 0}
                                                defaultValue={store.statedata != '' ? JSON.parse(store.statedata): null}
                                                onChange={(val) => {
                                                    setStore({...store, state: val.name});
                                                    setStore({...store, stateid: val.id});
                                                    setStore({...store, statedata: JSON.stringify(val)});
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="City" className="form-label">City</label>
                                            <CitySelect
                                                countryid={store ? store.countryid : 0}
                                                stateid={store ? store.stateid : 0}
                                                defaultValue={store.citydata != '' ? JSON.parse(store.citydata): null}
                                                onChange={(val) => {
                                                    setStore({...store, city: val.name});
                                                    setStore({...store, cityid: val.id});
                                                    setStore({...store, citydata: JSON.stringify(val)});
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
                                                value={{ value: store.timezone, label: store.timezone }}
                                                placeholder='Select Timezone'
                                                isSearchable
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Zip" className="form-label">Zip</label>
                                            <input type="text" name='zip' value={store.zip} onChange={handleInputChange} className="form-control" placeholder='Zip' id="Zip"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Address" className="form-label">Address</label>
                                            <input type="message" name='address' value={store.address} onChange={handleInputChange} className="form-control" placeholder='Address' id="Address"/>
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
