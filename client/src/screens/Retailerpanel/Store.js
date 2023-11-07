import React, { useState, useEffect } from 'react';
import Retaiernavbar from './Retaiernavbar';
import { useNavigate } from 'react-router-dom';
import Retailernav from './Retailernav';

export default function Store() {
    const [store, setStore] = useState([]);
    const [selectedstores, setselectedstores] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchdata();
    }, []);

    const handleAddClick = () => {
        navigate('/Retailerpanel/Addstore');
    }

    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const response = await fetch(`http://localhost:3001/api/store/${userid}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setStore(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleMenuViewClick = (store) => {
        let storeId = store._id;
        navigate('/Restaurantpanel/Menu', { state: { storeId } });
    };
    const handleEditClick = (store) => {
        setselectedstores(store);
        let storeId = store._id;
        navigate('/Retailerpanel/Editstore', { state: { storeId } });
    };

    const handleDeleteClick = async (storeId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/delstore/${storeId}`, {
                method: 'DELETE'
            });
    
            const json = await response.json();
    
            if (json.Success) {
                fetchdata();
            } else {
                console.error('Error deleting store:', json.message);
            }
        } catch (error) {
            console.error('Error deleting store:', error);
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
                                <p className='h5 fw-bold'>Store</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Retailerpanel/Retailerdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Stores</li>
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
                                        <th scope="col">Store Name </th>
                                        <th scope="col">Nickname </th>
                                        <th scope="col">Store Type </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        <th scope="col">Menu </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {store.map((store, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{store.name}</td>
                                                <td>{store.nickname}</td>
                                                <td>{store.type}</td>
                                                <td>{store.email}</td>
                                                <td>{store.number}</td> 
                                                <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleMenuViewClick(store)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(store)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(store._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                                <td>{store.createdAt}</td>
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
