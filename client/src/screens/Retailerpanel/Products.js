import React, { useState, useEffect } from 'react';
import Retaiernavbar from './Retaiernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Retailernav from './Retailernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner';

export default function Products() {
    const [ loading, setloading ] = useState(true);
    const [products, setProducts] = useState([]);
    
    const location = useLocation();
    const storeId = location.state?.storeId;
    const productId = location.state?.productId;
    const [selectedproducts, setselectedproducts] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Retailer') {
          navigate('/login');
        }
        fetchdata();
      }, []);

    const handleAddClick = () => {
        navigate('/Retailerpanel/Addproduct', { state: { storeId } });
    }

    const fetchdata = async () => {
        try {
            // const storeId =  localStorage.getItem("storeId");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/products/${storeId}`, {
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
                if (Array.isArray(json)) {
                    setProducts(json);
                }
                setloading(false);
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
        // let storeId = product.storeId;
        navigate('/Retailerpanel/Editproduct', { state: { productId, storeId } });
    };

    const handleDeleteClick = async (productId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/delproduct/${productId}`, {
                method: 'GET',
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
                    fetchdata(); // Refresh the products list
                } else {
                    console.error('Error deleting product:', json.message);
                }
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // // const handleViewDetailClick = () => {
    // //     navigate('/Retailerpanel/Storedetail', { state: { productId, storeId } });
    // // };

    // const handleViewDetailClick = (product) => {
    //     // let productId = product._id;
    //     navigate('/Retailerpanel/Storedetail', { state: { storeId } });
    // };

    const handleViewDetailClick = () => {
        const authtoken = localStorage.getItem("authToken");// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1MWFmNDRlY2ZiMTBlN2RiOWY5YWNkIn0sImlhdCI6MTcwODY4MzExN30.eTF2HpE8RCapdE5Xl2RSmkgmuI_Guo6qpvJX1XhnsgU";
        // localStorage.setItem('authtoken1', authtoken);
        const url = `https://restro-design.vercel.app/?authtoken=${authtoken}&storeeid=${storeId}`;
        window.location.href = url;
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
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
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
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Products </p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Retailerpanel/Retailerdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Products</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>

                            {/* {  products.name != null ?  */}
                            <div className="col-lg-2 col-md-6 col-sm-6 col-8 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleViewDetailClick}>Online Menu</button>
                                    {/* <button className='btn rounded-pill btnclr text-white fw-bold' onClick={ () => handleViewDetailClick(products)}>Online Menu</button> */}
                                </div>
                                {/* // :"" } */}
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
}
    </div>
  )
}
