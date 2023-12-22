import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';

export default function EditMenuItem() {
    const location = useLocation();
    const menuItemId = location.state.menuItemId;
    // const restaurantId = location.state?.restaurantId;
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState([]);
    const [sectionName, setSectionName] = useState('');
    const [restaurantId, setrestaurantId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        fetchItems();
        fetchMenuData();
      }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/items`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setItems(json);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // const fetchMenuData = async () => {
    //     try {
    //         const response = await fetch(`https://restro-wbno.vercel.app/api/menu/${menuItemId}`);
    //         const json = await response.json();

    //         setSelectedItem({ value: json.itemId, label: json.sectionName });
    //         setSectionName(json.sectionName);
    //     } catch (error) {
    //         console.error('Error fetching menu data:', error);
    //     }
    // };
    const fetchMenuData = async () => {
        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/getmenu/${menuItemId}`);
            const json = await response.json();

            setSectionName(json.menu.name);
            setSelectedItem(json.menu.items);
            setrestaurantId(json.menu.restaurantId);
        } catch (error) {
            console.error('Error fetching menu data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/menu/${menuItemId}`, {
                method: 'POST', // Use PUT for updating
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // itemId: selectedItem,
                    "name": sectionName,
                    "items":selectedItem
                })
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Restaurantpanel/Menu', { state: { restaurantId: restaurantId } });
            } else {
                console.error('Error updating Menu:', json.message);
            }
        } catch (error) {
            console.error('Error updating Menu:', error);
        }
    };

    const handleItemChange = (selectedOptions) => {
        setSelectedItem(selectedOptions);
    };

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
                        <Usernavbar />
                    </div>

                    <div className="col-10">
                        <div className="bg-white mt-5 px-3 py-5 box">
                            <div className='row'>
                                <p className='h5'>Edit Menu</p>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item">
                                            <a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="/Restaurantpanel/Menu" className='txtclr text-decoration-none'>Menu</a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">Edit Menu Item</li>
                                    </ol>
                                </nav>
                            </div>
                            <hr />

                            <form onSubmit={handleSubmit}>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="sectionName" className="form-label">Section Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="sectionName"
                                                value={sectionName}
                                                onChange={(e) => setSectionName(e.target.value)}
                                                placeholder='Section Name'
                                            />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="items" className="form-label">Select Item Type</label>
                                            <Select
                                                id="items"
                                                isMulti
                                                options={items.map(item => ({ value: item._id, label: item.name }))}
                                                onChange={handleItemChange}
                                                value={selectedItem}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <a href="/Restaurantpanel/Menu" className='btn btn-secondary'>Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
