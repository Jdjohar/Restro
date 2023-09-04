// import React, { useState,useEffect } from 'react';
// import Usernavbar from './userpanel/Usernavbar';
// import { useNavigate, useLocation } from 'react-router-dom';

// export default function Additems() {
//     const [ItemName, setItemName] = useState('');
//     const [SubCategoryName, setSubCategoryName] = useState('');
//     const [categoryName, setCategoryName] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();

//     const subcategoryId = location.state?.subcategoryId;
//     useEffect(() => {
//         if (subcategoryId) {
//             fetchCategoryData();
//         }
//     }, [subcategoryId]);

//     const fetchCategoryData = async () => {
//         try {
//             const response = await fetch(`http://localhost:3001/api/getsinglesubcategory/${subcategoryId}`);
//             const json = await response.json();

//             setSubCategoryName(json.name);
//             // setcategoryId(json.restaurantId);
//         } catch (error) {
//             console.error('Error fetching category data:', error);
//         }
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             const response = await fetch(`http://localhost:3001/api/Items`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     subcategoryId: subcategoryId,
//                     name: SubCategoryName
//                     // name: categoryName
//                 })
//             });

//             const json = await response.json();

//             if (json.success) {
//                 navigate('/Userpanel/Items', { state: { subcategoryId: subcategoryId } });
//             } else {
//                 console.error('Error adding Items:', json.message);
//             }
//         } catch (error) {
//             console.error('Error adding Items:', error);
//         }
//     };

//     return (
//         <div className='bg'>
//             <div className='container-fluid'>
//                 <div className="row">
//                     <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
//                         <Usernavbar />
//                     </div>

//                     <div className="col-10">
//                         <div className="bg-white mt-5 px-3 py-5 box">
//                             <div className='row'>
//                                 <p className='h5'>Add Items</p>
//                                 {/* Rest of your navigation and layout */}
//                             </div>
//                             <hr />

//                             <form onSubmit={handleSubmit}>
//                                 <div className="row mt-3">
//                                     {/* <div className="col-4">
//                                         <div className="mb-3">
//                                             <label htmlFor="categoryName" className="form-label">Category Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 id="categoryName"
//                                                 value={categoryName}
//                                                 onChange={(e) => setCategoryName(e.target.value)}
//                                                 placeholder='Category Name'
//                                                 readOnly
//                                             />
//                                         </div>
//                                     </div> */}

//                                     <div className="col-4">
//                                         <div className="mb-3">
//                                             <label htmlFor="SubCategoryName" className="form-label">SubCategory Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 id="SubCategoryName"
//                                                 value={SubCategoryName}
//                                                 onChange={(e) => setSubCategoryName(e.target.value)}
//                                                 placeholder='SubCategory Name'
//                                                 readOnly
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="col-4">
//                                         <div className="mb-3">
//                                             <label htmlFor="ItemName" className="form-label">Item Name</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 id="ItemName"
//                                                 value={ItemName}
//                                                 onChange={(e) => setItemName(e.target.value)}
//                                                 placeholder='Item Name'
//                                                 required
//                                             />
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="d-flex mt-3">
//                                     <button type="submit" className='btn btnclr text-white me-2'>Save</button>
//                                     <a href="/Userpanel/Menu" className='btn btn-secondary'>Cancel</a>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useState, useEffect } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddItems() {
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [spiceLevel, setSpiceLevel] = useState('Mild');
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
                    isAvailable: isAvailable
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
                    <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
                        <Usernavbar />
                    </div>
    
                    <div className="col-10">
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white mt-5 px-3 py-5 box">
                                <div className='row'>
                                    <p className='h5'>Add Item</p>
                                </div>
                                <hr />
    
                                <div className="row">
                                    <div className="col-4">
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
                                    <div className="col-4">
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
                                </div>
    
                                <div className="row">
                                    <div className="col-4">
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
                                    <div className="col-4">
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
                                    </div>
                                </div>
    
                                <div className="row">
                                    <div className="col-4">
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
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="spiceLevel" className="form-label">Spice Level</label>
                                            <select
                                                className="form-select"
                                                id="spiceLevel"
                                                value={spiceLevel}
                                                onChange={(e) => setSpiceLevel(e.target.value)}
                                                required
                                            >
                                                <option value="Mild">Mild</option>
                                                <option value="Medium">Medium</option>
                                                <option value="Hot">Hot</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-4">
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
                                    <a href="/Userpanel/Items" className='btn btn-secondary'>Cancel</a>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
    
}
