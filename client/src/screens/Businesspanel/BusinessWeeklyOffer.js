import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Servicenavbar from './Servicenavbar';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css'
import Servicenav from './Servicenav';
import { ColorRing } from  'react-loader-spinner'


export default function BusinessWeeklyOffer() {
    
  const [ loading, setloading ] = useState(true);
  const [Services, setServices] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [offerName, setofferName] = useState('');
  const [price, setprice] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [errormessage, setErrormessage] = useState('');
const [selectedBusiness, setSelectedBusiness] = useState('');
const [business, setBusiness] = useState([]);


  const navigate = useNavigate();
  
useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }
    fetchStores();
  }, []);

  const fetchServicesByBusiness = async (businessId) => {
    try {
        const response = await fetch(`https://restroproject.onrender.com/api/servicesbybusiness?businessId=${businessId}`);
        const json = await response.json();

        if (json.success && Array.isArray(json.services)) {
            const availableServices = json.services.filter((service) => service.isAvailable === true);
            setServices(availableServices);
          } else {
            setServices([]);
          }
          setloading(false);
    } catch (error) {
        console.error('Error fetching services by business:', error);
    }
};

const fetchStores = async () => {
    try {
        const userid = localStorage.getItem('userid');
        const response = await fetch(`https://restroproject.onrender.com/api/fetchbusiness?userid=${userid}`);
        const json = await response.json();

        if (Array.isArray(json.business)) {
            setBusiness(json.business);
        }
        setloading(false);
    } catch (error) {
        console.error('Error fetching business:', error);
        setloading(false);
    }
};

 // Additional function to handle restaurant selection
 const handleBusinessSelect = (businessId) => {
    console.log(businessId);
    setSelectedBusiness(businessId);
    fetchServicesByBusiness(businessId); // Fetch items for the selected restaurant
};

// const fetchCategories = async () => {
//     try {
//         const userid = localStorage.getItem('userid');
//         const response = await fetch(`https://restroproject.onrender.com/api/servicesall?userid=${userid}`);
//         const json = await response.json();

//         if (Array.isArray(json.services)) {
//             setServices(json.services);
//         }
//         setloading(false);
//     } catch (error) {
//         console.error('Error fetching Services:', error);
//     }
// };

const onChange=(event)=>{
    setSearchResults([...searchResults,event]);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const userid =  localStorage.getItem("userid");
    console.log(userid);

    // Prepare your data to be sent to the backend
    const formData = {
        userid,
        offerName,
        price,
        searchResults,
        startTime,
        endTime,
        selectedDays,
        startDate,
        endDate,
        businessId: selectedBusiness,
    };

    if(searchResults.length == 0 || selectedDays.length == 0 )
    {
        if(searchResults.length == 0)
        {
            setErrormessage("Please select any service");
        }else if(selectedDays.length == 0)
        {
            setErrormessage("Please select any day");
        }else{
        setErrormessage("Please Fill All Details");
        }
    }else{
        setErrormessage("");
    try {

        console.log(userid, "sdsd");
        const response = await fetch('https://restroproject.onrender.com/api/WeeklyOffers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            navigate('/Businesspanel/BusinessWeeklyServices')
            // console.log('Form submitted successfully!');
        } else {
            // Handle error
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}
};

const handleDayCheckboxChange = (day) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedSelectedDays);
  };

const handleSearchResultSelect = (selectedService) => {
    const selectedValue = { label: selectedService.label, value: selectedService.value };
    setSearchResults([...searchResults, selectedValue]);
};

const handleRemoveItem = (serviceValue) => {
    setSearchResults(searchResults.filter((service) => service.value !== serviceValue));
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
    align-Services="center"
    aria-label="Loading Spinner"
    data-testid="loader"        
  />
    </div>:
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                        <Servicenavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Servicenav/>
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row'>
                            <div className="">
                                <p className='h3 fw-bold'>Weekly Offers</p>
                            </div>
                        </div><hr />
                        <form action="" onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-lg-6 col-md-6">
                                    <div class="form-question" className='p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Offer Title</span>
                                        </div>
                                        <div className='flex-wrap'>
                                            <div class='mx-2'>
                                                <input
                                                className="form-control offerbox"
                                                    type='text'
                                                    id='titlebox'
                                                    value={offerName}
                                                    onChange={(e) => setofferName(e.target.value)}
                                                    required
                                                />
                                                </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div class="form-question__title">
                                            <span>Time</span>
                                        </div>
                                        <div class="form-question" className=' pt-0 p-2'>
                                            <div className="form-question__title pt-0">
                                                <span className='fs-5 fw-normal'>Start Date & Time</span>
                                            </div>

                                            <div className="row">
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-question" className=' pt-0 p-2'>
                                            <div className="form-question__title">
                                                <span className='fs-5 fw-normal'>End Date & Time</span>
                                            </div>

                                            <div className="row">
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">

                                    <label htmlFor="storeSelect" className="form-label form-question__title">
                                        Select Business
                                    </label>
                                    <select
                                        className="form-select offerbox wdth py-2 "
                                        id="businessSelect"
                                        onChange={(e) => handleBusinessSelect(e.target.value)}
                                        value={selectedBusiness}
                                    >
                                        <option value="" disabled>Select a store</option>
                                        {business.map((business) => (
                                            <option key={business._id} value={business._id}>
                                                {business.name}
                                            </option>
                                        ))}
                                    </select>
                                    { errormessage.includes("service") != "" ? <div className='row pt-4'>
                                            <div className="">
                                                <p className=' h5 fw-bold text-danger mb-0'>{errormessage}</p>
                                            </div>
                                        </div>:""}
                                        <div className="col-6">
                                            <div className="search-container forms pt-4">
                                                <p className='fs-20'>Search Services</p>
                                                <VirtualizedSelect
                                                    id="searchitems" 
                                                    name="Services"
                                                    className="form-control zindex op pl-8"
                                                    placeholder=""
                                                    onChange={(selectedService) => handleSearchResultSelect(selectedService)}
                                                    options={Services.map((service) => ({ label: service.name, value: service._id }))}
                                                    value={null}

                                                    >
                                                </VirtualizedSelect> 
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className=' backzindex pt-4'>
                                                <p className='fs-20'>Service Name</p>
                                                <div>
                                                    {
                                                        searchResults.map((service) => (
                                                            <li className="badge btn btn-primary m-2 fs-6">{service.label}<i
                                                            className="fas fa-trash text-white ms-2 pointer"
                                                            onClick={() => handleRemoveItem(service.value)}
                                                            ></i></li>
                                                            ))
                                                        }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                                    <div class="form-question" className='py-2 mx-3 pt-0 my-2'>
                                        <div class="form-question__title">
                                        { errormessage.includes("day") != "" ? <div className='row'>
                                            <div className="">
                                                <p className='fw-bold text-danger'>{errormessage}</p>
                                            </div>
                                        </div>:""}
                                            <span className='fs-5 fw-normal'>Select Day</span>
                                        </div>
                                        
                                        <div className=''>
                                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                                            (day) => (
                                                <div className='row mx-2'>
                                                    <div className="col-6">
                                                        <label class='form-check-label' htmlFor={`dayCheckbox-${day}`}>
                                                            {day}
                                                        </label>
                                                    </div>
                                                    <div className="col-6">
                                                        <div class='form-check form-switch mx-2 d-flex justify-content-end' key={day}>
                                                            <input
                                                                class='form-check-input'
                                                                type='checkbox'
                                                                role="switch"
                                                                value={day}
                                                                id={`dayCheckbox-${day}`}
                                                                checked={selectedDays.includes(day)}
                                                                onChange={() => handleDayCheckboxChange(day)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            )}
                                        </div>
                                    </div>

                                    <div class="form-question" className=' p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span className='fw-normal fs-5'>Offer Price</span>
                                        </div>
                                        <div className='flex-wrap'>
                                            <div class=' mx-2'>
                                                <input
                                                    class='form-control offerbox'
                                                    type='number'
                                                    id='Price'
                                                    value={price}
                                                    onChange={(e) => setprice(e.target.value)}
                                                    required
                                                />
                                                </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-4">
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary mt-5" type='submit' >
                                    Submit
                                    </button>

                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
}
    </div>
  )
}
