import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Retaiernavbar from '../Retailerpanel/Retaiernavbar';
import Retailernav from '../Retailerpanel/Retailernav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner';

export default function EditRetailerteam() {
    const [ loading, setloading ] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    
    const teamid = location.state.teamid;

    const [team, setteam] = useState({
        name: '',
        email: '',
        number: '',
    });

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Retailer') {
          navigate('/login');
        }
        fetchteamData();
      }, []);

    const fetchteamData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3001/api/getteamdata/${teamid}`, {
                headers: {
                  'Authorization': authToken,
                }
              });

              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }
              else{
                const json = await response.json();
            
                if (json.Success) {
                    setteam(json.team);
                } else {
                    console.error('Error fetching teamdata:', json.message);
                }
                console.log(team);
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching teamdata:', error);
        }
    };

    const handleSaveClick = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const updatedteamdata = {
                ...team
            };
            const response = await fetch(`http://localhost:3001/api/updateteamdata/${teamid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken,
                },
                body: JSON.stringify(updatedteamdata)
            });

            if (response.status === 401) {
              const json = await response.json();
              setAlertMessage(json.message);
              setloading(false);
              window.scrollTo(0,0);
              return; // Stop further execution
            }
            else{
               const json = await response.json();

                if (json.Success) {
                    navigate('/Restaurantpanel/Team');
                    console.log(updatedteamdata);
                } else {
                    console.error('Error updating teamdata:', json.message);
                } 
            }

            
        } catch (error) {
            console.error('Error updating teamdata:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setteam({ ...team, [name]: value });
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
                <div className="row">
                    <div className='col-lg-2 col-md-3 vh-lg-100 vh-md-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                            <Retaiernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto">
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Retailernav/>
                        </div>
                        <div className='mx-5 mt-5'>
                            {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                        </div>
                        <form>
                            <div className="bg-white my-5 p-4 box mx-4">
                                <div className='row'>
                                    <p className='h5 fw-bold'>Edit Team</p>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb mb-0">
                                            <li className="breadcrumb-item">
                                                <a href="/userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <a href="/userpanel/teamlist" className='txtclr text-decoration-none'>team</a>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">Edit Team</li>
                                        </ol>
                                    </nav>
                                </div><hr />

                                <div className="row">
                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext1" className="form-label">
                                            Member Name
                                            </label>
                                            <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={team.name}
                                            onChange={handleInputChange}
                                            placeholder="Member Name"
                                            id="exampleInputtext1"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">
                                            Contact Email
                                            </label>
                                            <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={team.email}
                                            onChange={handleInputChange}
                                            placeholder="Contact Email"
                                            id="email"
                                            aria-describedby="emailHelp"
                                            required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="Number" className="form-label">
                                            Phone Number
                                            </label>
                                            <input
                                            type="number"
                                            name="number"
                                            value={team.number}
                                            className="form-control"
                                            onChange={handleInputChange}
                                            placeholder="Phone Number"
                                            id="phonenumber"
                                            required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="button" className='btn btnclr text-white me-2' onClick={handleSaveClick}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
}
        </div>
    );
}
