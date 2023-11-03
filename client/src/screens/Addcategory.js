import React, { useState } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './userpanel/Nav';

export default function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const restaurantId = location.state?.restaurantId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://localhost:3001/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    name: categoryName,
                    userid:userid
                })
            });

            const json = await response.json();

            if (json.success) {
                navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } });
            } else {
                console.error('Error adding category:', json.message);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleCancelAddCategory = () => {
        navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } });
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
                                <p className='h5 fw-bold'>Add Category</p>
                                {/* Rest of your navigation and layout */}
                            </div>
                            <hr />

                            <form onSubmit={handleSubmit}>
                                <div className="row mt-3">
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4 ">
                                        <div className="mb-3">
                                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="categoryName"
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder='Category Name'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <button onClick={() => handleCancelAddCategory()} className='btn btn-secondary b-radius text-white'>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}