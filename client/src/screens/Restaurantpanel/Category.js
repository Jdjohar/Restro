import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';

export default function Category() {
    const [categories, setcategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        fetchdata();
      }, []);

    const handleAddClick = () => {
        navigate('/Restaurantpanel/Addcategory');
    }

    const fetchdata = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch("https://restroproject.onrender.com/api/categories", {
                headers: {
                  'Authorization': authToken,
                }
              });
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setcategories(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        let categoryId = category._id;
        navigate('/Restaurantpanel/EditCategory', { state: { categoryId } });
    };

    

    const handleDeleteClick = async (categoryId) => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/categories/${categoryId}`, {
                method: 'DELETE'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata(); // Fetch updated data after deletion
            } else {
                console.error('Error deleting category:', json.message);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>

                <div className="col-10">
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row'>
                            <div className="col-4 me-auto">
                                <p className='h5'>Categories</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Categories</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-2">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        
                        <div className="row" >
                        {categories.map((category) => (
                            <div className="col-4"  key={category._id}>
                                <div class="card mb-3" >
                                    <div class="card-body">
                                        <div className="row">
                                            <div className="col-3">
                                                <img src="../imgg.jpg" alt="" className='img-fluid rounded-circle' />
                                            </div>
                                            <div className="col-8">
                                                <p className='h5 fs-6 fw-bold'>{category.name}</p>
                                                <p className=''>{category.createdAt}</p>
                                                
                                            </div>
                                            <div className="col-1">
                                            <i class="fa-solid fa-grip-dots-vertical"></i>
                                            </div>
                                        </div>

                                        <div className="pt-4 d-flex justify-content-end">
                                            <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(category)}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </a>
                                            <button type="submit" class="btn btn-danger btn-sm  me-2" onClick={() => handleDeleteClick(category._id)}>
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
