import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Subcategory() {
    const [Subcategories, setSubcategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const subcategoryId = location.state?.subcategoryId;
    const categoryId = location.state?.categoryId;

    useEffect(() => {
        if (categoryId) {
            fetchCategories();
        }
    }, [categoryId]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getsubcategories/${categoryId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setSubcategories(json);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handleAddCategoryClick = () => {
        navigate('/Userpanel/Addsubcategories', { state: { categoryId: categoryId } });
    }

    const handleEditCategoryClick = (category) => {
        navigate('/Userpanel/EditSubcategory', { state: { subcategoryId: category._id } });
    }

    const handleMenuViewClick = (Subcategory) => {
        let subcategoryId = Subcategory._id;
        navigate('/Userpanel/Items', { state: { subcategoryId } });
    };

    const handleDeleteSubCategoryClick = async (subcategoryId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/subcategories/${subcategoryId}`, {
                method: 'DELETE'
            });

            const json = await response.json();

            if (json.success) {
                fetchCategories(); // Refresh the categories list
            } else {
                console.error('Error deleting Subcategory:', json.message);
            }
        } catch (error) {
            console.error('Error deleting Subcategory:', error);
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
                                    <p className='h5'>Sub -Category</p>
                                </div>
                                <div className="col-2">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddCategoryClick}>+ Add SubCategory</button>
                                </div>
                            </div><hr />

                            <div className="row px-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID </th>
                                            <th scope="col" className='text-center'>Sub-Categories</th>
                                            <th scope="col" className='text-center'>Items</th>
                                            <th scope="col">Edit/Delete</th>
                                            <th scope="col">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Subcategories.map((Subcategory, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{Subcategory.name}</td>
                                                {/* Render sub-categories here */}
                                                {/* <td>
                                                    {category.subCategories.map((subCategory, subIndex) => (
                                                        <div key={subIndex}>{subCategory.name}</div>
                                                    ))}
                                                </td> */}
                                                {/* Rest of your table row */}
                                                <td className='text-center'>
                                                     <a href="" className='text-black text-center' onClick={ () => handleMenuViewClick(Subcategory)}>
                                                         <i class="fa-solid fa-eye"></i>
                                                     </a>
                                                 </td>
                                                 <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditCategoryClick(Subcategory)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteSubCategoryClick(Subcategory._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                 <td>{Subcategory.createdAt}</td>
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

