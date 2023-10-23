import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';

import Usernavbar from './Usernavbar';

export default function EditSubcategory() {
    const [SubCategoryName, setSubCategoryName] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [categoryId, setcategoryId] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const subcategoryId = location.state.subcategoryId;

    const [Subcategory, setSubcategory] = useState({
        name: ''
    });

    useEffect(() => {
        if (subcategoryId) {
            fetchSubCategoryData();
        }
    }, [subcategoryId]);

    const fetchSubCategoryData = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getsinglesubcategory/${subcategoryId}`);
            const json = await response.json();

            setSubCategoryName(json.name);
            setcategoryId(json.category);
            setrestaurantId(json.restaurantId);
            await fetchCategoryData(json.category);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }
    
    const fetchCategoryData = async (categoryId) => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getcategories/${categoryId}`);
            const json = await response.json();

            setCategoryName(json.name);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    const handleSaveClick = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/subcategoriesupdate/${subcategoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: SubCategoryName,
                    category:categoryId,
                    restaurantId: restaurantId,
                })
            });

            const json = await response.json();

            if (json.success) {
                // console.error('Error updating subcategory:', json.message);
                navigate('/Userpanel/Subcategory', { state: { categoryId } });
            } else {
                console.error('Error updating subcategory:', json.message);
            }
        } catch (error) {
            console.error('Error updating subcategory:', error);
        }
    };
    
    const handleCancelEditSubCategory = () => {
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
                        <form onSubmit={handleSaveClick}>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Subcategory</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Userpanel/Subcategory" className='txtclr text-decoration-none'>Subategories</a>
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
        </div>
  )
}
