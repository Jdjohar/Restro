import React, { useState,useEffect } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';

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
                    <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
                        <Usernavbar />
                    </div>

                    <div className="col-10">
                        <div className="bg-white mt-5 px-3 py-5 box">
                            <div className='row'>
                                <p className='h5'>Add SubCategory</p>
                                {/* Rest of your navigation and layout */}
                            </div>
                            <hr />

                            <form onSubmit={handleSubmit}>
                                <div className="row mt-3">
                                    <div className="col-4">
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
                                    <div className="col-4">
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
                                    <a onClick={() => handleCancelAddSubCategory()} className='btn btn-secondary text-white'>Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
