import React,{useState} from 'react'
import Usernavbar from './userpanel/Usernavbar'
import { useNavigate} from 'react-router-dom'
import { useRestaurantContext } from '../components/RestaurantContext'

export default function Addrestaurent() {
    

    const [credentails, setcredentails] = useState({ name: "", email: "", type: "", number: "", city: "", state: "",country: "",zip: "", address: ""})
    // const [credentails, setcredentails] = useState({ name: "", email: "", type: "", number: "", city: "", state: "",country: "",zip: "", address: "" })
    const [message, setmessage] = useState(false);
    const [alertshow, setalertshow] = useState('');
    const { addRestaurant } = useRestaurantContext();
    let navigate = useNavigate();
   
    const handleSubmit = async (e) => {
      e.preventDefault();
      let userid = localStorage.getItem("userid");
      const response = await fetch("http://localhost:3001/api/addrestaurent", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({userid: userid, name: credentails.name, email: credentails.email, type: credentails.type, number: credentails.number, city: credentails.city, state: credentails.state, country: credentails.country, zip: credentails.zip, address: credentails.address })
      });
  
      const json = await response.json();
      console.log(json);
  
      if (json.Success) {
        setcredentails({ name: "", email: "", type: "", number: "", city: "", state: "",country: "",zip: "", address: ""  })

        setmessage(true)
        setalertshow(json.message)
        navigate('/Userpanel/Restaurents')
        addRestaurant({
            userid: userid,
            name: credentails.name,
            type: credentails.type,
            email: credentails.email,
            number: credentails.number,
            city: credentails.city,
            state: credentails.state,
            country: credentails.country,
            zip: credentails.zip,
            address: credentails.address,
        });
      }
    }
  
    const onchange = (event) => {
      setcredentails({ ...credentails, [event.target.name]: event.target.value })
    }
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>

                    <div className="col-10">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white mt-5 px-3 py-5 box mb-5">
                            <div className='row'>
                                <p className='h5'>Restaurents</p>
                               {/* <p> {credentails.name}</p>
                               <p> {credentails.type}</p>
                               <p> {credentails.email}</p>
                               <p> {credentails.number}</p>
                               <p> {credentails.city}</p>
                               <p> {credentails.state}</p>
                               <p> {credentails.country}</p>
                               <p> {credentails.zip}</p>
                               <p> {credentails.address}</p> */}
                              
                                    <nav aria-label="breadcrumb">
                                        <ol class="breadcrumb mb-0">
                                            <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                            <li class="breadcrumb-item active" aria-current="page">Add a new restaurant</li>
                                        </ol>
                                    </nav>
                            </div><hr />

                            <div className="row">
                                <div className="col-11 m-auto box shadow ">
                                    <div className='p-3'>
                                        <p className='h5'>Restaurant details</p><hr />
                                        <div className="row">
                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputtext1" class="form-label">Restaurant Name </label>
                                                    <input type="text" class="form-control" name="name" value={credentails.name} onChange={onchange} placeholder='Restaurant Name' id="exampleInputtext1" required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputtext2" class="form-label">Restaurant Type </label>
                                                    <select class="form-select" name='type' onChange={onchange} aria-label="Default select example" required>
                                                        <option value="">Select Restaurant Type</option>
                                                        <option value="Cafe">Cafe</option>
                                                        <option value="Hotel">Hotel</option>
                                                        <option value="Food Truck">Food Truck</option>
                                                        <option value="Quick Service Restaurant">Quick Service Restaurant</option>
                                                        <option value="Pub/Bar">Pub/Bar</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="exampleInputEmail1" class="form-label">Contact Email</label>
                                                    <input type="email" class="form-control" name="email" value={credentails.email} onChange={onchange} placeholder='Contact Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                                </div>
                                            </div>

                                            <div className="col-4"> 
                                                <div class="mb-3">
                                                    <label for="Number" class="form-label">Phone Number </label>
                                                    <input type="number" name='number' class="form-control" onChange={onchange} placeholder='Phone Number' id="phonenumber" required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="City " class="form-label">City </label>
                                                    <input type="text " name='city' onChange={onchange} class="form-control" placeholder='City ' id="City " required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="State " class="form-label">State </label>
                                                    <input type="text " name='state' onChange={onchange} class="form-control" placeholder='State ' id="State " required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="Country  " class="form-label">Country  </label>
                                                    <input type="text  "  name='country' onChange={onchange} class="form-control" placeholder='Country  ' id="Country  " required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="Zip  " class="form-label">Zip  </label>
                                                    <input type="text  " name='zip' onChange={onchange} class="form-control" placeholder='Zip  ' id="Zip  " required/>
                                                </div>
                                            </div>

                                            <div className="col-4">
                                                <div class="mb-3">
                                                    <label for="Address" class="form-label">Address</label>
                                                    <input type="message" name='address' onChange={onchange} class="form-control" placeholder='Address' id="Address" required/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row pt-4">
                                <div className="col-3 me-auto">

                                </div>
                                <div className="col-2">
                                    <button className='btn btnclr text-white'>Next </button>
                                </div>
                            </div>
                        </div>
                </form>
                    </div>

                

            </div>
        </div>
    </div>
  )
}
