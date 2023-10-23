import React, { useState, useEffect } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './userpanel/Nav';

export default function AddItems() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [spiceLevel, setSpiceLevel] = useState(' ');
    const [isAvailable, setIsAvailable] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [categoryId, setcategoryId] = useState("");
    const [restaurantId, setrestaurantId] = useState("");
    const [CategoryName, setCategoryName] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const subcategoryId = location.state?.subcategoryId;

    useEffect(() => {
        if (subcategoryId) {
            fetchSubCategoryData();
        }
    }, [subcategoryId]);

    const fetchSubCategoryData = async () => {
        try {
            console.log(subcategoryId);
            const response = await fetch(`http://localhost:3001/api/getsinglesubcategory/${subcategoryId}`);
            const json = await response.json();

            setSelectedSubcategory(json.name);
            setcategoryId(json.category);
            setrestaurantId(json.restaurantId);
            // setCategoryName(json.CategoryName);
            await fetchCategoryData(json.category);
        } catch (error) {
            console.error('Error fetching subcategory data:', error);
        }
    }
    
    const fetchCategoryData = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/getcategories/${categoryId}`);
            const json = await response.json();

            setCategoryName(json.name);
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    // const handleSubcategoryChange = (selectedOption) => {
    //     setSelectedSubcategory(selectedOption);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch("http://localhost:3001/api/items", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    subcategoryId: subcategoryId,
                    category: categoryId,
                    CategoryName: CategoryName,
                    Subcategory: selectedSubcategory,
                    name: itemName,
                    description: description,
                    price: price,
                    spiceLevel: spiceLevel,
                    isAvailable: isAvailable,
                    userid: userid
                })
            });

            const json = await response.json();

            if (json.success) {
                navigate('/Userpanel/Items', { state: { subcategoryId } });
            } else {
                console.error('Error adding item:', json.message);
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
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
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Add Item</p>
                                </div>
                                <hr />
    
                                <div className="row">
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="categoryName"
                                                value={CategoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder='Category Name'
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="subcategoryName" className="form-label">SubCategory Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="subcategoryName"
                                                value={selectedSubcategory}
                                                onChange={(e) => setSelectedSubcategory(e.target.value)}
                                                placeholder='SubCategory Name'
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="itemName" className="form-label">Item Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="itemName"
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                placeholder='Item Name'
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                placeholder='Description'
                                                required
                                            />
                                        </div>
                                    </div><div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                placeholder='Price'
                                                
                                            />
                                        </div>
                                    </div>
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="spiceLevel" className="form-label">Spice Level</label>
                                            <select
                                                className="form-select"
                                                id="spiceLevel"
                                                value={spiceLevel}
                                                onChange={(e) => setSpiceLevel(e.target.value)}
                                            >
                                                <option value=" ">Please Select Spice Level</option>
                                                <option value="Mild">Mild</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hot">Hot</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="isAvailable"
                                                    checked={isAvailable}
                                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <button href="/Userpanel/Items" className='btn btn-secondary b-radius text-white'>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    
}