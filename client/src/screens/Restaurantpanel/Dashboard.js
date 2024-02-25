import React, { useState, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { ColorRing } from  'react-loader-spinner'
import Alertauthtoken from '../../components/Alertauthtoken';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [ loading, setloading ] = useState(true);
  const [dashboard, setDashboard] = useState([]);
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // const handleImageChange = async (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     const formData = new FormData();
  //     formData.append('image', file);

  //     try {
  //       const response = await fetch('https://real-estate-1kn6.onrender.com/api/upload', {
  //         method: 'POST',
  //         body: formData,
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         console.log(data);
  //         setTextResult(data.text);
  //       } else {
  //         console.error('Image upload failed.');
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   }
  // };

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Restaurant') {
      navigate('/login');
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userid = localStorage.getItem('merchantid');
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://real-estate-1kn6.onrender.com/api/dashboard/${userid}`, {
        headers: {
          'Authorization': authToken,
        }
      });

      if (response.status === 401) {
        const data = await response.json();
        setAlertMessage(data.message);
        setloading(false);
        window.scrollTo(0,0);
        return; // Stop further execution
      }
      const data = await response.json();
      setRestaurantCount(data.restaurantCount);
      setCategoryCount(data.categoryCount);
      setItemCount(data.itemCount);
      setloading(false);
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
          <div className=''>
            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
          </div>
          <div className='row d-flex justify-content-evenly'>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4 '>
              <div className='box1 fw-bold rounded adminborder p-4 m-2'>
                <p className='fs-4 fw-bold'>Total Merchants</p>
                <p className='fs-4'>{restaurantCount}</p>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder py-4 px-3 m-2'>
                <p className='fs-4 fw-bold'>Total Food Categories</p>
                <p className='fs-4'>{categoryCount}</p>
              </div>
            </div>
            <div className='col-12 col-sm-6 col-md-6 col-lg-4'>
              <div className='box1 fw-bold rounded adminborder p-4 m-2'>
                <p className='fs-4 fw-bold'>Total Items</p>
                <p className='fs-4'>{itemCount}</p>
              </div>
            </div>

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
