import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Adminnavbar from './Adminnavbar';

export default function Template() {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
      jsonData: '',
      imageUrl: '',
      name: '',
      category: '',
    });

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Admin Panel') {
          navigate('/login');
        }
        // setloading(false);
      }, []);

      const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
    //   const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     setFormData((prevData) => ({
    //       ...prevData,
    //       image: file,
    //     }));
    //   };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        // Check if user uploaded an image
        if (image) {
          const formData = new FormData();
          formData.append('upload_preset', 'restrocloudnary'); // Replace 'restrocloudnary' with your actual upload preset name
          formData.append('cloud_name', 'dlq5b1jed'); // Replace 'dlq5b1jed' with your Cloudinary cloud name
          formData.append('file', image);
    
          // Upload image to Cloudinary
          const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
            method: 'POST',
            body: formData,
          });
          const cloudinaryData = await cloudinaryResponse.json();
    
          // Assuming image upload to Cloudinary was successful, update formData with the image URL
          setFormData((prevData) => ({
            ...prevData,
            imageUrl: cloudinaryData.secure_url, // Assuming Cloudinary returns 'secure_url' for the image URL
          }));
        }
    
        // Now that formData is updated with the image URL (if uploaded), proceed to save data
        const response = await fetch('https://restroproject.onrender.com/api/saveData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        console.log(data); // Assuming the backend responds with a success message
        // Add any further actions after successful submission
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    
      // const handleSubmit = async (e) => {
      //   e.preventDefault();
      //   // const cleanedDescription = formData.description.replace(/\\/g, '').replace(/\n/g, '');
      //   try {
      //     let cloudinaryData;
      //       let defaultImageData;

      //       // Check if user uploaded an image
      //       // if (image) {
      //           const formData = new FormData();
      //           formData.append('upload_preset', 'restrocloudnary');
      //           formData.append('cloud_name', 'dlq5b1jed');
      //           formData.append('file', image);

      //           // Upload image to Cloudinary
      //           const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
      //               method: 'POST',
      //               body: formData,
      //           });
      //           cloudinaryData = await cloudinaryResponse.json();
      //       // } else {
      //       //     const formData = new FormData();
      //       //     formData.append('upload_preset', 'restrocloudnary');
      //       //     formData.append('cloud_name', 'dlq5b1jed');
      //       //     formData.append('file', noimage);

      //       //     // Upload default image to Cloudinary
      //       //     const defaultImageResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
      //       //         method: 'POST',
      //       //         body: formData,
      //       //     });
      //       //     defaultImageData = await defaultImageResponse.json();
      //       // }
      //     const response = await fetch('https://restroproject.onrender.com/api/saveData', {
      //       method: 'POST',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       body: JSON.stringify(formData
      //       ),
      //     });
      //     const data = await response.json();
      //     console.log(data); // Assuming the backend responds with a success message
      //     // Add any further actions after successful submission
      //   } catch (error) {
      //     console.error('Error:', error);
      //   }
      // };


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
                <p className='h5 fw-bold'>Template detail</p>
                  </div>
                  <hr />
                <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="jsonData" className="form-label">Json</label>
                  <textarea
                    className="form-control"
                    id="jsonData"
                    name="jsonData"
                    value={formData.jsonData}
                    onChange={handleChange}
                  />
                </div>
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
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Category</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Italian">Italian</option>
                  </select>
                </div>
                <button type="submit" className='btn btnclr text-white me-2'>Submit</button>
              </form>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
