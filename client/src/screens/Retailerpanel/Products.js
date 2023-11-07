import React, { useState, useEffect } from 'react';
import Retaiernavbar from './Retaiernavbar';
import { useNavigate } from 'react-router-dom';
import Retailernav from './Retailernav';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedproducts, setselectedproducts] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchdata(); // Fetch data when the component mounts
    }, []);

    const handleAddClick = () => {
        navigate('/Retailerpanel/Addproduct');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://localhost:3001/api/products/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setProducts(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // const handleMenuViewClick = (product) => {
    //     let productId = product._id;
    //     navigate('/Restaurantpanel/Menu', { state: { productId } });
    // };
    const handleEditClick = (product) => {
        setselectedproducts(product);
        let productId = product._id;
        navigate('/Retailerpanel/Editproduct', { state: { productId } });
    };

    const handleDeleteClick = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/delproduct/${productId}`, {
                method: 'DELETE'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata(); // Refresh the products list
            } else {
                console.error('Error deleting product:', json.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Retaiernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Retailernav/>
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Products</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Products</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">Product Name </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {products.map((product, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{product.name}</td>
                                                {/* <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(product)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td> */}
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(product)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(product._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                                <td>{product.createdAt}</td>
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
