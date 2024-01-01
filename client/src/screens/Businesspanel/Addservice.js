import React, { useState, useEffect } from 'react';
import Servicenavbar from './Servicenavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Servicenav from './Servicenav';
import { ColorRing } from  'react-loader-spinner'

export default function Addservice() {
  const [ loading, setloading ] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    price: '',
    time: '',
  });

  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const navigate = useNavigate();
  
  const location = useLocation();
  const businessId = location.state?.businessId;

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }
    setloading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let userid = localStorage.getItem('userid');
    const response = await fetch('https://restroproject.onrender.com/api/addservice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userid: userid,
        businessId: businessId,
        name: credentials.name,
        price: credentials.price,
        time: credentials.time,
        isAvailable: isAvailable,
      }),
    });

    const json = await response.json();
    console.log(json);

    if (json.Success) {
      setCredentials({
        name: '',
        price: '',
        time: '',
      });

      setMessage(true);
      setAlertShow(json.message);
      navigate('/Businesspanel/Services', { state: { businessId } });
      Addservice({
        userid: userid,
        name: credentials.name,
        price: credentials.price,
        time: credentials.time,
        isAvailable: isAvailable,
      });
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
              <Servicenavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Servicenav />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Service</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/Businesspanel/Businessdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new service
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="col-11 m-auto box shadow">
                    <div className="p-3">
                      <p className="h5">Service details</p>
                      <hr />
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                            Service Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={credentials.name}
                              onChange={onchange}
                              placeholder="Service Name"
                              id="exampleInputtext1"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-10 col-sm-6 col-md-6 col-lg-6">
                          <div className="mb-3">
                            <label htmlFor="price" className="form-label">price</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                id="price"
                                defaultValue={credentials.price}
                                onChange={onchange}
                                placeholder='price'
                                required 
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="size" className="form-label">
                              Time
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="time"
                              value={credentials.time}
                              onChange={onchange}
                              placeholder="Time"
                              id="time"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="col-12 col-sm-12 col-lg-12">
                            <div className="mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isAvailable"
                                        checked={isAvailable}
                                        onChange={(e) => setIsAvailable(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
                                </div>
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
