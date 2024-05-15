import React, { useState, useEffect } from 'react';
import Servicenavbar from './Servicenavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import Servicenav from './Servicenav';
import Alertauthtoken from '../../components/Alertauthtoken';
import { ColorRing } from  'react-loader-spinner'

export default function Servicepage() {
    const [ loading, setloading ] = useState(true);
    const [services, setServices] = useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    
    const location = useLocation();
    const businessId = location.state?.businessId;
    const serviceId = location.state?.serviceId;
    const [selectedservices, setselectedservices] = useState(null);
    const [businessuniquename, setbusinessuniquename] = useState([]);
    const [qrCodeUrl, setQRCodeUrl] = useState('');
    const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Service Provider') {
          navigate('/login');
        }
        fetchdata();
        fetchbusinessdata();
      }, []);

      useEffect(() => {
          generateQRCode(businessuniquename);
      }, [businessuniquename]);
  
      useEffect(() => {
          if (qrCodeUrl && qrCodeGenerated) {
              // setLoading(false);
          }
      }, [qrCodeUrl, qrCodeGenerated]); 

      const downloadQRCode = async () => {
        try {
            const response = await fetch(qrCodeUrl);
            const blob = await response.blob();
    
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'QRCode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading QR code:', error);
        }
    };
    
    const generateQRCode = (uniqueName) => {
        const text = `https://restro-wbno.vercel.app/Businesspanel/Businessmenudetail/${uniqueName}`;
        const baseApiUrl = 'https://api.qrserver.com/v1/create-qr-code/';
        const params = new URLSearchParams({
            size: '150x150',
            data: text,
        });
        const url = `${baseApiUrl}?${params.toString()}`;
        setQRCodeUrl(url);
        setQrCodeGenerated(true);
    };
      
    const handleAddClick = () => {
        navigate('/Businesspanel/Addservice', { state: { businessId } });
    }

    const fetchdata = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/services/${businessId}`, {
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
                    setServices(json);
                }
                setloading(false);
              }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // const handleMenuViewClick = (service) => {
    //     let serviceId = service._id;
    //     navigate('/Restaurantpanel/Menu', { state: { serviceId } });
    // };
    const handleEditClick = (service) => {
        setselectedservices(service);
        let serviceId = service._id;
        // let businessId = service.businessId;
        navigate('/Businesspanel/Editservice', { state: { serviceId, businessId } });
    };

    const handleDeleteClick = async (serviceId) => {
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await fetch(`https://restroproject.onrender.com/api/delservice/${serviceId}`, {
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
                    fetchdata(); // Refresh the services list
                } else {
                    console.error('Error deleting service:', json.message);
                }  
            }
            
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    // const handleViewDetailClick = (service) => {
    //     // let serviceId = service._id;
    //     navigate('/Businesspanel/Businessdetail', { state: { businessId } });
    // };
    const handleServiceDetailClick = () => {
        navigate(`/Businesspanel/Businessmenudetail/${businessuniquename}`, { state: { businessId } });
    };

    const handleViewDetailClick = () => {
        const authtoken = localStorage.getItem("authToken");// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1MWFmNDRlY2ZiMTBlN2RiOWY5YWNkIn0sImlhdCI6MTcwODY4MzExN30.eTF2HpE8RCapdE5Xl2RSmkgmuI_Guo6qpvJX1XhnsgU";
        // localStorage.setItem('authtoken1', authtoken);
        const url = `https://restro-design.vercel.app/?authtoken=${authtoken}&businessid=${businessId}`;
        window.location.href = url;
    };

    const fetchbusinessdata = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getbusinessuniquename/${businessId}`);

              if (response.status === 401) {
                const json = await response.json();
                setAlertMessage(json.message);
                setloading(false);
                window.scrollTo(0,0);
                return; // Stop further execution
              }

              else{
                const json = await response.json();
                setbusinessuniquename(json);
                // if (Array.isArray(json)) {
                //     setRestaurants(json);
                // }
                setloading(false);

              }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    

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
                    <Servicenavbar/>
                    </div>
                </div>

                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Servicenav/>
                    </div>
                    <div className='mx-5 mt-5'>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
                    <button onClick={downloadQRCode}>Download QR Code</button>
                        {alertMessage && <Alertauthtoken message={alertMessage} onClose={() => setAlertMessage('')} />}
                    </div>
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row py-2'>
                            <div className="col-lg-4 col-md-6 col-sm-6 col-7 me-auto">
                                <p className='h5 fw-bold'>services </p>
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Businesspanel/Businessdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">services</li>
                                    </ol>
                                </nav>
                            </div>
                            <div className="col-lg-3 col-md-4 col-sm-4 col-5 text-right">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div>

                            {/* {  services.name != null ?  */}
                            <div className="col-lg-2 col-md-6 col-sm-6 col-8 text-right">
                                    {/* <button className='btn rounded-pill btnclr text-white fw-bold' onClick={ () => handleViewDetailClick(services)}>View details</button> */}
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleViewDetailClick}>Online Menu</button>
                                </div>
                            <div className="col-lg-2 col-md-6 col-sm-6 col-8 text-right">
                                    <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleServiceDetailClick}> Menu</button>
                                    {/* <button className='btn rounded-pill btnclr text-white fw-bold' onClick={ () => handleViewDetailClick(products)}>Online Menu</button> */}
                                </div>
                                {/* // :"" } */}
                        </div><hr />

                        <div className="row px-2 table-responsive">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">ID </th>
                                        <th scope="col">service Name </th>
                                        <th scope="col">Edit/Delete </th>
                                        <th scope="col">Created At </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {services.map((service, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{service.name}</td>
                                                <td>
                                                    <div className="d-flex">
                                                        <a role='button' className="btn btn-success btn-sm me-2 text-white" onClick={ () => handleEditClick(service)}>
                                                                    <i className="fa-solid fa-pen"></i>
                                                                </a>
                                                                <button type="button" className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteClick(service._id)}>
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                    </div>
                                                </td>
                                                <td>{service.createdAt}</td>
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
