import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css'


export default function Offers() {
    
  const [Items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [offerName, setofferName] = useState('');
  const [price, setprice] = useState('');

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

    const formData = {
        offerName,
        price,
        searchResults,
    };

    try {
        const response = await fetch('http://localhost:3001/api/Offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            navigate('/Userpanel/Offeritems')
            // console.log('Form submitted successfully!');
        } else {
            // Handle error
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};
  const handleRemoveItem = (itemValue) => {
    setSearchResults(searchResults.filter((item) => item.value !== itemValue));
};
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>

                <div className="col-10">
                    <div className="bg-white mt-5 p-3 box mb-5">
                        <div className='row'>
                            <div className="col-4 me-auto">
                                <p className='h5'>Offers</p>
                            </div>
                        </div><hr />
                        <form action="">
                            <div className="row">
                                <div className="col-5 me-auto">
                                    <div class="form-question" className='p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Offer Title</span>
                                        </div>
                                        <div className='d-flex flex-wrap'>
                                            <div class=' mx-2'>
                                                <input
                                                className="form-control"
                                                    type='text'
                                                    id='titlebox'
                                                    value={offerName}
                                                    onChange={(e) => setofferName(e.target.value)}
                                                />
                                                </div>
                                        </div>
                                    </div>
                                    <div className="search-container forms">
                                        <h4>Search Items</h4>
                                        <VirtualizedSelect
                                            id="searchitems" 
                                            name="items"
                                            className="form-control zindex op"
                                            placeholder=""
                                            onChange={onChange}
                                            options={ Items.map((item,index)=>
                                                ({label: item.name, value: item._id})
                                            
                                            )}

                                        >
                                        </VirtualizedSelect> 
                                        <div className='pt-3 backzindex'>
                                            <h4>Item Name</h4>
                                            <div>
                                                {
                                                    searchResults.map((item) => (
                                                        <p>{item.label} <i
                                                        className="fas fa-trash text-danger"
                                                        onClick={() => handleRemoveItem(item.value)}
                                                    ></i></p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    
                                    <div class="form-question" className='p-2 pt-0 my-2'>
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
                                    </div>

                                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>
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
