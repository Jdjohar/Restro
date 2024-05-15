import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Adminimagedetail() {
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Admin Panel') {
      navigate('/login');
    }
    // setloading(false);
  }, []);

  const submitImage =()=>{
    console.log("Start Submit");
    const data = new FormData();
    data.append('file', image);
    data.append("upload_preset","restrocloudnary")
    data.append("cloud_name","dlq5b1jed")
    console.log(data, "Start Submit 2");
    fetch("https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload",{
      method:"post",
      body:data
    })
    .then((res)=>res.json())
    .then((data)=>{
      
        // After image upload succeeds, save image details to MongoDB
        const imageData = {
          imageName: imageName,
          imageUrl: data.secure_url,
          category: category,
        };

        // Send image details to your backend server to save in MongoDB using an API endpoint
        fetch('https://restroproject.onrender.com/api/saveImage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(imageData)
        })
          .then((response) => response.json())
          .then((result) => {
            console.log('Image details saved:', result);
            alert("Image details saved")
          })
          .catch((error) => {
            console.error('Error saving image details:', error);
          });
    })
    .catch((err)=>{
      console.log(err);
    })

    console.log("After Fetch Api");
  }
  const navigatepage =()=>{
    navigate('/Adminpanel/UploadImage')
  }

  return (
    <div className='bg'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
              <Adminnavbar />
          </div>
          <div className="col-lg-10 col-md-9 col-12 mx-auto">
            <div className='d-lg-none d-md-none d-block mt-2'>
              {/* <Nav/> */}
            </div>
            <div className="bg-white my-5 p-4 box mx-4">
              <div className='row'>
                <p className='h5 fw-bold'>Add Admin detail</p>
                  </div>
                  <hr />

                  {/* <form> */}
                    <div className="row mt-3">
                      <div className="col-10 col-sm-6 col-md-6 col-lg-4 ">
                        <div className="mb-3">
                          <label htmlFor="fileInput">Select Image</label>
                          <input 
                            type="file" 
                            id="fileInput" 
                            className="form-control"
                            onChange={(e) => setImage(e.target.files[0])} 
                          />
                        </div>
                      </div>
                      <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="imageNameInput">Image Name</label>
                          <input
                            type="text"
                            id="imageNameInput"
                            value={imageName}
                            className="form-control"
                            onChange={(e) => setImageName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                        <div className="mb-3">
                          <label htmlFor="categoryInput">Category</label>
                          <select
                            id="categoryInput"
                            value={category}
                            className="form-control"
                            onChange={(e) => setCategory(e.target.value)}
                          >
                            <option value="">Select Category</option>
                            <option value="Restaurant">Restaurant</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Service Provider">Service Provider</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex mt-3">
                      <button onClick={submitImage} className='btn btnclr text-white me-2'>Save</button>
                      {/* <button onClick={submitImage}>Submit</button> */}
                    </div>
                  {/* </form> */}
              </div>
          </div>
        </div>
      </div>
      
      {/* <div>
        <label htmlFor="fileInput">Select Image:</label>
        <input type="file" id="fileInput" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={submitImage}>Submit</button>
      </div>
      <div>
        <label htmlFor="imageNameInput">Image Name:</label>
        <input
          type="text"
          id="imageNameInput"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
        />
      </div>
      <div>
          <label htmlFor="categoryInput">Category:</label>
          <select
            id="categoryInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Retailer">Retailer</option>
            <option value="Service Provider">Service Provider</option>
          </select>
        </div> */}
    </div>
  );
}
