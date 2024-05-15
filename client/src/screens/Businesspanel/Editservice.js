import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Servicenavbar from './Servicenavbar';
import Servicenav from './Servicenav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function Editservice() {
    const location = useLocation();
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState('');
    const [ loading, setloading ] = useState(true);
    
    const serviceId = location.state?.serviceId;
    const businessId = location.state?.businessId;
    const [imageUrl, setImageUrl] = useState('');
    const [image, setImage] = useState(null);

    
  const [services, setServices] = useState({
    name: '',
    price: '',
    time: '',
    isAvailable: false 
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }
        fetchServiceData();
  }, []);

    const fetchServiceData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/getservices/${serviceId}`, {
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
                    setServices(json.service);
                    setImageUrl(json.service.imageUrl);
                } else {
                    console.error('Error fetching services:', json.message);
                }
                console.log(services);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setImage(file);
    };

    const handleSaveClick = async () => {
        try {
            const updatedService = {
                ...services,
                imageUrl: image ? await uploadImageToCloudinary(image) : imageUrl,
            };
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/updateservice/${serviceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedService)
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
                    setServices(updatedService);
                    navigate('/Businesspanel/Services', { state: { businessId } });
                    console.log(updatedService);
                } else {
                    console.error('Error updating product:', json.message);
                }
              }
            
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const uploadImageToCloudinary = async (imageFile) => {
      try {
        const formData = new FormData();
        formData.append('upload_preset', 'restrocloudnary');
        formData.append('cloud_name', 'dlq5b1jed');
        formData.append('file', imageFile);
    
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
          method: 'POST',
          body: formData,
        });
    
        const cloudinaryData = await cloudinaryResponse.json();
        return cloudinaryData.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return null;
      }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        // If the input is a checkbox, handle it differently
        const inputValue = type === 'checkbox' ? checked : value;
    
        setServices({ ...services, [name]: inputValue });
    };

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setServices({ ...services, [name]: value });
    // };

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
                                    <p className='h5 fw-bold'>Edit Service</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Businesspanel/Businessdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Businesspanel/Services" className='txtclr text-decoration-none'>services</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Service</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="ServiceName" className="form-label">Service Name</label>
                                            <input type="text" className="form-control" name="name" value={services.name} onChange={handleInputChange} placeholder='Service Name' id="ServiceName"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input type="number" className="form-control" name="price" value={services.price} onChange={handleInputChange} placeholder='Price' id="price"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="time" className="form-label">Time</label>
                                            <input type="text" className="form-control" name="time" value={services.time} onChange={handleInputChange} placeholder='Time' id="time"/>
                                        </div>
                                    </div><div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                        <label htmlFor="imageUrl" className="form-label">Current Image</label>
                                        {imageUrl ? (
                                            <div>
                                            <img src={imageUrl} alt="Current Item Image" className='item-image flex-shrink-0 img-fluid rounded' />
                                            <div className="mt-2">
                                                <label htmlFor="newImage" className="form-label">Upload New Image</label>
                                                <input
                                                type="file"
                                                className="form-control"
                                                id="newImage"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                />
                                            </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                            <label htmlFor="newImage" className="form-label">Upload New Image</label>
                                            <input
                                            type="file"
                                            className="form-control"
                                            id="newImage"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            />
                                        </div>
                                        )}
                                        </div>
                                    </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="isAvailable"
                                                    checked={services.isAvailable}
                                                    onChange={(e) =>
                                                        setServices({ ...services, isAvailable: e.target.checked })
                                                    }
                                                />
                                                <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
                                            </div>
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
