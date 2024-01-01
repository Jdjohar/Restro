import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Category from './Category';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner'

export default function Menu() {
    const [ loading, setloading ] = useState(true);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
//     const apiUrl = 'https://accounts.google.com/o/oauth2/auth?response_type=code&access_type=offline&client_id=836780155754-2bb00gmkocp0tq0ss20h76evjiaqdmh9.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/admin.directory.userschema&redirect_uri=http://localhost:3000'; // Replace with your API endpoint
// const username = '836780155754-2bb00gmkocp0tq0ss20h76evjiaqdmh9.apps.googleusercontent.com';
// const password = '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';

// // Encode the username and password in Base64
// const base64Credentials = btoa(`${username}:${password}`);

// // Create the request headers
// const headers = new Headers({
//   'Authorization': `Basic ${base64Credentials}`,
//   'Content-Type': 'application/json', // Set the content type as needed
// });

// // Create the fetch request
// fetch(apiUrl, {
//   method: 'GET', // Change to the HTTP method you need (GET, POST, PUT, etc.)
//   headers: headers,
// })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then((data) => {
//     // Process the API response data
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error('Error fetching data:', error);
//   });

    const tokenEndpoint = 'https://oauth2.googleapis.com/token'; // Replace with the actual token endpoint URL
    // const clientId = '538055540936-csm74kpksihgemo2gmcl8hnr62dnsvfg.apps.googleusercontent.com';
    const clientId = '836780155754-2bb00gmkocp0tq0ss20h76evjiaqdmh9.apps.googleusercontent.com'; //localhost id
    // const clientSecret = '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';
    
    const clientSecret = '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'; //localhost id

    const tokenRequest = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    };
    fetch(tokenEndpoint, tokenRequest)
  .then((response) => response.json())
  .then((data) => {
    const accessToken = data.access_token;
    // Store or use the access token as needed
  })
  .catch((error) => {
    console.error('Error fetching access token:', error);
  });

  

    const restaurantId = location.state?.restaurantId;

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
        if (restaurantId) {
            fetchCategories();
        }
    }, [restaurantId]);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getrestaurantcategories/${restaurantId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                setCategories(json);
            }
            setloading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const handleAddCategoryClick = () => {
        navigate('/Restaurantpanel/AddCategory', { state: { restaurantId: restaurantId } });
    }

    const handleEditCategoryClick = (category) => {
        navigate('/Restaurantpanel/EditCategory', { state: { categoryId: category._id } });
    }

    const handleSubcategoryViewClick = (category) => {
        let categoryId = category._id;
        navigate('/Restaurantpanel/Subcategory', { state: { categoryId } });
    };

    const handleViewItemsClick = () => {
        navigate('/Restaurantpanel/Items', { state: { restaurantId } });
    };

    const handleDeleteCategoryClick = async (categoryId) => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            const json = await response.json();

            if (json.success) {
                fetchCategories(); // Refresh the categories list
            } else {
                console.error('Error deleting category:', json.message);
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    // Rest of your component code

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
                        <div className="bg-white my-5 p-4 box mx-4">
                            <div className='row'>
                                <div className="col-lg-4 col-md-6 col-sm-6 col-3 me-auto">
                                    <p className='h5 fw-bold'>Menu</p>
                                    {/* Rest of your navigation and layout */}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-8 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddCategoryClick}>+ Add Category</button>
                                </div>
                            </div><hr />

                            <div className="row px-2 table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID </th>
                                            <th scope="col">Category</th>
                                            <th scope="col" className='text-center pointer'>Sub-Categories</th>
                                            <th scope="col" className='text-center'>Items</th>
                                            <th scope="col">Edit/Delete</th>
                                            <th scope="col">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((category, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{category.name}</td>
                                                {/* Render sub-categories here */}
                                                {/* <td>
                                                    {category.subCategories.map((subCategory, subIndex) => (
                                                        <div key={subIndex}>{subCategory.name}</div>
                                                    ))}
                                                </td> */}
                                                {/* Rest of your table row */}
                                                <td className='text-center'>
                                                     <a className='text-black text-center pointer' onClick={ () => handleSubcategoryViewClick(category)}>
                                                         <i class="fa-solid fa-eye"></i>
                                                     </a>
                                                 </td>
                                                <td className='text-center'>
                                                     <a className='text-black text-center pointer' onClick={ () => handleViewItemsClick()}>
                                                         <i class="fa-solid fa-eye"></i>
                                                     </a>
                                                 </td>
                                                 <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={() => handleEditCategoryClick(category)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteCategoryClick(category._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                                 <td>{category.createdAt}</td>
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

