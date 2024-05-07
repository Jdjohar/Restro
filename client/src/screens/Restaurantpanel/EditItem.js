import React, { useState, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import Nav from './Nav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function EditItem() {
  const [ loading, setloading ] = useState(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [spiceLevel, setSpiceLevel] = useState(' ');
  const [isAvailable, setIsAvailable] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // const [subcategories, setsubCategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryId, setcategoryId] = useState("");
  const [restaurantId, setrestaurantId] = useState("");
  const [subcategoryId, setsubcategoryId] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [image, setImage] = useState(null);
  const [subcatselect, setsubcatselect] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
    const location = useLocation();
    const itemId = location.state.itemId;
    const subselect = location.state.subselect;
    console.log(location.state.subselect);
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
    if(location.state.subselect)
    {
      setsubcatselect(location.state.subselect);
    }
    if (itemId) {
      fetchItem();
    }
}, [itemId]);

  const fetchItem = async () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/getsingleitem/${itemId}`, {
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
        setImageUrl(json.imageUrl);
        // await fetchItem(json.item);
        setloading(false);
      }
      
  } catch (error) {
      console.error('Error fetching category data:', error);
  }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSaveClick1 = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3001/api/itemsupdate/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
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
              isAvailable: isAvailable,
              imageUrl: image ? await uploadImageToCloudinary(image) : imageUrl,
            })
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

          if (json.success) {
            if (subcategoryId !== null && subcatselect) {
              navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
          } else {
            navigate('/Restaurantpanel/Items', { state: { restaurantId } });
          }
              // navigate('/Restaurantpanel/Items', { state: { subcategoryId } });
          } else {
              console.error('Error updating Items:', json.message);
          }
        }

        
    } catch (error) {
        console.error('Error updating Items:', error);
    }
};

const uploadImageToCloudinary = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('upload_preset', 'restrocloudnary');
    formData.append('cloud_name', 'dlq5b1jed');
    formData.append('file', imageFile);

    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dlq5b1jed/image/upload', {
      method: 'POST',
      body: formData,
    });

    const cloudinaryData = await cloudinaryResponse.json();
    return cloudinaryData.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
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
            <div className='mx-5 mt-5'>
              {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
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
                        <label htmlFor="categoryName" className="form-label">Category ds  {subcatselect.toString()} Name</label>
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
                  {/* <div className='col-10 col-sm-6 col-md-6 col-lg-4'>
                      <div className='mb-3'>
                        <label htmlFor='image' className='form-label'>
                          Upload Image
                        </label>
                        <input
                          type='file'
                          className='form-control'
                          id='image'
                          value={imageUrl}
                          onChange={handleImageUpload}
                          accept='image/*'
                        />
                      </div>
                  </div> */}
                  <div className="col-10 col-sm-6 col-md-6 col-lg-4">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">Current Image</label>
                      {imageUrl ? (
                        <div>
                          <img src={imageUrl} alt="Current Item Image" className='item-image flex-shrink-0 img-fluid rounded' />
                          <div className="mt-2">
                            <label htmlFor="newImage" className="form-label">Upload New Image</label>
                            <input
                              type="file"
                              className="form-control"
                              id="newImage"
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2">
                            <label htmlFor="newImage" className="form-label">Upload New Image</label>
                            <input
                              type="file"
                              className="form-control"
                              id="newImage"
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </div>
                      )}
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
