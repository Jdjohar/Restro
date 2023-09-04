import React, { useState, useEffect } from 'react';
export default function Dashboard() {
    const [restaurantCount, setRestaurantCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [itemCount, setItemCount] = useState(0);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/dashboard`);
            const data = await response.json();
            setRestaurantCount(data.restaurantCount);
            setCategoryCount(data.categoryCount);
            setItemCount(data.itemCount);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <div>
            <div className='bgadmin'>
                <div className="container">
                    <div className="txt px-4 py-4">
                        <h2>Dashboard</h2>
                    </div>
                    <div className="row d-flex">
                        <div className="col-12 col-sm-6 col-md-6 col-lg-4 justify-content-evenly">
                            <div className="box1 fw-bold rounded adminborder p-3 m-2">
                                <p>Total Restaurants</p>
                                <p className='h4'>{restaurantCount}</p>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                            <div className="box1 fw-bold rounded adminborder p-3 m-2">
                                <p>Total Food Categories</p>
                                <p className='h4'>{categoryCount}</p>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-md-6 col-lg-4">
                            <div className="box1 fw-bold rounded adminborder p-3 m-2">
                                <p>Total Items</p>
                                <p className='h4'>{itemCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
