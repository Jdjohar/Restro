import React,{useState,useEffect} from 'react';
import { useLocation,useNavigate } from 'react-router-dom';

export default function Businessmenudetail() {
    const location = useLocation();
    const [services, setServices] = useState([]);
    const pathname = location.pathname;
    const parts = pathname.split('/'); // Split the pathname into parts
    const pageName = parts[parts.length - 1]; // Get the last part of the pathname
    const pageTitle = pageName.charAt(0).toUpperCase() + pageName.slice(1); 
    const businessId = pageTitle;

    useEffect(() => {
      // fetchStoreData();
      fetchdata();
  }, [businessId]);


    const fetchdata = async () => {
        try {
            // const businessId =  localStorage.getItem("businessId");
            const response = await fetch(`https://restroproject.onrender.com/api/getservicesformenu/${businessId}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setServices(json);
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
                  <h5 className="section-title ff-secondary text-center text-primary fw-normal">Services</h5>
                  {/* <h1 className="mb-5">Most Popular Items</h1> */}
                </div>
                <div className="row">
                  {services.map((service, index) => (
                  <div className="col-12 col-md-6 col-lg-6 px-2" key={index}>
                    <div className='d-flex align-items-center py-2'>
                      <img src={service.imageUrl} className="item-image flex-shrink-0 img-fluid rounded" alt="item" />
                        <div className="w-100 d-flex flex-column text-start ps-4">
                          <h5 className="d-flex justify-content-between border-bottom pb-2">
                            <span>{service.name}</span>
                            <span className="text-primary text-right">{service.price} $</span>
                          </h5>
                          <small className='fst-italic fs-6'>{service.time}</small>
                          {/* <p className='my-0'>
                            <span className='fs-6 me-3'><strong>clr:</strong> {product.colour}</span>
                            <span className='fs-6 me-3'><strong>size:</strong> {product.size}</span>
                            <span className='fs-6'><strong>qty:</strong> {product.quantity}</span>
                          </p> */}
                        </div>
                      </div>
                  </div>
                ))} </div>
              </div>
            </div>
          </div>
        </div>
      );
}
