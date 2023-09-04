// RestaurantContext.js
import { createContext, useContext, useState } from 'react';

const RestaurantContext = createContext();


export const RestaurantProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);

    const addRestaurant = (restaurant) => {
        setRestaurants([...restaurants, restaurant]);
    };

    return (
        <RestaurantContext.Provider value={{ restaurants, addRestaurant }}>
            {children}
        </RestaurantContext.Provider>
    );
};
export const useRestaurantContext = () => useContext(RestaurantContext);
