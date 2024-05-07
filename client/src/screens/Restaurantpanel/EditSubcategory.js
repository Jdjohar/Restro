import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

import Usernavbar from './Usernavbar';

export default function EditSubcategory() {
    const [ loading, setloading ] = useState(true);
    const [SubCategoryName, setSubCategoryName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setcategoryId] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const subcategoryId = location.state.subcategoryId;

    const [Subcategory, setSubcategory] = useState({
        name: ''
    });

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        if (subcategoryId) {
            fetchSubCategoryData();
        }
    }, [subcategoryId]);

    const fetchSubCategoryData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3001/api/getsinglesubcategory/${subcategoryId}`, {
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
                setSubCategoryName(json.name);
                setcategoryId(json.category);
                setrestaurantId(json.restaurantId);
                await fetchCategoryData(json.category);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }
    
    const fetchCategoryData = async (categoryId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3001/api/getcategories/${categoryId}`, {
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
                setCategoryName(json.name);
              }
            
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const handleSaveClick = async (e) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3001/api/subcategoriesupdate/${subcategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify({
                    name: SubCategoryName,
                    category:categoryId,
                    restaurantId: restaurantId,
                })
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

                if (json.success) {
                    // console.error('Error updating subcategory:', json.message);
                    navigate('/Restaurantpanel/Subcategory', { state: { categoryId } });
                } else {
                    console.error('Error updating subcategory:', json.message);
                } 
            }

            
        } catch (error) {
            console.error('Error updating subcategory:', error);
        }
    };
    
    const handleCancelEditSubCategory = () => {
        navigate('/Restaurantpanel/Subcategory', { state: { categoryId: categoryId } });
    }

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
                    <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                        <Usernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Nav/>
                        </div>
                        <div className='mx-5 mt-5'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <form onSubmit={handleSaveClick}>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Subcategory</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Restaurantpanel/Subcategory" className='txtclr text-decoration-none'>Subategories</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Subcategory</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row mt-3">
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="categoryName"
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder='Category Name'
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="categoryName" className="form-label">SubCategory Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="SubcategoryName"
                                                value={SubCategoryName}
                                                onChange={(e) => setSubCategoryName(e.target.value)}
                                                placeholder='SubCategory Name'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <button onClick={() => handleCancelEditSubCategory()} className='btn btn-secondary b-radius text-white'>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
  )
}
