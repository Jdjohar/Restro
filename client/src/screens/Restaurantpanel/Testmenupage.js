import React,{useState,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
// import Teststyle from './Teststyle'

export default function Testmenupage() {
    const location = useLocation();
    const subcategoryId = location.state?.subcategoryId;
    // let url = new URL(window.location.href);
    // const queryParams = new URLSearchParams(location.search);
    // const restaurantId = queryParams.get('rest');//"655700ca266f274b39f57236";//location.state?.restaurantId;
    const [items, setItems] = useState([]);
    const [Categories, setCategories] = useState([]);
    const pathname = location.pathname;
    const parts = pathname.split('/'); // Split the pathname into parts
    const pageName = parts[parts.length - 1]; // Get the last part of the pathname
    const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1); 
    const restaurantId = pageTitle;
    console.log(restaurantId,"dsfsdf");
    useEffect(() => {

        // const authToken = localStorage.getItem('authToken');
        // const signUpType = localStorage.getItem('signuptype');
      
        // if (!authToken || signUpType !== 'Restaurant') {
        //   navigate('/login');
        // }

  const fetchData = async () => {
    if (subcategoryId != null) {
      fetchSubcategoryItems();
    } else if (restaurantId != null) {
      await fetchRestaurantItems();
    
    }
    // setloading(false);
  };

  fetchData();
}, [subcategoryId, restaurantId]);


    const fetchSubcategoryItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getitemsformenu/${subcategoryId}`);
            const json = await response.json();
    
            if (Array.isArray(json)) {
                    
                setCategories(Array.from(new Set(json.map(item => item.CategoryName))));
    
                const uniqueSubcategories = Array.from(new Set(json.map(item => item.Subcategory)));
                setItems(uniqueSubcategories.map(subcategory => ({
                    subcategory,
                    items: json.filter(item => item.Subcategory == subcategory && item.isAvailable.toString() == "true")
                })));
            }
            // setloading(false);
        } catch (error) {
            console.error('Error fetching subcategory items:', error);
            // setloading(false);
        }
    };
    
    const fetchRestaurantItems = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getrestaurantitemsformenu/${restaurantId}`);
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
    <div className='bgwhite'>
      <div className="container-fluid p-0">
        <div className="py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">Food Menu</h5>
              <h1 className="mb-5">Most Popular Items</h1>
              {/* <p className="mb-5">{pageTitle}</p> */}
            </div>
            {/* <div className='row g-4'>
                <div className="col-lg-6">
                    <div className="d-flex align-items-center">
                        <img src="img/menu-1.jpg" className="flex-shrink-0 img-fluid rounded" alt="..." />
                        <div className="w-100 d-flex flex-column text-start ps-4">
                            <h5 className="d-flex justify-content-between border-bottom pb-2">
                                <span>Chicken Burger</span>
                                <span className="text-primary text-right">$115</span>
                            </h5>
                            
                          <small className='fst-italic'>Ipsum ipsum clita erat amet dolor justo diam</small>
                        </div>
                    </div>
                </div>
            </div> */}
            {Categories.map((categoryItem, indexd) => {
                return <div className="row" key={indexd}>
                    <div className="col-12 text-center me-auto">
                        <h1 className='text-uppercase'>{categoryItem}</h1>
                    </div>
                    {items.map((subcategoryItem, index) => {
                                        return subcategoryItem.items.filter(item => item.CategoryName == categoryItem).length > 0 ? 
                                        <div className="col-12" key={index}>
                                            <div className="row px-2">
                                                <div>
                                                    <h3 className='text-center text-uppercase'>{subcategoryItem.subcategory}</h3>
                                                </div>
                                                {subcategoryItem.items.map((item, itemIndex, ) => {
                                                return categoryItem == item.CategoryName? 
                                                    <div className="col-12 col-md-6 col-lg-6 px-2" key={itemIndex}>
                                                    <div className='d-flex align-items-center py-2'>
                                                    <img src={item.imageUrl} className="item-image flex-shrink-0 img-fluid rounded" alt="item" />
                                                      <div className="w-100 d-flex flex-column text-start ps-4">
                                                        <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                          <span>{item.name}</span>
                                                          <span className="text-primary text-right">{item.price} $</span>
                                                        </h5>
                                                        <small className='fst-italic fs-6'>{item.description}</small>
                                                      </div>
                                                    </div>
                                                        {/* <div className="row  fs-5">
                                                            <div className="col-8">
                                                                <div>
                                                                    <p className='mb-0 fw-bold '>{item.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div>
                                                                    <p className='mb-0 fw-bold'>{item.price} $ </p>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        
                                                        {/* <div>
                                                            <p className='mt-0'><span className='fs-6 fw-bold'></span>{item.description}</p>
                                                        </div> */}
                                                    </div> : ""
                                                })}
                                            </div>
                                        </div>:""
                                    })}
                </div>
            })}


            {/* <div className="tab-class text-center wow fadeInUp" data-wow-delay="0.1s">
              <ul className="nav nav-pills d-inline-flex justify-content-center border-bottom mb-5">
                <li className="nav-item">
                  <a className="nav-link active" data-bs-toggle="pill" href="#tab-1">Breakfast</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="pill" href="#tab-2">Lunch</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-bs-toggle="pill" href="#tab-3">Dinner</a>
                </li>
              </ul>
              <div className="tab-content">
                <div id="tab-1" className="tab-pane fade show active">
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="card">
                        <img src="img/menu-1.jpg" className="card-img-top" alt="..." />
                        <div className="card-body">
                          <h5 className="card-title">Chicken Burger</h5>
                          <p className="card-text">$115</p>
                          <p className="card-text">Ipsum ipsum clita erat amet dolor justo diam</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="tab-2" className="tab-pane fade">
                  <div className="row">
                  </div>
                </div>
                <div id="tab-3" className="tab-pane fade">
                  <div className="row">
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
