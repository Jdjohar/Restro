import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import Retaiernavbar from './Retaiernavbar';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized-select/styles.css';
import 'react-virtualized/styles.css';
import Retailernav from './Retailernav';
import { ColorRing } from  'react-loader-spinner'

export default function RetailOffers() {
    
  const [ loading, setloading ] = useState(true);
  const [Products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [offerName, setofferName] = useState('');
  const [customtxt, setCustomtxt] = useState('');

  const navigate = useNavigate();
  
useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Retailer') {
      navigate('/login');
    }
    fetchdata();
  }, []);

const fetchdata = async () => {
    try {
        const userid = localStorage.getItem('userid');
        const response = await fetch(`https://restro-wbno.vercel.app/api/productsall?userid=${userid}`);
        const json = await response.json();

        if (Array.isArray(json.products)) {
            setProducts(json.products);
        }
        setloading(false);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

const onChange=(event)=>{
    setSearchResults([...searchResults,event]);
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const userid =  localStorage.getItem("userid");
    const formData = {
        userid,
        offerName,
        customtxt,
        searchResults,
    };

    try {
        const response = await fetch('https://restro-wbno.vercel.app/api/Offers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            navigate('/Retailerpanel/RetailOfferProducts')
        } else {
            // Handle error
            console.error('Form submission failed.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};
  const handleRemoveItem = (productValue) => {
    setSearchResults(searchResults.filter((product) => product.value !== productValue));
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
    align-Products="center"
    aria-label="Loading Spinner"
    data-testid="loader"        
  />
    </div>:
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                        <Retaiernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Retailernav/>
                    </div>

                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row'>
                            <div className="">
                                <p className='h3 fw-bold'>Offers</p>
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
                                            <div class=' mx-2'>
                                                <input
                                                className="form-control offerbox wdth"
                                                    type='text'
                                                    id='titlebox'
                                                    value={offerName}
                                                    onChange={(e) => setofferName(e.target.value)}
                                                    required
                                                />
                                                </div>
                                        </div>
                                    </div>
                                    <div class="form-question" className='p-2 pt-0 my-2'>
                                        <div class="form-question__title">
                                            <span>Custom Text</span>
                                        </div>
                                        <div className='flex-wrap txtarea'>
                                            <div class=' mx-2'>
                                                <textarea
                                                    className='form-control wdth offerbox'
                                                    type='text'
                                                    id='customtxt'
                                                    style={{height: "120px !important;"}}
                                                    value={customtxt}
                                                    onChange={(e) => setCustomtxt(e.target.value)}
                                                    cols={50}
                                                    rows={20}
                                                />
                                                </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6 col-md-6">
                                    <div className="search-container forms  my-lg-4 my-md-3 my-2 ">
                                        <p className='fs-20'>Search Products</p>
                                        <VirtualizedSelect
                                            id="searchitems" 
                                            name="Products"
                                            className="form-control zindex op ps-0"
                                            placeholder=""
                                            onChange={onChange}
                                            options={ Products.map((product,index)=>
                                                ({label: product.name, value: product._id})
                                            
                                            )}

                                        >
                                        </VirtualizedSelect> 
                                        <div className='pt-3 backzindex mt-lg-3 mt-md-5 mt-4'>
                                            <p className='fs-20'>Product Name</p>
                                            <ul>
                                                {
                                                    searchResults.map((product) => (
                                                        <li className="badge btn btn-primary m-2 fs-6">{product.label} <i
                                                        className="fas fa-trash text-white ms-2 pointer"
                                                        onClick={() => handleRemoveItem(product.value)}
                                                    ></i></li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary mt-3 ms-3" type='submit' >
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
