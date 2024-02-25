import React, { useState, useEffect } from 'react';
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function WeeklyOfferitems() {
  const [ loading, setloading ] = useState(true);
  const [weeklyoffers, setweeklyOffers] = useState([]);
  const [switchStates, setSwitchStates] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  
useEffect(() => {
  const authToken = localStorage.getItem('authToken');
  const signUpType = localStorage.getItem('signuptype');

  if (!authToken || signUpType !== 'Restaurant') {
    navigate('/login');
  }
      fetchOffers();
}, []);

const fetchOffers = async () => {
  try {
    const userid = localStorage.getItem('merchantid');
    const authToken = localStorage.getItem('authToken');
    const response = await fetch(`https://real-estate-1kn6.onrender.com/api/weeklyofferall?userid=${userid}`, {
      headers: {
        'Authorization': authToken,
      }
    });

    if (response.status === 401) {
      const data = await response.json();
      setAlertMessage(data.message);
      setloading(false);
      window.scrollTo(0,0);
      return; // Stop further execution
    }
    else{
      const data = await response.json();

      if (response.ok) {
        if (Array.isArray(data.weeklyoffers)) {
          // Map over offers to set initial switch states
          const offersWithSwitchStates = data.weeklyoffers.reduce((acc, weeklyoffer) => {
            acc[weeklyoffer._id] = weeklyoffer.switchState; // Assuming offer.switchState holds the switch state
            return acc;
          }, {});
          setSwitchStates(offersWithSwitchStates);
          setweeklyOffers(data.weeklyoffers);
        } else {
          setweeklyOffers([]);
        }
        // if (Array.isArray(data.weeklyoffers)) {
        //   setweeklyOffers(data.weeklyoffers);
        // } else {
        //   setweeklyOffers([]); // Set empty array if data.offeritems is not an array
        // }
      } else {
        // If the response is not ok, throw an error
        throw new Error(`Error: ${data.message || response.statusText}`);
      }
      setloading(false);
    }
    
  } catch (error) {
    console.error('Error fetching weeklyoffers:', error);
    setweeklyOffers([]); // Set empty array in case of error
    setloading(false);
  }
};

  // const fetchOfferss = async () => {
  //   try {
  //     const response = await fetch(`https://real-estate-1kn6.onrender.com/api/weeklyofferitemsall?userid=${userid}`);
  //     const data = await response.json();

  //     if (data.success) {
  //       // Set the fetched weeklyoffers in state
  //       setweeklyOffers(data.weeklyoffers);
  //     } else {
  //       // Handle error
  //       console.error('Failed to fetch weeklyoffers.');
  //     }
  //     setloading(false);
  //   } catch (error) {
  //     console.error('Error fetching weeklyoffers:', error);
  //   }
  // };


  function convertTo12HourFormat(time24) {
    // Split the time into hours and minutes
    const [hours, minutes] = time24.split(':');
    
    // Parse the hours and minutes as integers
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);
    
    // Determine whether it's AM or PM
    const period = hour >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    
    // Create the formatted time string
    const time12 = `${hour12}:${(minute < 10 ? '0' : '') + minute} ${period}`;
    
    return time12;
  }

    // Function to toggle switch state
    const toggleSwitch = (offerId, currentState) => {
      const updatedStates = { ...switchStates, [offerId]: !currentState };
      setSwitchStates(updatedStates);
  
      // Call a function here to update the database with the new switch state
      updateSwitchStateInDatabase(offerId, !currentState);
    };
  
    const updateSwitchStateInDatabase = async (offerId, newState) => {
      try {
        // Make an API call to update the switch state in the database
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`https://real-estate-1kn6.onrender.com/api/updateSwitchStateweekly/${offerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken,
          },
          body: JSON.stringify({ switchState: newState }),
        });

        if (response.status === 401) {
          const json = await response.json();
          setAlertMessage(json.message);
          setloading(false);
          window.scrollTo(0,0);
          return; // Stop further execution
        }
        else{
          if (!response.ok) {
          throw new Error('Failed to update switch state');
        }
        }
  
        
      } catch (error) {
        console.error('Error updating switch state:', error);
        // Handle error accordingly
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
                <Usernavbar/>
              </div>
            </div>

          <div className='col-lg-10 col-md-9 col-12 mx-auto'>
            <div className='d-lg-none d-md-none d-block mt-2'>
                <Nav/>
            </div>
            <div className='mx-5 mt-5'>
                {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
            </div>

            <div className='bg-white my-5 p-4 box mx-4'>
              <div className='row'>
                <div className=''>
                  <p className='fs-3 fw-bold'>Weekly Offer Items</p>
                </div>
              </div>
              <hr />

              {/* Display fetched weeklyoffers */}
              <div className="row offerlist">
                {weeklyoffers.map((offer) => (
                    <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                        <div className="boxitem my-3 py-5 px-4">
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
                    <p className='fw-bold fs-3 mb-3'>{offer.offerName}</p>
                    <div className="b-bottom1 mb-3">
                      <div className="d-flex">
                        <i class="fa-solid fa-calendar-days mt-1 me-2 clryllow"></i>
                        <p className='fs-6 fw-bold'> {new Date(offer.startDate).toLocaleDateString()} -</p>
                        <p className='fs-6 fw-bold'>{new Date(offer.endDate).toLocaleDateString()}</p>
                      </div>
                      <div className="d-flex">
                        <i class="fa-solid fa-clock mt-1 me-2 clryllow"></i>
                        <p className='fs-6 fw-bold'>{convertTo12HourFormat(offer.startTime)} - </p>
                        <p className='fs-6 fw-bold'> {convertTo12HourFormat(offer.endTime)}</p>
                      </div>
                    </div>
                    <div className='b-bottom1 mb-3'>
                      <p className='fs-5 fw-normal mb-0'>Days</p>
                        <ul>
                              {offer.selectedDays.map((result, index) => (
                                <li key={result.value} className=' badge btn btn-primary me-2 my-2 fs-6'>{result}
                                  {index < offer.selectedDays.length - 1}</li>
                              ))}
                        </ul>
                    </div>

                    <div>
                      <p className='fs-5 fw-normal mb-0'>Items</p>
                        <ul className='itemlist'>
                            {offer.searchResults.map((result,index) => (
                            <li key={result.value} className=' badge btn btn-primary me-2 my-2 fs-6'>{result.label}
                            {index < offer.searchResults.length - 1}</li>
                            ))}
                        </ul>
                    
                      <p className='fs-4 fw-bold pt-3'>RS. {offer.price} /-</p>
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

