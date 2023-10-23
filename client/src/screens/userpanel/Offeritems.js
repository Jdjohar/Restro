import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import Nav from './Nav';

export default function Offeritems() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetch offers from the backend when the component mounts
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/offeritemsall');
      const data = await response.json();

      if (data.success) {
        // Set the fetched offers in state
        setOffers(data.offers);
      } else {
        // Handle error
        console.error('Failed to fetch offers.');
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  return (
    <div className='bg'>
      <div className='container-fluid'>
        <div className='row'>
            <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
              <div  >
                <Usernavbar/>
              </div>
            </div>

          <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div>
            <div className="bg-white my-5 p-4 box mx-4">
              <div className='row'>
                <div className=''>
                  <p className='h3 fw-bold'>Offer Items</p>
                </div>
              </div>
              <hr />

              {/* Display fetched offers */}
              <div className="row offerlist">
                {offers.map((offer) => (
                  <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                    <div className="boxitem my-3 p-3">
                      <div className="row">
                        <div className="col-3 f-flex justify-content-center">
                          <div className="boxtxt">
                            <p className='bx fw-bold text-white'>{offer.offerName[0]}</p>
                          </div>
                        </div>
                        <div className="col-9">
                          <p className='fw-bold fs-3 my-0'>{offer.offerName}</p>
                          <p className='fs-5'>{offer.customtxt}</p>
                        </div>
                      </div>

                      <div className='my-4'>
                        <span className='fs-5 fw-bold'>Items </span>
                        <ul className='itemlist mt-3'>
                            {offer.searchResults.map((result, index) => (
                              <li key={result.value} className=' badge btn btn-primary me-2 my-2 fs-6'>{result.label}
                                {index < offer.searchResults.length - 1}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
