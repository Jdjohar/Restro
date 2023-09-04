import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';

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
          <div className='col-2 vh-100 p-0' style={{ backgroundColor: '#fff' }}>
            <Usernavbar />
          </div>

          <div className='col-10'>
            <div className='bg-white mt-5 p-3 box mb-5'>
              <div className='row'>
                <div className='col-4 me-auto'>
                  <p className='h2'>Offer Items</p>
                </div>
              </div>
              <hr />

              {/* Display fetched offers */}
              <div className="row offerlist">
                {offers.map((offer) => (
                    <div key={offer._id} className='col-6'>
                        <div className="boxitem my-3 p-3">
                    <h2 className='text-center'>{offer.offerName}</h2>
                    <ul className='itemlist'>
                    <span className='fs-5 ps-3'>Items: </span>
                        {offer.searchResults.map((result,index) => (
                        <li key={result.value} className='fs-5'>{result.label}
                        {index < offer.searchResults.length - 1 && ', '}</li>
                        ))}
                    </ul>
                    <p className='text-right h3'>{offer.price} RS/-</p>
                    </div>

                        </div>
                ))}
              </div>
              {/* {offers.map((offer) => (
                <div key={offer._id} className='col-6'>
                  <h3>Offer Details</h3>
                  <p>Start Time: {offer.startTime}</p>
                  <p>End Time: {offer.endTime}</p>
                  <p>Selected Days: {offer.selectedDays.join(', ')}</p>
                  <p>Search Results:</p>
                  <ul>
                    {offer.searchResults.map((result) => (
                      <li key={result.value}>{result.label}</li>
                    ))}
                  </ul>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

