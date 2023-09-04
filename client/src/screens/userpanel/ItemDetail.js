import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useLocation } from 'react-router-dom';

export default function ItemDetail() {
    const location = useLocation();
    const subcategoryId = location.state?.subcategoryId;
    const restaurantId = location.state?.restaurantId;
    const [items, setItems] = useState([]);
    const [Categories, setCategories] = useState([]);

    useEffect(() => {
        if (subcategoryId != null) {
            fetchSubcategoryItems();
        } else {
            fetchRestaurantItems();
        }
    }, [subcategoryId]);

    const fetchSubcategoryItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getitems/${subcategoryId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                
                setCategories(Array.from(new Set(json.map(item => item.CategoryName))));

                const uniqueSubcategories = Array.from(new Set(json.map(item => item.Subcategory)));
                setItems(uniqueSubcategories.map(subcategory => ({
                    subcategory,
                    items: json.filter(item => item.Subcategory == subcategory && item.isAvailable.toString() == "true")
                })));
            }
        } catch (error) {
            console.error('Error fetching subcategory items:', error);
        }
    };

    const fetchRestaurantItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurantitems/${restaurantId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                
                setCategories(Array.from(new Set(json.map(item => item.CategoryName))));
                
                const uniqueSubcategories = Array.from(new Set(json.map(item => item.Subcategory)));
                setItems(uniqueSubcategories.map(subcategory => ({
                    subcategory,
                    items: json.filter(item => item.Subcategory == subcategory && item.isAvailable.toString() == "true")
                })));
            }
            console.log(Categories);
            console.log(items);
        } catch (error) {
            console.error('Error fetching restaurant items:', error);
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
                        <div className="bg-white mt-5 p-3 box mb-5">
                            <div className='row'>
                                <div className="col-4 me-auto">
                                    <p className='h5'>Items Detail</p>
                                </div>
                            </div>
                            <hr />
                                {Categories.map((categoryItem, indexd) => {
                            return <div className="row" key={indexd}>
                                    
                                <div className="col-12 text-center me-auto">
                                <h1 >{categoryItem}</h1>
                                </div>
                                {items.map((subcategoryItem, index) => {
                                    return subcategoryItem.items.filter(item => item.CategoryName == categoryItem).length > 0 ? <div className="col-md-4" key={index}>
                                        <div className="row px-2">
                                            <div>
                                                <h3 className='text-center'>{subcategoryItem.subcategory}</h3>
                                            </div>
                                            {subcategoryItem.items.map((item, itemIndex) => {
                                            return categoryItem == item.CategoryName? <div className="row px-2" key={itemIndex}>
                                                    <div>
                                                        <p><span className='fs-6 fw-bold'>Item Name:</span>{item.name}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className='fs-6 fw-bold'>Description :</span>{item.description}</p>
                                                    </div>
                                                    <div>
                                                        <p><span className='fs-6 fw-bold'>Price :</span>{item.price} Rs/-</p>
                                                    </div>
                                                    <div>
                                                        <p><span className='fs-6 fw-bold'>SpiceLevel :</span>{item.spiceLevel}</p>
                                                    </div>
                                                    <div className='pb-3'>
                                                        <p><span className='fs-6 fw-bold'>IsAvailable :</span>{item.isAvailable.toString()}</p>                                            
                                                    </div>
                                                </div> : ""
})}
                                        </div>
                                    </div>:""
})}
                            </div>
})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

