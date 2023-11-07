import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Retaiernavbar from './Retaiernavbar';
import Retailernav from './Retailernav';

export default function Editproduct() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const productId = location.state.productId;

    
  const [products, setProducts] = useState({
    name: '',
    description: '',
    size: '',
    colour: '',
    quantity: '',
  });

    useEffect(() => {
        fetchProductData();
    }, []);

    const fetchProductData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getproducts/${productId}`);
            const json = await response.json();
            
            if (json.Success) {
                setProducts(json.products);
            } else {
                console.error('Error fetching products:', json.message);
            }
            console.log(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const updatedProduct = {
                ...products
            };
            const response = await fetch(`http://localhost:3001/api/updateproduct/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Retailerpanel/Products');
                console.log(updatedProduct);
            } else {
                console.error('Error updating product:', json.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProducts({ ...products, [name]: value });
    };

    return (
        <div className='bg'>
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
                                </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
