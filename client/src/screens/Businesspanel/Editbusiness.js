import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Servicenavbar from './Servicenavbar';
import Servicenav from './Servicenav';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function Editbusiness() {
    const [ loading, setloading ] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    
    const businessId = location.state.businessId;
    const [timezones, setTimezones] = useState([]);
    const [timezoneLoading, setTimezoneLoading] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');

    const [business, setBusiness] = useState({
        name: '',
        uniquename: '',
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
      
        if (!authToken || signUpType !== 'Service Provider') {
          navigate('/login');
        }
        fetchBusinessData();
        fetchTimezones();
      }, []);

    const fetchBusinessData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/getbusinessdata/${businessId}`, {
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
                    setBusiness(json.business);
                    updateUniqueName(json.business.name);
                } else {
                    console.error('Error fetching business:', json.message);
                }
            }
            
        } catch (error) {
            console.error('Error fetching business:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const updatedbusinessdata = {
                ...business
            };
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/updatebusinessdata/${businessId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedbusinessdata)
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
                    navigate('/Businesspanel/Business');
                    console.log(updatedbusinessdata);
                } else {
                    console.error('Error updating business:', json.message);
                }
            }

            
        } catch (error) {
            console.error('Error updating business:', error);
        }
    };

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setBusiness({ ...business, [name]: value });
    // };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBusiness(prevState => ({ ...prevState, [name]: value }));
        if (name === 'name') {
            updateUniqueName(value);
        }
    };

    const updateUniqueName = (name) => {
        const cleanedName = name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
        setBusiness(prevState => ({ ...prevState, uniquename: cleanedName }));
    };

    const fetchTimezones = () => {
        // Fetch timezones from your backend and populate the timezones state
        fetch('https://restroproject.onrender.com/api/timezones')
            .then((response) => response.json())
            .then((data) => {
                setTimezones(data);
                setTimezoneLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching timezones:', error);
            });
            setloading(false);
    };

    const handleTimezoneChange = (selectedOption) => {
        setBusiness({ ...business, timezone: selectedOption.value });
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
                            <Servicenavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Servicenav/>
                        </div>
                        <div className='mx-5 mt-5'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Business</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Businesspanel/Businessdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Businesspanel/Business" className='txtclr text-decoration-none'>Business</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Business</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Business Name</label>
                                            <input type="text" className="form-control" name="name" value={business.name} onChange={handleInputChange} placeholder='Business Name' id="name"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext3" className="form-label">Nickname</label>
                                            <input type="text" className="form-control" name="nickname" value={business.nickname} onChange={handleInputChange} placeholder='Nickname' id="exampleInputtext3"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="type" className="form-label">Business Type</label>
                                            <input type="text" className="form-control" name="type" value={business.type} onChange={handleInputChange} placeholder='Business Type' id="type"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Contact Email</label>
                                            <input type="email" className="form-control" name="email" value={business.email} onChange={handleInputChange} placeholder='Contact Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4"> 
                                        <div className="mb-3">
                                            <label htmlFor="Number" className="form-label">Phone Number</label>
                                            <input type="number" name='number' className="form-control" value={business.number} onChange={handleInputChange} placeholder='Phone Number' id="phonenumber"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Country" className="form-label">Country</label>
                                            <CountrySelect
                                                name="country"
                                               defaultValue={business.countrydata != '' ? JSON.parse(business.countrydata): null}
                                                onChange={(val) => {
                                                    setBusiness({...business, country: val.name});
                                                    setBusiness({...business, countryid: val.id});
                                                    setBusiness({...business, countrydata: JSON.stringify(val)});
                                                }}
                                                
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="State" className="form-label">State</label>
                                            <StateSelect
                                                name="state"
                                                countryid={business.countryid != 0 ? business.countryid : 0}
                                                defaultValue={business.statedata != '' ? JSON.parse(business.statedata): null}
                                                onChange={(val) => {
                                                    setBusiness({...business, state: val.name});
                                                    setBusiness({...business, stateid: val.id});
                                                    setBusiness({...business, statedata: JSON.stringify(val)});
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="City" className="form-label">City</label>
                                            <CitySelect
                                                countryid={business ? business.countryid : 0}
                                                stateid={business ? business.stateid : 0}
                                                defaultValue={business.citydata != '' ? JSON.parse(business.citydata): null}
                                                onChange={(val) => {
                                                    setBusiness({...business, city: val.name});
                                                    setBusiness({...business, cityid: val.id});
                                                    setBusiness({...business, citydata: JSON.stringify(val)});
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
                                                value={{ value: business.timezone, label: business.timezone }}
                                                placeholder='Select Timezone'
                                                isSearchable
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Zip" className="form-label">Zip</label>
                                            <input type="text" name='zip' value={business.zip} onChange={handleInputChange} className="form-control" placeholder='Zip' id="Zip"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="Address" className="form-label">Address</label>
                                            <input type="message" name='address' value={business.address} onChange={handleInputChange} className="form-control" placeholder='Address' id="Address"/>
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
