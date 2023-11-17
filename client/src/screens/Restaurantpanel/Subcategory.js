import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner'

export default function Subcategory() {
    const [ loading, setloading ] = useState(true);
    const [Subcategories, setSubcategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const subcategoryId = location.state?.subcategoryId;
    const categoryId = location.state?.categoryId;

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        if (categoryId) {
            fetchCategories();
        }
    }, [categoryId]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getsubcategories/${categoryId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setSubcategories(json);
            }
            setloading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handleAddCategoryClick = () => {
        navigate('/Restaurantpanel/Addsubcategories', { state: { categoryId: categoryId } });
    }

    const handleEditCategoryClick = (category) => {
        navigate('/Restaurantpanel/EditSubcategory', { state: { subcategoryId: category._id } });
    }

    const handleMenuViewClick = (Subcategory) => {
        let subcategoryId = Subcategory._id;
        navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
    };

    const handleDeleteSubCategoryClick = async (subcategoryId) => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/subcategories/${subcategoryId}`, {
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
                            <div className='row py-2'>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 me-auto">
                                    <p className='h5 fw-bold'>Sub -Category</p>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-6 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddCategoryClick}>+ Add SubCategory</button>
                                </div>
                            </div><hr />

                            <div className="row px-2 table-responsive">
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
}
        </div>
    )
}

