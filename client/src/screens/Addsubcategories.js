import React, { useState,useEffect } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './userpanel/Nav';

export default function Addsubcategories() {
    const [SubCategoryName, setSubCategoryName] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const categoryId = location.state?.categoryId;
    useEffect(() => {
        if (categoryId) {
            fetchCategoryData();
        }
    }, [categoryId]);

    const fetchCategoryData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getcategories/${categoryId}`);
            const json = await response.json();

            setCategoryName(json.name);
            setrestaurantId(json.restaurantId);
            // setcategoryId(json.restaurantId);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/subcategories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    category: categoryId,
                    name: SubCategoryName
                })
            });

            const json = await response.json();

            if (json.success) {
                navigate('/Userpanel/Subcategory', { state: { categoryId: categoryId } });
            } else {
                console.error('Error adding subcategory:', json.message);
            }
        } catch (error) {
            console.error('Error adding subcategory:', error);
        }
    };

    const handleCancelAddSubCategory = () => {
        navigate('/Userpanel/Subcategory', { state: { categoryId: categoryId } });
    }

    return (
        <div className='bg'>
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
                                <p className='h5 fw-bold'>Add SubCategory</p>
                                {/* Rest of your navigation and layout */}
                            </div>
                            <hr />

                            <form onSubmit={handleSubmit}>
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
                                    <button onClick={() => handleCancelAddSubCategory()} className='btn btn-secondary b-radius text-white'>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
