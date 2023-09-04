import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EditCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const categoryId = location.state?.categoryId;
    console.log(categoryId);

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
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const handleEditCategory = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
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
                navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } }); // Redirect to the menu page after editing
            } else {
                console.error('Error updating category:', json.message);
            }
        } catch (error) {
            console.error('Error updating category:', error);
        }
    }

    const handleCancelEditCategory = () => {
        navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } });
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
                                <p className='h5'>Edit Category</p>
                                {/* Rest of your navigation */}
                            </div>
                            <hr />

                            <form onSubmit={handleEditCategory}>
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
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <a onClick={() => handleCancelEditCategory()} className='btn btn-secondary text-white'>Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

