import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Nav from './Nav';
import { ColorRing } from  'react-loader-spinner'

export default function EditItem() {
  const [ loading, setloading ] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [spiceLevel, setSpiceLevel] = useState(' ');
  const [isAvailable, setIsAvailable] = useState(false);

  // const [subcategories, setsubCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryId, setcategoryId] = useState("");
  const [restaurantId, setrestaurantId] = useState("");
  const [subcategoryId, setsubcategoryId] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryName, setSubCategoryName] = useState("");
  const navigate = useNavigate();
    const location = useLocation();
    const itemId = location.state.itemId;
  const [item, setItem] = useState({
    name: '',
    description: '',
    price: '',
    spiceLevel: ' ', 
    isAvailable: false 
  });

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Restaurant') {
      navigate('/login');
    }
    if (itemId) {
      fetchItem();
    }
}, [itemId]);

  const fetchItem = async () => {
    try {
      const response = await fetch(`https://restro-wbno.vercel.app/api/getsingleitem/${itemId}`);
      const json = await response.json();

      setCategoryName(json.CategoryName);
      setSelectedSubcategory(json.Subcategory);
      setItemName(json.name);
      setDescription(json.description);
      setPrice(json.price);
      setSpiceLevel(json.spiceLevel);
      setcategoryId(json.category);
      setrestaurantId(json.restaurantId);
      setsubcategoryId(json.subcategoryId);
      setIsAvailable(json.isAvailable);
      // await fetchItem(json.item);
      setloading(false);
  } catch (error) {
      console.error('Error fetching category data:', error);
  }
  };

  const handleSaveClick1 = async (e) => {
    e.preventDefault();
    console.log("api start")
    try {
        const response = await fetch(`https://restro-wbno.vercel.app/api/itemsupdate/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              restaurantId: restaurantId,
              subcategoryId: subcategoryId,
              category: categoryId,
              CategoryName: CategoryName,
              Subcategory: selectedSubcategory,
              name: itemName,
              description: description,
              price: price,
              spiceLevel: spiceLevel,
              isAvailable: isAvailable
            })
        });

        const json = await response.json();

        if (json.success) {
        //   if (subcategoryId !== null) {
        //     navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
        // } else {
        //   navigate('/Restaurantpanel/Items', { state: { restaurantId } });
        // }
            navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
        } else {
            console.error('Error updating Items:', json.message);
        }
    } catch (error) {
        console.error('Error updating Items:', error);
    }
};

const handleCancelEditItems = () => {
  navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
}

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
                <p className='h5 fw-bold'>Edit Item</p>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">                                                 
                      <a href="/Restaurantpanel/Items" className='txtclr text-decoration-none'>Items</a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">Edit Items</li>
                  </ol>
                </nav>
              </div>
              <hr />

              <form onSubmit={handleSaveClick1}>
                <div className="row">
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="categoryName" className="form-label">Category Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="categoryName"
                            value={CategoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder='SubCategory Name'
                            readOnly
                        />
                    </div>
                  </div>
                                    
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                    <div className="mb-3">
                        <label htmlFor="subcategoryName" className="form-label">SubCategory Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="subcategoryName"
                            value={selectedSubcategory}
                            onChange={(e) => setSelectedSubcategory(e.target.value)}
                            placeholder='SubCategory Name'
                            readOnly
                        />
                    </div>
                  </div>
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                      <div className="mb-3">
                          <label htmlFor="itemName" className="form-label">Item Name</label>
                          <input
                              type="text"
                              className="form-control"
                              id="itemName"
                              value={itemName}
                              onChange={(e) => setItemName(e.target.value)}
                              placeholder='Item Name'
                              required
                          />
                      </div>
                  </div>
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                      <div className="mb-3">
                          <label htmlFor="description" className="form-label">Description</label>
                          <textarea
                              className="form-control"
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              placeholder='Description'
                              required
                          />
                      </div>
                  </div>
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                      <div className="mb-3">
                          <label htmlFor="price" className="form-label">Price</label>
                          <input
                              type="number"
                              className="form-control"
                              id="price"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              placeholder='Price'
                          />
                      </div>
                  </div>
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                      <div className="mb-3">
                          <label htmlFor="spiceLevel" className="form-label">Spice Level</label>
                          <select
                              className="form-select"
                              id="spiceLevel"
                              value={spiceLevel}
                              onChange={(e) => setSpiceLevel(e.target.value)}
                              required
                          >
                              <option value=" ">Please Select Spice Level</option>
                              <option value="Mild">Mild</option>
                              <option value="Medium">Medium</option>
                              <option value="Hot">Hot</option>
                          </select>
                      </div>
                  </div>
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                      <div className="mb-3">
                          <div className="form-check">
                              <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="isAvailable"
                                  checked={isAvailable}
                                  onChange={(e) => setIsAvailable(e.target.checked)}
                              />
                              <label className="form-check-label" htmlFor="isAvailable">Is Available</label>
                          </div>
                      </div>
                  </div>
                </div>

                <div className="d-flex mt-3">
                  <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                  <a onClick={() => handleCancelEditItems()} className='btn btn-secondary text-white'>Cancel</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
}
    </div>
  );
}
