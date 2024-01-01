import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { useNavigate } from 'react-router-dom';
import { ColorRing } from  'react-loader-spinner'

export default function Dashboard() {
  const [ loading, setloading ] = useState(true);
  const [dashboard, setDashboard] = useState([]);
  const [businessCount, setBusinessCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
//   const [itemCount, setItemCount] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [textResult, setTextResult] = useState('');

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       const formData = new FormData();
//       formData.append('image', file);

//       try {
//         const response = await fetch('https://restroproject.onrender.com/api/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log(data);
//           setTextResult(data.text);
//         } else {
//           console.error('Image upload failed.');
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//   };

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restroproject.onrender.com/api/businessdashboard/${userid}`);
      const data = await response.json();
      setBusinessCount(data.businessCount);
      setServicesCount(data.servicesCount);
      setloading(false);
    //   setItemCount(data.itemCount);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };


  return (
    <div>
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
      <div className='mx-4'>
        <div className=''>
          <div className='txt px-4 py-4'>
            <h2 className='fs-35 fw-bold'>Dashboard</h2>
          </div>
          <div className='row'>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4 '>
              <div className='box1 fw-bold rounded adminborder p-4 m-2'>
                <p className='fs-25 fw-bold'>Total Business</p>
                <p className='h4'>{businessCount}</p>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <p className='fs-25 fw-bold'>Total Services</p>
                <p className='h4'>{servicesCount}</p>
              </div>
            </div>
            {/* <div className='col-12 col-sm-6 col-md-6 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder p-4 m-2'>
                <p className='fs-25 fw-bold'>Total Items</p>
                <p className='h4'>{itemCount}</p>
              </div>
            </div> */}

            {/* <div>
                <h1>Image to Text Converter</h1>
                <div className="input-wrapper">
                    <label htmlFor="upload">Upload Image</label>
                    <input type="file" accept="image/*" id="upload" onChange={handleImageChange} />
                </div>

                {selectedImage && (
                    <div className="box-image">
                    <img src={URL.createObjectURL(selectedImage)} alt="thumb" className="img-fluid w-50" />
                    </div>
                )}

                {textResult && (
                    <div className="box-p">
                        <h2>Text Result:</h2>
                        <div className=' d-flex justify-content-between'>
                            {textResult.split('\n').map((line, index) => (
                            <p key={index}>
                                    {line.replaceAll('\n', '<br>')}
                                    </p>
                            ))}
                        </div>
                    </div>
                )}
            </div> */}
          </div>
        </div>
      </div>
}
    </div>
  );
}
