import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function AddMenuItem() {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sectionName, setSectionName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const restaurantId = location.state.restaurantId;
    console.log(restaurantId+"fdsfsd");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch("https://restroproject.onrender.com/api/items");
            const json = await response.json();

            if (Array.isArray(json)) {
                setItems(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://restroproject.onrender.com/api/menu", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    itemId: selectedItem.value,
                    sectionName: sectionName
                })
            });

            const json = await response.json();

            if (json.Success) {
                navigate('/Userpanel/Menu', {state: { restaurantId: restaurantId } });
            } else {
                console.error('Error creating Menu:', json.message);
            }
        } catch (error) {
            console.error('Error creating Menu:', error);
        }
    };

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-2 bg-white vh-100 b-shadow'>
                        <div  >
                        <Usernavbar/>
                        </div>
                    </div>

                    <div className="col-10 mx-auto">
                        <div className="bg-white my-5 p-4 box mx-4">
                            <div className='row'>
                                <p className='h5 fw-bold'>Add Menu</p>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb mb-0">
                                        <li className="breadcrumb-item">
                                            <a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                        </li>
                                        <li className="breadcrumb-item">
                                            <a href="/Userpanel/Menu" className='txtclr text-decoration-none'>Menu</a>
                                        </li>
                                        <li className="breadcrumb-item active" aria-current="page">Add Menu Item</li>
                                    </ol>
                                </nav>
                            </div>
                            <hr />

                            <form  onSubmit={handleSubmit}>
                                <div className="row mt-3">

                                <div className="col-4">
                                    <div className="mb-3">
                                        <label htmlFor="sectionName" className="form-label">Section Name</label>
                                        <input
                                            type="text"
                                            id="sectionName"
                                            className="form-control"
                                            value={sectionName}
                                            onChange={(e) => setSectionName(e.target.value)}
                                            placeholder='Section Name'
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-4">
                                    <div className="mb-3">
                                        <label htmlFor="items" className="form-label">Select Item</label>
                                        <Select
                                            id="items"
                                            isMulti
                                            options={items.map(item => ({ value: item._id, label: item.name }))}
                                            onChange={setSelectedItem} // Use setSelectedItem directly
                                            value={selectedItem}
                                        />
                                    </div>
                                </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <a href="/Userpanel/Menu" className='btn btn-secondary'>Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
