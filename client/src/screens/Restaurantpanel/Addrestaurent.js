import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { useRestaurantContext } from '../../components/RestaurantContext';
import Nav from './Nav';
import { CountrySelect, StateSelect, CitySelect } from '@davzon/react-country-state-city';
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import { ColorRing } from  'react-loader-spinner';
import Alertauthtoken from '../../components/Alertauthtoken';

export default function AddRestaurant() {
  const [ loading, setloading ] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    uniquename: '',
    email: '',  
    type: '',
    number: '',
    citydata: '',
    statedata: '',
    countrydata: '',
    zip: '',
    address: '',
    timezone: '',
    nickname: '',
  });

  const [countryid, setcountryid] = useState(false);
  const [stateid, setstateid] = useState(false);
  const [cityid, setcityid] = useState(false);

  const [country, setcountry] = useState(false);
  const [state, setstate] = useState(false);
  const [city, setcity] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const { addRestaurant } = useRestaurantContext();
  const navigate = useNavigate();

  const [timezones, setTimezones] = useState([]);
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Restaurant') {
      navigate('/login');
    }
    setloading(false);
  }, []);


  useEffect(() => {
    if (timezoneLoading) {
      fetch('https://restroproject.onrender.com/api/timezones')
        .then((response) => response.json())
        .then((data) => {
          setTimezones(data);
          setTimezoneLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching timezones:', error);
        });
    }
  }, [timezoneLoading]);

  const handleTimezoneChange = (selectedOption) => {
    setSelectedTimezone(selectedOption);
  };

  const handleTimezoneDropdownFocus = () => {
    if (!timezones.length) {
      setTimezoneLoading(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userid = localStorage.getItem('merchantid');
    const authToken = localStorage.getItem('authToken');
    const originalStrings = credentials.name;
    const cleanedStrings = originalStrings.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();
    const response = await fetch('https://restroproject.onrender.com/api/addrestaurant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',                  
        'Authorization': authToken,
      },
      body: JSON.stringify({
        userid: userid,
        name: credentials.name,
        uniquename: cleanedStrings,
        email: credentials.email,
        type: credentials.type,
        number: credentials.number,
        city: city,
        state: state,
        country: country,
        citydata: credentials.citydata,
        statedata: credentials.statedata,
        countrydata: credentials.countrydata,
        cityid: cityid,
        stateid: stateid,
        countryid: countryid,
        zip: credentials.zip,
        address: credentials.address,
        timezone: selectedTimezone ? selectedTimezone.value : '',
        nickname: credentials.nickname,
      }),
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
        setCredentials({
          name: '',
          uniquename: '',
          email: '',
          type: '',
          number: '',
          citydata: '',
          statedata: '',
          countrydata: '',
          zip: '',
          address: '',
          timezone: '',
          nickname: '',
        });
        const originalString = credentials.name;
        const cleanedString = originalString.replace(/[^\w\s]/gi, '').replace(/\s+/g, '').toLowerCase();

        setMessage(true);
        setAlertShow(json.message);
        navigate('/Restaurantpanel/Restaurents');
        addRestaurant({
          userid: userid,
          name: credentials.name,
          uniquename: cleanedString,
          type: credentials.type,
          email: credentials.email,
          number: credentials.number,
          city: city,
          state: state,
          country: country,
          cityid: cityid,
          stateid: stateid,
          countryid: countryid,
          citydata: credentials.citydata,
          statedata: credentials.statedata,
          countrydata: credentials.countrydata,
          zip: credentials.zip,
          address: credentials.address,
          timezone: credentials.timezone,
          nickname: credentials.nickname,
        });
      }
    }
  };

  const onchange = (event) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });
  };

  return (
    <div className="bg">
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
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none">
            <div>
              <Usernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Nav />
            </div> 
            <div className='mx-5 mt-5'>
              {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Merchants</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/Restaurantpanel/Userdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new merchant
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="col-11 m-auto box shadow">
                    <div className="p-3">
                      <p className="h5">Merchant details</p>
                      <hr />
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputtext1" className="form-label">
                              Merchant Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={credentials.name}
                              onChange={onchange}
                              placeholder="Merchant Name"
                              id="exampleInputtext1"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputtext3" className="form-label">
                              Nickname
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="nickname"
                              value={credentials.nickname}
                              onChange={onchange}
                              placeholder="Nickname"
                              id="exampleInputtext3"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputtext2" className="form-label">
                              Merchant Type
                            </label>
                            <select
                              className="form-select"
                              name="type"
                              onChange={onchange}
                              aria-label="Default select example"
                              required
                            >
                              <option value="">Select Merchant Type</option>
                              <option value="Cafe">Cafe</option>
                              <option value="Hotel">Hotel</option>
                              <option value="Food Truck">Food Truck</option>
                              <option value="Quick Service Restaurant">Quick Service Restaurant</option>
                              <option value="Pub/Bar">Pub/Bar</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">
                              Contact Email
                            </label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              value={credentials.email}
                              onChange={onchange}
                              placeholder="Contact Email"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Number" className="form-label">
                              Phone Number
                            </label>
                            <input
                              type="number"
                              name="number"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Phone Number"
                              id="phonenumber"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Country" className="form-label">
                              Country
                            </label>
                            <CountrySelect
                              name="country"
                              value={credentials.countryid}
                              onChange={(val) => {
                                console.log(val);
                                setcountryid(val.id);
                                setcountry(val.name);
                                    // setCredentials({ ...credentials, country: val.name })
                                    // setCredentials({ ...credentials, countryid: val.id })
                                    setCredentials({ ...credentials, countrydata: JSON.stringify(val) })
                                  
                              }}
                              valueType="short"
                              class="form-control" 
                              placeHolder="Select Country"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="State" className="form-label">
                              State
                            </label>
                            <StateSelect
                                name="state"
                                countryid={countryid} // Set the country selected in the CountryDropdown
                                onChange={(val) => {
                                    console.log(val);
                                    setstateid(val.id);
                                    setstate(val.name);
                                    // setCredentials({ ...credentials, state: val.name })
                                    // setCredentials({ ...credentials, stateid: val.id })
                                    setCredentials({ ...credentials, statedata: JSON.stringify(val) })
                                }}
                                placeHolder="Select State"
                                required
                                />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="City" className="form-label">
                              City
                            </label>
                            <CitySelect
                                countryid={countryid}
                                stateid={stateid}
                                onChange={(val) => {
                                console.log(val);
                                setcityid(val.id);
                                setcity(val.name);
                                // setCredentials({ ...credentials, city: val.name })
                                // setCredentials({ ...credentials, cityid: val.id })
                                setCredentials({ ...credentials, citydata: JSON.stringify(val) })
                                }}
                                placeHolder="Select City"
                                required
                            />
                          </div>
                        </div>
      
                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Timezone" className="form-label">
                              Timezone
                            </label>
                            {/* <Select
                              name="timezone"
                              options={timezones.map((tz) => ({ value: tz, label: tz }))}
                              onChange={handleTimezoneChange}
                              onFocus={handleTimezoneDropdownFocus}
                              value={timezones.find((tz) => tz === credentials.timezone )}
                              placeholder="Select Timezone"
                              isSearchable
                              required
                            /> */}
                            <Select
                              name="timezone"
                              options={timezones.map((tz) => ({ value: tz, label: tz }))}
                              onChange={(e)=>handleTimezoneChange(e.value)}
                              onFocus={handleTimezoneDropdownFocus}
                              defaultValue={selectedTimezone} // Use selectedTimezone value here
                              placeholder="Select Timezone"
                              isSearchable
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Zip" className="form-label">
                              Zip
                            </label>
                            <input
                              type="text"
                              name="zip"
                              onChange={onchange}
                              className="form-control"
                              placeholder="Zip"
                              id="Zip"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="Address" className="form-label">
                              Address
                            </label>
                            <input
                              type="message"
                              name="address"
                              onChange={onchange}
                              className="form-control"
                              placeholder="Address"
                              id="Address"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row pt-4 pe-2">
                  <div className="col-3 me-auto"></div>
                  <div className="col-4 col-sm-2">
                    <button className="btn btnclr text-white">Next</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
}
    </div>
  );
}
