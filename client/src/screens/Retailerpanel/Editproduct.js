import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Retaiernavbar from './Retaiernavbar';
import Retailernav from './Retailernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner';

export default function Editproduct() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const productId = location.state?.productId;
    const storeId = location.state?.storeId;
    const [ loading, setloading ] = useState(true);
    const [isAvailable, setIsAvailable] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    
  const [products, setProducts] = useState({
    name: '',
    description: '',
    price: '',
    size: '',
    colour: '',
    quantity: '',
    isAvailable: false 
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Retailer') {
      navigate('/login');
    }
        fetchProductData();
  }, []);

    const fetchProductData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/getproducts/${productId}`, {
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
            
                if (json.Success) {
                    setProducts(json.product);
                    setImageUrl(json.product.imageUrl);
                } else {
                    console.error('Error fetching products:', json.message);
                }
                console.log(products);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      setImage(file);
    };

    const handleSaveClick = async () => {
        try {
            const updatedProduct = {
                ...products,
              imageUrl: image ? await uploadImageToCloudinary(image) : imageUrl,
            };
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/updateproduct/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedProduct)
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

                if (json.Success) {
                    setProducts(updatedProduct);
                    navigate('/Retailerpanel/Products', { state: { storeId } });
                    console.log(updatedProduct);
                } else {
                    console.error('Error updating product:', json.message);
                }
            }

            
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const uploadImageToCloudinary = async (imageFile) => {
      try {
        const formData = new FormData();
        formData.append('upload_preset', 'restrocloudnary');
        formData.append('cloud_name', 'dlq5b1jed');
        formData.append('file', imageFile);
    
        const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
          method: 'POST',
          body: formData,
        });
    
        const cloudinaryData = await cloudinaryResponse.json();
        return cloudinaryData.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return null;
      }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        // If the input is a checkbox, handle it differently
        const inputValue = type === 'checkbox' ? checked : value;
    
        setProducts({ ...products, [name]: inputValue });
    };

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
                    <div className='col-lg-2 col-md-3 vh-lg-100 vh-md-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                            <Retaiernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Retailernav/>
                        </div>
                        <div className='mx-5 mt-5'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Product</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Retailerpanel/Retailerdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/Retailerpanel/Products" className='txtclr text-decoration-none'>Products</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Product</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="ProductName" className="form-label">Product Name</label>
                                            <input type="text" className="form-control" name="name" value={products.name} onChange={handleInputChange} placeholder='Product Name' id="ProductName"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="description" className="form-label">Description</label>
                                            <textarea type="text" className="form-control" name="description" value={products.description} onChange={handleInputChange} placeholder='Description' id="description"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="price" className="form-label">Price</label>
                                            <input type="number" className="form-control" name="price" value={products.price} onChange={handleInputChange} placeholder='Price' id="price"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="size" className="form-label">Size</label>
                                            <input type="text" className="form-control" name="size" value={products.size} onChange={handleInputChange} placeholder='Size' id="size"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="colour" className="form-label">Colour</label>
                                            <input type="text" name='colour' value={products.colour} onChange={handleInputChange} className="form-control" placeholder='Colour' id="colour"/>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <label htmlFor="quantity" className="form-label">Quantity</label>
                                            <input type="text" name='quantity' value={products.quantity} onChange={handleInputChange} className="form-control" placeholder='Quantity' id="quantity"/>
                                        </div>
                                    </div>
                                    {/* <div className='col-12 col-sm-6 col-lg-4'>
                                        <div className='mb-3'>
                                            <label htmlFor='image' className='form-label'>
                                            Upload Image
                                            </label>
                                            <input
                                            type='file'
                                            className='form-control'
                                            id='image'
                                            onChange={handleImageUpload}
                                            accept='image/*'
                                            />
                                        </div>
                                    </div> */}
                                    <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">Current Image</label>
                        {imageUrl ? (
                                            <div>
                                            <img src={imageUrl} alt="Current Item Image" className='item-image flex-shrink-0 img-fluid rounded' />
                                            <div className="mt-2">
                                                <label htmlFor="newImage" className="form-label">Upload New Image</label>
                                                <input
                                                type="file"
                                                className="form-control"
                                                id="newImage"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                />
                                            </div>
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                            <label htmlFor="newImage" className="form-label">Upload New Image</label>
                                            <input
                                            type="file"
                                            className="form-control"
                                            id="newImage"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            />
                                        </div>
                                        )}
    </div>
</div>


                                    <div className="col-12 col-sm-6 col-lg-4">
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="isAvailable"
                                                    checked={products.isAvailable}
                                                    onChange={(e) =>
                                                        setProducts({ ...products, isAvailable: e.target.checked })
                                                    }
                                                />
                                                <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
    );
}
