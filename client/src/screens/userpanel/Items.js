import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';

export default function Items() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    // const [restaurantId, setRestaurantId] = useState('');
    const subcategoryId = location.state?.subcategoryId;
    const categoryId = location.state?.categoryId;
    const restaurantId = location.state?.restaurantId;

    useEffect(() => {
        if (subcategoryId != null) {
            fetchSubcategoryItems();
        } else {
            fetchRestaurantItems();
        }
    }, [subcategoryId]);

    const fetchSubcategoryItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getitems/${subcategoryId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setItems(json);
            }
        } catch (error) {
            console.error('Error fetching subcategory items:', error);
        }
    };

    const fetchRestaurantItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurantitems/${restaurantId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setItems(json);
            }
        } catch (error) {
            console.error('Error fetching restaurant items:', error);
        }
    };

    const handleAddClick = () => {
        
        if (subcategoryId != null) {
            navigate('/Userpanel/Additems', { state: { subcategoryId } });
        } else {
            navigate('/Userpanel/Menu', { state: { restaurantId } });
        }
    };

    const handleEditItemClick = (Subcategory) => {
        navigate('/Userpanel/EditItem', { state: { itemId: Subcategory._id } });
    }

    const handleDeleteClick = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/delitems/${itemId}`, {
                method: 'DELETE'
            });

            const json = await response.json();

            if (json.message === "Items deleted successfully") {
                // Update the items list after successful deletion
                if (subcategoryId !== null) {
                    fetchSubcategoryItems();
                } else {
                    fetchRestaurantItems();
                }
            } else {
                console.error('Error deleting item:', json.message);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleViewItemsClick = () => {
        navigate('/Userpanel/ItemDetail', { state: { restaurantId } });
    };



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
                                <div className="col-lg-4 col-md-6 col-sm-6 col-3 me-auto">
                                    <p className='h5 fw-bold'>Items</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                            <li className="breadcrumb-item active" aria-current="page">Items</li>
                                        </ol>
                                    </nav>
                                </div>
                                {  subcategoryId != null ? <div className="col-lg-3 col-md-6 col-sm-6 col-8 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                                </div>:"" }
                                {  subcategoryId != null ? "":<div className="col-lg-3 col-md-6 col-sm-6 col-8 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleViewItemsClick}>View details</button>
                                </div> }
                            </div>
                            <hr />

                            <div className="row px-2 table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID </th>
                                            <th scope="col" className='text-center'>Item Name</th>
                                            <th scope="col" className='text-center'>Category Name</th>
                                            <th scope="col" className='text-center'>Sub-Category Name</th>
                                            <th scope="col">Action</th>
                                            <th scope="col">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td className='text-center'>{item.name}</td>
                                                <td className='text-center'>{item.CategoryName}</td>
                                                <td className='text-center'>{item.Subcategory}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditItemClick(item)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(item._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td>{item.createdAt}</td>
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
