import React, { useState, useEffect } from 'react';
import Retaiernavbar from './Retaiernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Retailernav from './Retailernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner';
import noimage from '../noimage.png'

export default function Addproduct() {
  const [ loading, setloading ] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    colour: '',
    quantity: '',
  });

  const [message, setMessage] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  
  const location = useLocation();
  const storeId = location.state?.storeId;

//   useEffect(() => {
//     if(!localStorage.getItem("authToken"))
//     {
//       navigate("/login");
//     }
// }, []);

useEffect(() => {
  const authToken = localStorage.getItem('authToken');
  const signUpType = localStorage.getItem('signuptype');

  if (!authToken || signUpType !== 'Retailer') {
    navigate('/login');
  }
  setloading(false);
}, []);

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  setImage(file);
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    let userid = localStorage.getItem('merchantid');
    const authToken = localStorage.getItem('authToken');

    let cloudinaryData;
            let defaultImageData;

            // Check if user uploaded an image
            if (image) {
                const formData = new FormData();
                formData.append('upload_preset', 'restrocloudnary');
                formData.append('cloud_name', 'dlq5b1jed');
                formData.append('file', image);

                // Upload image to Cloudinary
                const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                cloudinaryData = await cloudinaryResponse.json();
            } else {
                const formData = new FormData();
                formData.append('upload_preset', 'restrocloudnary');
                formData.append('cloud_name', 'dlq5b1jed');
                formData.append('file', noimage);

                // Upload default image to Cloudinary
                const defaultImageResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                defaultImageData = await defaultImageResponse.json();
            }

    const response = await fetch('https://restroproject.onrender.com/api/addproduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify({
        userid: userid,
        storeId: storeId,
        name: credentials.name,
        description: credentials.description,
        price: credentials.price,
        size: credentials.size,
        colour: credentials.colour,
        quantity: credentials.quantity,
        isAvailable: isAvailable,
        imageUrl: image ? cloudinaryData.secure_url : defaultImageData.secure_url,
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
    console.log(json);

    if (json.Success) {
      setCredentials({
        name: '',
        description: '',
        price: '',
        size: '',
        colour: '',
        quantity: '',
        imageUrl: '',
      });

      setMessage(true);
      setAlertShow(json.message);
      navigate('/Retailerpanel/Products', { state: { storeId } });
      Addproduct({
        userid: userid,
        name: credentials.name,
        description: credentials.description,
        price: credentials.price,
        size: credentials.size,
        colour: credentials.colour,
        quantity: credentials.quantity,
        isAvailable: isAvailable,
        imageUrl: image ? cloudinaryData.secure_url : defaultImageData.secure_url,
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
              <Retaiernavbar />
            </div>
          </div>

          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className="d-lg-none d-md-none d-block mt-2">
              <Retailernav />
            </div>
            <div className='mx-5 mt-5'>
              {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white my-5 p-4 box mx-4">
                <div className="row">
                  <p className="h5 fw-bold">Products</p>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/Retailerpanel/Retailerdashboard" className="txtclr text-decoration-none">
                          Dashboard
                        </a>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        Add a new product
                      </li>
                    </ol>
                  </nav>
                </div>
                <hr />
                <div className="row">
                  <div className="col-11 m-auto box shadow">
                    <div className="p-3">
                      <p className="h5">Product details</p>
                      <hr />
                      <div className="row">
                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                            Product Name
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              value={credentials.name}
                              onChange={onchange}
                              placeholder="Product Name"
                              id="exampleInputtext1"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description</label>
                              <textarea
                                type="text"
                                  className="form-control"
                                  id="description"
                                  name="description"
                                  value={credentials.description}
                                  onChange={onchange}
                                  placeholder='Description'
                                  required
                              />
                          </div>
                        </div>

                        
                        <div className="col-10 col-sm-6 col-md-6 col-lg-4">
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
                              Size
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="size"
                              value={credentials.size}
                              onChange={onchange}
                              placeholder="Size"
                              id="size"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="colour" className="form-label">
                            Colour
                            </label>
                            <input
                              type="text"
                              name="colour"
                              className="form-control"
                              onChange={onchange}
                              placeholder="Colour"
                              id="colour"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4">
                          <div className="mb-3">
                            <label htmlFor="quantity" className="form-label">
                              Quantity
                            </label>
                            <input
                              type="number"
                              name="quantity"
                              onChange={onchange}
                              className="form-control"
                              placeholder="Quantity"
                              id="quantity"
                              required
                            />
                          </div>
                        </div>
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="image" className="form-label">Upload Image</label>
                                            <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            />
                                        </div>
                                    </div>
                        <div className="col-12 col-sm-6 col-lg-4">
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
