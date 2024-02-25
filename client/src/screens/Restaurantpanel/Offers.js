import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import Nav from './Nav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function Offers() {
    
  const [ loading, setloading ] = useState(true);
  const [Items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [offerName, setofferName] = useState('');
  const [customtxt, setCustomtxt] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  
useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Restaurant') {
      navigate('/login');
    }
    // fetchItemsByRestaurant();
      fetchRestaurants();
  }, []);

  const fetchItemsByRestaurant = async (restaurantId) => {
    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`https://real-estate-1kn6.onrender.com/api/itemsbyrestaurant?restaurantId=${restaurantId}`, {
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

            if (json.success && Array.isArray(json.items)) {
                const availableItems = json.items.filter((item) => item.isAvailable === true);
                setItems(availableItems);
            } else {
                setItems([]);
            }
          }
        
    } catch (error) {
        console.error('Error fetching items by restaurant:', error);
    }
};
// const fetchCategories = async () => {
//     try {
//         const userid = localStorage.getItem('userid');
//         const response = await fetch(`https://real-estate-1kn6.onrender.com/api/itemsall?userid=${userid}`);
//         const json = await response.json();

//         if (Array.isArray(json.items)) {
//             setItems(json.items);
//         }
//         setloading(false);
//     } catch (error) {
//         console.error('Error fetching categories:', error);
//     }
// };


const fetchRestaurants = async () => {
    try {
        // Fetch restaurants data and set the state
        const userid = localStorage.getItem('merchantid');
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`https://real-estate-1kn6.onrender.com/api/fetchrestaurants?userid=${userid}`, {
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

            if (Array.isArray(json.restaurants)) {
                setRestaurants(json.restaurants);
            }
            setloading(false);
          }
        
    } catch (error) {
        console.error('Error fetching restaurants:', error);
    }
};

 // Additional function to handle restaurant selection
 const handleRestaurantSelect = (restaurantId) => {
    console.log(restaurantId);
    setSelectedRestaurant(restaurantId);
    fetchItemsByRestaurant(restaurantId); // Fetch items for the selected restaurant
};

const onChange=(event)=>{
    setSearchResults([...searchResults,event]);
    // setSelectedItems([...selectedItems, event.label]);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const userid =  localStorage.getItem("merchantid");
    const formData = {
        userid,
        offerName,
        customtxt,
        searchResults,
        selectedRestaurant,
        restaurantId: selectedRestaurant,
    };

    try {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch('https://real-estate-1kn6.onrender.com/api/Offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
            },
            body: JSON.stringify(formData),
        });

        if (response.status === 401) {
          const json = await response.json();
          setAlertMessage(json.message);
          setloading(false);
          window.scrollTo(0,0);
          return; // Stop further execution
        }
        else{
           if (response.ok) {
                navigate('/Restaurantpanel/Offeritems')
                // console.log('Form submitted successfully!');
            } else {
                // Handle error
                console.error('Form submission failed.');
            } 
        }

        
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

const handleSearchResultSelect = (selectedItem) => {
    const selectedValue = { label: selectedItem.label, value: selectedItem.value };
    setSearchResults([...searchResults, selectedValue]);
  };

  const handleRemoveItem = (itemValue) => {
    setSearchResults(searchResults.filter((item) => item.value !== itemValue));
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
                        <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div>
                    <div className='mx-5 mt-5'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>

                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row'>
                            <div className="">
                                <p className='h3 fw-bold'>Offers</p>
                            </div>
                        </div><hr />
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-lg-6 col-md-6">
                                    <div class="form-question" className='p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Offer Title</span>
                                        </div>
                                        <div className='flex-wrap'>
                                            <div class=' mx-2'>
                                                <input
                                                className="form-control offerbox wdth"
                                                    type='text'
                                                    id='titlebox'
                                                    value={offerName}
                                                    onChange={(e) => setofferName(e.target.value)}
                                                    required
                                                />
                                                </div>
                                        </div>
                                    </div>
                                    <div class="form-question" className='p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Custom Text</span>
                                        </div>
                                        <div className='flex-wrap txtarea'>
                                            <div class=' mx-2'>
                                                <textarea
                                                    className='form-control wdth offerbox'
                                                    type='text'
                                                    id='customtxt'
                                                    style={{height: "120px !important;"}}
                                                    value={customtxt}
                                                    onChange={(e) => setCustomtxt(e.target.value)}
                                                    cols={50}
                                                    rows={20}
                                                />
                                                </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-lg-6 col-md-6">
                                    <label htmlFor="restaurantSelect" className="form-label form-question__title">
                                        Select Restaurant
                                    </label>
                                    <select
                                        className="form-select offerbox wdth py-2 "
                                        id="restaurantSelect"
                                        onChange={(e) => handleRestaurantSelect(e.target.value)}
                                        value={selectedRestaurant}
                                    >
                                        <option value="" disabled>Select a restaurant</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant._id} value={restaurant._id}>
                                                {restaurant.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="search-container forms  my-lg-4 my-md-3 my-2 ">
                                        <p className='fs-20'>Search Items</p>
                                        <VirtualizedSelect
                                            id="searchitems" 
                                            name="items"
                                            className="form-control zindex op ps-0"
                                            placeholder=""
                                            onChange={(selectedItem) => handleSearchResultSelect(selectedItem)}
                                            options={Items.map((item) => ({ label: item.name, value: item._id }))}
                                            value={null} // Set default value to null to allow clearing selection

                                        >
                                        </VirtualizedSelect> 
                                        <div className='pt-3 backzindex mt-lg-3 mt-md-5 mt-4'>
                                            <p className='fs-20'>Item Name</p>
                                            <ul>
                                                {
                                                    searchResults.map((item) => (
                                                        <li className="badge btn btn-primary m-2 fs-6">{item.label} <i
                                                        className="fas fa-trash text-white ms-2 pointer"
                                                        onClick={() => handleRemoveItem(item.value)}
                                                    ></i></li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary mt-3 ms-3" type='submit' >
                                        Submit
                                    </button>

                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
}
    </div>
  )
}
