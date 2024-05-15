import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import Select from 'react-select';
import { useNavigate, useLocation } from 'react-router-dom';
import Nav from './Nav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner';
import noimage from '../noimage.png'

export default function AddItems() {
    const [ loading, setloading ] = useState(true);
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [spiceLevel, setSpiceLevel] = useState(' ');
    const [isAvailable, setIsAvailable] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [categoryId, setcategoryId] = useState("");
    const [restaurantId, setrestaurantId] = useState("");
    const [CategoryName, setCategoryName] = useState("");
    const [alertMessage, setAlertMessage] = useState('');
    const [image, setImage] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const subcategoryId = location.state?.subcategoryId;

    

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        if (subcategoryId) {
            fetchSubCategoryData();
        }
    }, [subcategoryId]);

    const fetchSubCategoryData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/getsinglesubcategory/${subcategoryId}`, {
                headers: {
                  'Authorization': authToken,
                }
              });
        
              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const json = await response.json();

                setSelectedSubcategory(json.name);
                setcategoryId(json.category);
                setrestaurantId(json.restaurantId);
                // setCategoryName(json.CategoryName);
                await fetchCategoryData(json.category);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching subcategory data:', error);
        }
    }
    
    const fetchCategoryData = async (categoryId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/getcategories/${categoryId}`, {
                headers: {
                  'Authorization': authToken,
                }
              });
        
              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const json = await response.json();

                setCategoryName(json.name);
              }
            
        } catch (error) {
            console.error('Error fetching category data:', error);
        }
    }

    // const handleSubcategoryChange = (selectedOption) => {
    //     setSelectedSubcategory(selectedOption);
    // };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Check if any required fields are empty
        if (!itemName || !description || !price || !spiceLevel) {
            setAlertMessage('Please fill in all required fields.');
            return;
        }

        const authToken = localStorage.getItem('authToken');
        const userid = localStorage.getItem('merchantid');

        let cloudinaryData;
            let defaultImageData;

            // Check if user uploaded an image
            if (image) {
                const formData = new FormData();
                formData.append('upload_preset', 'restrocloudnary');
                formData.append('cloud_name', 'dlq5b1jed');
                formData.append('file', image);

                // Upload image to Cloudinary
                const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                cloudinaryData = await cloudinaryResponse.json();
            } else {
                const formData = new FormData();
                formData.append('upload_preset', 'restrocloudnary');
                formData.append('cloud_name', 'dlq5b1jed');
                formData.append('file', noimage);

                // Upload default image to Cloudinary
                const defaultImageResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
                    method: 'POST',
                    body: formData,
                });
                defaultImageData = await defaultImageResponse.json();
            }


        const response = await fetch('https://restroproject.onrender.com/api/items', {
            method: 'POST',
            headers: {
                Authorization: authToken,
                'Content-Type': 'application/json',
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
                userid: userid,
                // imageUrl: cloudinaryData.secure_url, // Include image URL in the request
                imageUrl: image ? cloudinaryData.secure_url : defaultImageData.secure_url, // Use the correct URL based on whether image was uploaded or not
            }),
        });

        if (response.status === 401) {
            const json = await response.json();
            setAlertMessage(json.message);
            setloading(false);
            window.scrollTo(0, 0);
            return; // Stop further execution
        } else {
            const json = await response.json();

            if (json.success) {
                navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
            } else {
                console.error('Error adding item:', json.message);
            }
        }
    } catch (error) {
        console.error('Error adding item:', error);
        setAlertMessage('Failed to add item. Please try again later.');
    }
};


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    
    //     try {
    //       const authToken = localStorage.getItem('authToken');
    //       const userid = localStorage.getItem("merchantid");
    //       const formData = new FormData();
    //       formData.append('file', image);
    //       formData.append("upload_preset", "restrocloudnary")
    //       formData.append("cloud_name", "dlq5b1jed");
    
    //       // Upload image to Cloudinary
    //       const cloudinaryResponse = await fetch("https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload", {
    //         method: "post",
    //         body: formData
    //       });
    
    //       const cloudinaryData = await cloudinaryResponse.json();
    
    //       const response = await fetch("https://restroproject.onrender.com/api/items", {
    //         method: 'POST',
    //         headers: {
    //           'Authorization': authToken,
    //         },
    //         body: JSON.stringify({
    //           restaurantId: restaurantId,
    //           subcategoryId: subcategoryId,
    //           category: categoryId,
    //           CategoryName: CategoryName,
    //           Subcategory: selectedSubcategory,
    //           name: itemName,
    //           description: description,
    //           price: price,
    //           spiceLevel: spiceLevel,
    //           isAvailable: isAvailable,
    //           userid: userid,
    //           imageUrl: cloudinaryData.secure_url // Include image URL in the request
    //         })
    //       });
    
    //       if (response.status === 401) {
    //         const json = await response.json();
    //         setAlertMessage(json.message);
    //         setloading(false);
    //         window.scrollTo(0, 0);
    //         return; // Stop further execution
    //       } else {
    //         const json = await response.json();
    
    //         if (json.success) {
    //           navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
    //         } else {
    //           console.error('Error adding item:', json.message);
    //         }
    //       }
    
    //     } catch (error) {
    //       console.error('Error adding item:', error);
    //     }
    //   };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const authToken = localStorage.getItem('authToken');
    //         const userid =  localStorage.getItem("merchantid");
    //         const response = await fetch("https://restroproject.onrender.com/api/items", {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': authToken,
    //             },
    //             body: JSON.stringify({
    //                 restaurantId: restaurantId,
    //                 subcategoryId: subcategoryId,
    //                 category: categoryId,
    //                 CategoryName: CategoryName,
    //                 Subcategory: selectedSubcategory,
    //                 name: itemName,
    //                 description: description,
    //                 price: price,
    //                 spiceLevel: spiceLevel,
    //                 isAvailable: isAvailable,
    //                 userid: userid
    //             })
    //         });

    //         if (response.status === 401) {
    //           const json = await response.json();
    //           setAlertMessage(json.message);
    //           setloading(false);
    //           window.scrollTo(0,0);
    //           return; // Stop further execution
    //         }
    //         else{
    //             const json = await response.json();

    //             if (json.success) {
    //                 navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
    //             } else {
    //                 console.error('Error adding item:', json.message);
    //             }   
    //         }

            
    //     } catch (error) {
    //         console.error('Error adding item:', error);
    //     }
    // };

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
                        <div className='mx-5 mt-5'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
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
                                    </div>
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
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
                                            <label htmlFor="image" className="form-label">Upload Image</label>
                                            <input
                                            type="file"
                                            className="form-control"
                                            id="image"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            />
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
                                    {/* <button href="/Restaurantpanel/Items" className='btn btn-secondary b-radius text-white'>Cancel</button> */}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
    );
    
}