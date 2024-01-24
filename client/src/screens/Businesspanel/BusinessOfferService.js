import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Servicenavbar from './Servicenavbar';
import Servicenav from './Servicenav';
import { ColorRing } from  'react-loader-spinner'

export default function BusinessOfferService() {
  const [ loading, setloading ] = useState(true);
  const [offers, setOffers] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }
      fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const response = await fetch(`https://real-estate-1kn6.onrender.com/api/offerall?userid=${userid}`);
      const data = await response.json();
  
      if (response.ok) {
        if (Array.isArray(data.offers)) {
          // Map over offers to set initial switch states
          const offersWithSwitchStates = data.offers.reduce((acc, offer) => {
            acc[offer._id] = offer.switchState; // Assuming offer.switchState holds the switch state
            return acc;
          }, {});
          setSwitchStates(offersWithSwitchStates);
          setOffers(data.offers);
        } else {
          setOffers([]); // Set empty array if data.offeritems is not an array
        }
      } else {
        // If the response is not ok, throw an error
        throw new Error(`Error: ${data.message || response.statusText}`);
      }
      setloading(false);
    } catch (error) {
      console.error('Error fetching offers:', error);
      setOffers([]); // Set empty array in case of error
      setloading(false);
    }
  };

  // Function to toggle switch state
  const toggleSwitch = (offerId, currentState) => {
    const updatedStates = { ...switchStates, [offerId]: !currentState };
    setSwitchStates(updatedStates);

    // Call a function here to update the database with the new switch state
    updateSwitchStateInDatabase(offerId, !currentState);
  };

  const updateSwitchStateInDatabase = async (offerId, newState) => {
    try {
      const response = await fetch(`https://real-estate-1kn6.onrender.com/api/updateSwitchState/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ switchState: newState }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update switch state');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error updating switch state:', error);
      return { success: false };
    }
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
        <div className='row'>
            <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
              <div  >
                <Servicenavbar/>
              </div>
            </div>

          <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Servicenav/>
                    </div>
            <div className="bg-white my-5 p-4 box mx-4">
              <div className='row'>
                <div className=''>
                  <p className='h3 fw-bold'>Offer Services</p>
                </div>
              </div>
              <hr />

              {/* Display fetched offers */}
              <div className="row offerlist">
                {offers.map((offer) => (
                  <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                    <div className="boxitem my-3 p-3">
                      <div className="row">
                        <div class="form-check form-switch text-end">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`flexSwitchCheck-${offer._id}`}
                            checked={switchStates[offer._id]}
                            onChange={() => toggleSwitch(offer._id, switchStates[offer._id])}
                          />                      
                        </div>
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
                        {offer.searchResults.length == 0 ? <div></div> :
                        <span className='fs-5 fw-bold'>Services </span>}
                        <ul className='itemlist mt-3'>
                            {offer.searchResults.map((result, index) => (
                              <li key={result.value} className=' badge btn btn-primary autocursor me-2 my-2 fs-6'>{result.label}
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
}
    </div>
  );
}
