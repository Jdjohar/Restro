import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Category from './Category';

export default function Menu() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const restaurantId = location.state?.restaurantId;

    useEffect(() => {
        if (restaurantId) {
            fetchCategories();
        }
    }, [restaurantId]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurantcategories/${restaurantId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setCategories(json);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handleAddCategoryClick = () => {
        navigate('/Userpanel/AddCategory', { state: { restaurantId: restaurantId } });
    }

    const handleEditCategoryClick = (category) => {
        navigate('/Userpanel/EditCategory', { state: { categoryId: category._id } });
    }

    const handleSubcategoryViewClick = (category) => {
        let categoryId = category._id;
        navigate('/Userpanel/Subcategory', { state: { categoryId } });
    };

    const handleViewItemsClick = () => {
        navigate('/Userpanel/Items', { state: { restaurantId } });
    };

    const handleDeleteCategoryClick = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            const json = await response.json();

            if (json.success) {
                fetchCategories(); // Refresh the categories list
            } else {
                console.error('Error deleting category:', json.message);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    // Rest of your component code

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
                        <Usernavbar />
                    </div>

                    <div className="col-10">
                        <div className="bg-white mt-5 p-3 box mb-5">
                            <div className='row'>
                                <div className="col-4 me-auto">
                                    <p className='h5'>Menu</p>
                                    {/* Rest of your navigation and layout */}
                                </div>
                                <div className="col-2">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddCategoryClick}>+ Add Category</button>
                                </div>
                            </div><hr />

                            <div className="row px-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID </th>
                                            <th scope="col">Category</th>
                                            <th scope="col" className='text-center pointer'>Sub-Categories</th>
                                            <th scope="col" className='text-center'>Items</th>
                                            <th scope="col">Edit/Delete</th>
                                            <th scope="col">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{category.name}</td>
                                                {/* Render sub-categories here */}
                                                {/* <td>
                                                    {category.subCategories.map((subCategory, subIndex) => (
                                                        <div key={subIndex}>{subCategory.name}</div>
                                                    ))}
                                                </td> */}
                                                {/* Rest of your table row */}
                                                <td className='text-center'>
                                                     <a className='text-black text-center pointer' onClick={ () => handleSubcategoryViewClick(category)}>
                                                         <i class="fa-solid fa-eye"></i>
                                                     </a>
                                                 </td>
                                                <td className='text-center'>
                                                     <a className='text-black text-center pointer' onClick={ () => handleViewItemsClick()}>
                                                         <i class="fa-solid fa-eye"></i>
                                                     </a>
                                                 </td>
                                                 <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditCategoryClick(category)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteCategoryClick(category._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                 <td>{category.createdAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

