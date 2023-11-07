import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css'
import Nav from './Nav';


export default function WeeklyOffers() {
    
  const [Items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [offerName, setofferName] = useState('');
  const [price, setprice] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
        fetchCategories();
}, []);

const fetchCategories = async () => {
    try {
        const response = await fetch(`http://localhost:3001/api/itemsall`);
        const json = await response.json();

        if (Array.isArray(json.items)) {
            setItems(json.items);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
const onChange=(event)=>{
    setSearchResults([...searchResults,event]);
    // setSelectedItems([...selectedItems, event.label]);
}

const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare your data to be sent to the backend
    const formData = {
        offerName,
        price,
        searchResults,
        startTime,
        endTime,
        selectedDays,
        startDate,
        endDate,
        // selectedItems
        // Other form data
    };

    try {
        const response = await fetch('http://localhost:3001/api/WeeklyOffers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            navigate('/Restaurantpanel/WeeklyOfferitems')
            // console.log('Form submitted successfully!');
        } else {
            // Handle error
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

const handleDayCheckboxChange = (day) => {
    const updatedSelectedDays = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updatedSelectedDays);
  };
  const handleRemoveItem = (itemValue) => {
    setSearchResults(searchResults.filter((item) => item.value !== itemValue));
};
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
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
                            <div className="">
                                <p className='h3 fw-bold'>Weekly Offers</p>
                            </div>
                        </div><hr />
                        <form action="">
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
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) => setStartTime(e.target.value)}
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
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <input
                                                        className="form-control offerbox"
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) => setEndTime(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-6">
                                            <div className="search-container forms pt-4">
                                                <p className='fs-20'>Search Items</p>
                                                <VirtualizedSelect
                                                    id="searchitems" 
                                                    name="items"
                                                    className="form-control zindex op pl-8"
                                                    placeholder=""
                                                    onChange={onChange}
                                                    options={ Items.map((item,index)=>
                                                        ({label: item.name, value: item._id})
                                                    
                                                    )}

                                                    >
                                                </VirtualizedSelect> 
                                            </div>
                                        </div>

                                        <div className="col-6">
                                            <div className=' backzindex pt-4'>
                                                <p className='fs-20'>Item Name</p>
                                                <div>
                                                    {
                                                        searchResults.map((item) => (
                                                            <li className="badge btn btn-primary m-2 fs-6">{item.label}<i
                                                            className="fas fa-trash text-white ms-2 pointer"
                                                            onClick={() => handleRemoveItem(item.value)}
                                                            ></i></li>
                                                            ))
                                                        }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="search-container forms pt-4 ps-3">
                                        <h4>Search Items</h4>
                                        <VirtualizedSelect
                                            id="searchitems" 
                                            name="items"
                                            className="form-control zindex op ps-0"
                                            placeholder=""
                                            onChange={onChange}
                                            options={ Items.map((item,index)=>
                                                ({label: item.name, value: item._id})
                                            
                                            )}

                                        >
                                        </VirtualizedSelect> 
                                        <div className=' backzindex mt-lg-5 mt-md-5 mt-3'>
                                            <h4>Item Name</h4>
                                            <div>
                                                {
                                                    searchResults.map((item) => (
                                                        <li className="badge btn btn-primary m-2 fs-6">{item.label}<i
                                                        className="fas fa-trash text-white ms-2 pointer"
                                                        onClick={() => handleRemoveItem(item.value)}
                                                    ></i></li>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="col-lg-4 col-md-6 col-sm-6 col-12">
                                    <div class="form-question" className='py-2 mx-3 pt-0 my-2'>
                                        <div class="form-question__title">
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
                                                />
                                                </div>
                                        </div>
                                    </div>

                                    {/* <div class="form-question" className='brdr my-3 pt-0 p-2'>
                                        <div className="form-question__title">
                                            <span>Select Date</span>
                                        </div>

                                        <div className="row">
                                            <div className="col-6">
                                                <div className="">
                                                    <span>Start Date</span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-6">
                                                <div className="">
                                                    <span>End Date</span>
                                                </div>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>

                                <div className="col-4">

                                    {/* <div class="form-question" className='brdr my-3 pt-0 p-2'>
                                        <div className='form-question__title'>
                                            <span>Select Time</span>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="">
                                                    <span>Start Time</span>
                                                </div>
                                                <input
                                                    type="time"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                />
                                            </div>

                                            <div className="col-6">
                                                <div className="">
                                                    <span>End Time</span>
                                                </div>
                                                <input
                                                    type="time"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div> */}

                                    {/* <div class="form-question" className='brdr p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Offer Price</span>
                                        </div>
                                        <div className='d-flex flex-wrap'>
                                            <div class=' mx-2'>
                                                <input
                                                    class='form-control'
                                                    type='number'
                                                    id='Price'
                                                    value={price}
                                                    onChange={(e) => setprice(e.target.value)}
                                                />
                                                </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary mt-5" onClick={handleSubmit}>
                                    Submit
                                    </button>

                                </div>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
