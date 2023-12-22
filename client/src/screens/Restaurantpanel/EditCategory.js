import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner'

export default function EditCategory() {
    const [ loading, setloading ] = useState(true);
    const [categoryName, setCategoryName] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const categoryId = location.state?.categoryId;
    console.log(categoryId);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Restaurant') {
      navigate('/login');
    }
        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/getcategories/${categoryId}`);
            const json = await response.json();

            setCategoryName(json.name);
            setrestaurantId(json.restaurantId);
            setloading(false);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const handleEditCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/categories/${categoryId}`, {
                method: 'PUT', // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    name: categoryName
                })
            });

            const json = await response.json();

            if (json.success) {
                navigate('/Restaurantpanel/Menu', { state: { restaurantId: restaurantId } }); // Redirect to the menu page after editing
            } else {
                console.error('Error updating category:', json.message);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }

    const handleCancelEditCategory = () => {
        navigate('/Restaurantpanel/Menu', { state: { restaurantId: restaurantId } });
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
                        <div className="bg-white my-5 p-4 box mx-4">
                            <div className='row'>
                                <p className='h5 fw-bold'>Edit Category</p>
                                {/* Rest of your navigation */}
                            </div>
                            <hr />

                            <form onSubmit={handleEditCategory}>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <button onClick={() => handleCancelEditCategory()} className='btn btn-secondary b-radius text-white'>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
}
        </div>
    )
}

