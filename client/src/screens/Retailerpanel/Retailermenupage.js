import React,{useState,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
// import Teststyle from './Teststyle'

export default function Retailermenupage() {

  const location = useLocation();
  // const storeId = location.state?.storeId;
  const [products, setProducts] = useState([]);
  const pathname = location.pathname;
  const parts = pathname.split('/'); // Split the pathname into parts
  const pageName = parts[parts.length - 1]; // Get the last part of the pathname
  const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1); 
  const storeId = pageTitle;
  console.log(storeId,"dsfsdf");

  useEffect(() => {
    // fetchStoreData();
    fetchdata();
}, [storeId]);

const fetchdata = async () => {
  try {
      // const storeId =  localStorage.getItem("storeId");
      const response = await fetch(`http://localhost:3001/api/getstoreproductsformenu/${storeId}`);
      const json = await response.json();
      
      if (Array.isArray(json)) {
          setProducts(json);
      }
  } catch (error) {
      console.error('Error fetching data:', error);
  }
}

  return (
    <div className='bgwhite'>
      <div className="container-fluid p-0">
        <div className="py-5">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">Products</h5>
              {/* <h1 className="mb-5">Most Popular Items</h1> */}
            </div>
            <div className="row">
              {products.map((product, index) => (
              <div className="col-12 col-md-6 col-lg-6 px-2" key={index}>
                <div className='d-flex align-items-center py-2'>
                  <img src={product.imageUrl} className="item-image flex-shrink-0 img-fluid rounded" alt="item" />
                    <div className="w-100 d-flex flex-column text-start ps-4">
                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                        <span>{product.name}</span>
                        <span className="text-primary text-right">{product.price} $</span>
                      </h5>
                      <small className='fst-italic fs-6'>{product.description}</small>
                      <p className='my-0'>
                        <span className='fs-6 me-3'><strong>clr:</strong> {product.colour}</span>
                        <span className='fs-6 me-3'><strong>size:</strong> {product.size}</span>
                        <span className='fs-6'><strong>qty:</strong> {product.quantity}</span>
                      </p>
                    </div>
                  </div>
                  {/* Display product information */}
                  {/* <div className='row p-2'>
                      <div className='col-8'>
                          <p className='mb-0 fw-bold fs-5'>{product.name}</p>
                          <p className='mb-0 fw-bold'>{product.description}</p>
                          <p className='mb-0 fw-bold'>{product.size}</p>
                          <p className='my-0'>
                              <span className='fs-6 fw-bold'>{product.colour}</span>
                          </p>
                      </div>
                      <div className='col-4'>
                          <p className='mb-0 fw-bold fs-5'>{product.price}</p>
                          <p className='my-0'>
                              <span className='fs-6 fw-bold'>Qty: {product.quantity}</span>
                          </p>
                      </div>
                  </div> */}
              </div>
            ))} </div>
                       
            {/* {Categories.map((categoryItem, indexd) => {
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
                                                    <div className='d-flex align-items-center'>
                                                    <img src={item.imageUrl} className="item-image flex-shrink-0 img-fluid rounded" alt="item" />
                                                      <div className="w-100 d-flex flex-column text-start ps-4">
                                                        <h5 className="d-flex justify-content-between border-bottom pb-2">
                                                          <span>{item.name}</span>
                                                          <span className="text-primary text-right">{item.price} $</span>
                                                        </h5>
                                                        <small className='fst-italic fs-6'>{item.description}</small>
                                                      </div>
                                                    </div>
                                                    </div> : ""
                                                })}
                                            </div>
                                        </div>:""
                                    })}
                </div>
            })} */}
          </div>
        </div>
      </div>
    </div>
  );
}
