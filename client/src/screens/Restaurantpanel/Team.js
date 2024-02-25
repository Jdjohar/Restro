import React, { useState, useEffect }  from 'react'
import Usernavbar from './Usernavbar';
import { useNavigate } from 'react-router-dom';
// import Usernav from './Usernav';
// import { Nav } from 'react-bootstrap';
import { ColorRing } from  'react-loader-spinner';
import Alertauthtoken from '../../components/Alertauthtoken';
import Nav from './Nav';

export default function Team() {

    const [teammembers, setTeammembers] = useState([]);
    const [selectedteammembers, setselectedteammembers] = useState(null);
    const [ loading, setloading ] = useState(true);
    const [alertMessage, setAlertMessage] = useState('');
    
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/Restaurantpanel/Addteam');
    }

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }
          fetchdata();
      }, []);

    // const handleTimeViewClick = (team) => {
    //     let teamid = team._id;
    //     navigate('/userpanel/Timeview', { state: { teamid } });
    // };


    const fetchdata = async () => {
        try {
            const userid =  localStorage.getItem("userid");
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://real-estate-1kn6.onrender.com/api/teammemberdata/${userid}`, {
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
                if (Array.isArray(json)) {
                    setTeammembers(json);
                }
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            setloading(false);
        }
    }

    const handleEditClick = (team) => {
        setselectedteammembers(team);
        let teamid = team._id;
        navigate('/Restaurantpanel/Editteam', { state: { teamid } });
    };

    const handleDeleteClick = async (teamid) => {
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`https://real-estate-1kn6.onrender.com/api/delteammember/${teamid}`, {
                method: 'GET',
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
                    fetchdata(); // Refresh the teams list
                } else {
                    console.error('Error deleting teammember:', json.message);
                }
            }
            
        } catch (error) {
            console.error('Error deleting teammember:', error);
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
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <div  >
                    <Usernavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div>
                    <div className='mx-5 mt-5'>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>Team</p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Team</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btn-danger text-white fw-bold' onClick={handleAddClick}>+ Create</button>
                            </div>
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col"> Name </th>
                                        <th scope="col">Email </th>
                                        <th scope="col">Phone Number  </th>
                                        {/* <th scope="col">View </th> */}
                                        <th scope="col">Edit/Delete </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {teammembers.map((team, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{team.name}</td>
                                                <td>{team.email}</td>
                                                <td>{team.number}</td> 
                                                {/* <td className='text-center'>
                                                    <a role="button" className='text-black text-center' onClick={ () => handleTimeViewClick(team)}>
                                                        <i class="fa-solid fa-eye"></i>
                                                    </a>
                                                </td> */}
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(team)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </a>
                                                        <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(team._id)}>
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
}
    </div>
  )
}
