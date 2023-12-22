import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';

export default function ViewMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        fetchMenuData();
      }, []);

    const fetchMenuData = async () => {
        try {
            const response = await fetch("https://restro-wbno.vercel.app/api/menu");
            const json = await response.json();

            if (Array.isArray(json)) {
                setMenuItems(json);
            }
        } catch (error) {
            console.error('Error fetching menu data:', error);
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
                        <div className="bg-white my-5 p-4 box mx-4">
                            <div className='row'>
                                <div className="col-4 me-auto">
                                    <p className='h5'>View Menu</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">View Menu</li>
                                        </ol>
                                    </nav>
                                </div>
                            </div><hr />

                            <div className="row px-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Item Name</th>
                                        </tr>
                                    </thead>
                                    {menuItems.map((menuItem) => (
                                    <tbody>
                                        
                                                    {menuItem.items.map((item, innerIndex) => (
                                                        <tr key={innerIndex}>
                                                            <th scope="col">{innerIndex + 1}</th>
                                                            <td scope="col">{item.label ? item.label : ""}</td>
                                                        </tr>
                                                    ))}
                                    </tbody>
                                        ))}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
