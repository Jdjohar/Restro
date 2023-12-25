import React, { useState, useEffect, useRef } from 'react';
import Servicenavbar from './Servicenavbar';
import Servicenav from './Servicenav';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import Nav from './Nav';
// import { Helmet } from 'react-helmet';
import { PDFViewer,pdf, PDFDownloadLink, Document, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

import FontPicker from "font-picker-react";
import { ColorRing } from  'react-loader-spinner'
// import FontPicker from 'font-picker';
// import html2canvas from 'html2canvas';

import * as htmlToImage from 'html-to-image';

export default function Businessdetail() {
    const location = useLocation();
    const userid = location.state?.userid;
    const businessId = location.state?.businessId;
    const [business, setBusiness] = useState(null);
    const [services, setServices] = useState([]);
    const [ loading, setloading ] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [businessnameColor, setBusinessnameColor] = useState('black');
    const [textColor, setTextColor] = useState('black');
    const [headingTextColor, setHeadingTextColor] = useState('black');
    const [font, setFont] = useState('Lato');
    const [fontlink, setFontlink] = useState('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf');
    const [pdfExportVisible, setPdfExportVisible] = useState(false);
    const [offers, setOffers] = useState([]);
    const [weeklyoffers, setweeklyOffers] = useState([]);
    const navigate = useNavigate();
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        padding: 20,
      },
      header: {
        fontSize: 18,
        marginBottom: 20,
      },
      pdfDownloadLink: {
        textDecoration: 'none',
        padding: 10,
        backgroundColor: 'blue',
        color: 'white',
        borderRadius: 5,
      },
    });


    const generatePDF = async () => {
        try {
            // Prepare PDF content using @react-pdf/renderer
            const pdfContent = (
                <Document>
                    <Page size="A4" style={{ backgroundColor: backgroundColor }}>
                        <View style={{ padding: 20 }}>
                            <Text style={{ fontSize: 18, marginBottom: 20, fontFamily: font, color: headingTextColor }}>
                                Business Detail
                            </Text>
                            {/* Include business name */}
                            <Text style={{ 
                                marginBottom: 10,
                                textAlign: 'center',
                                textTransform: 'uppercase', 
                                fontFamily: font, 
                                color: businessnameColor 
                                }}>
                                {business?.name}
                            </Text>
                            {/* Include product details */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {services.map((product, index) => (
                                <View key={index} style={{ width: '50%', marginbottom:'20px', paddingLeft:'10px', paddingRight:'10px' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop:'20px'}}>
                                        <Text style={{ fontSize: 16, fontFamily: font, color: textColor }}>
                                            {product.name}
                                        </Text>
                                        <Text style={{ fontSize: 16, fontFamily: font, color: textColor }}>
                                            {product.price}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                        {product.time}
                                    </Text>
                                </View>
                            ))}
                            </View>
                        </View>
                    </Page>
                </Document>
            );

            // Convert to blob
            const blob = await pdf(pdfContent).toBlob();
            const fileName = `business-detail.pdf`;

            // Create a download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const divToExportRef = useRef(null);

    // useEffect(() => {
    //     fetchStoreData();
    //     fetchdata();
    // }, [businessId]);

    const fetchBusinessData = async () => {
        try {
            const response = await fetch(`https://restro-wbno.vercel.app/api/getbusinessdata/${businessId}`);
            const json = await response.json();

            if (json.Success) {
                setBusiness(json.business);
            } else {
                console.error('Error fetching business data:', json.message);
            }

            // Set loading to false after fetching data
            // setloading(false);
        } catch (error) {
            console.error('Error fetching business data:', error);
            // Set loading to false in case of an error
            // setloading(false);
        }
    };

    const fetchdata = async () => {
        try {
            // const businessId =  localStorage.getItem("businessId");
            const response = await fetch(`https://restro-wbno.vercel.app/api/services/${businessId}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setServices(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Function to handle background color change
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
  };

  const handleStorenameColor = (color) => {
    
    setBusinessnameColor(color);
    document.querySelectorAll('h1').forEach((element) => {
      element.style.color = color;
    });
  };

  // Function to handle text color change
  const handleTextColorChange = (color) => {
    setTextColor(color);
  };

  // Function to handle heading text color change
  const handleHeadingTextColor = (color) => {
    setHeadingTextColor(color);
    document.querySelectorAll('h2, h3, h4, h5, h6').forEach((element) => {
      element.style.color = color;
    });
  };

  const handleExportClick = () => {
    if (divToExportRef.current) {
        htmlToImage.toJpeg(divToExportRef.current, { backgroundColor: "#fff" })
            .then(function (dataUrl) {
                // Create a link element to download the image
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = 'exported-image.jpg';
                link.click();
            })
            .catch(function (error) {
                console.error('Error exporting div to image:', error);
            });
    }
};

const handleChangeFont = (selectedFont) => {
    // console.log(selectedFont.files.regular);
    
        const ftlink = selectedFont.files.regular;
        const upftlink = ftlink.replace("http", "https");
        setFont(selectedFont.family);
        setFontlink(upftlink);
        console.log(selectedFont)
      Font.register({
        family: selectedFont.family,
        fonts: [
          { src: upftlink, fontWeight: 600 },
          { src: upftlink, fontWeight: 700 },
        ],
      });
      };

       // Function to save user preferences to the backend
  const saveBusinessPreferencesToBackend = async () => {
    try {
        
        const userid =  localStorage.getItem("userid");
      const businessPreference = {
        backgroundColor,
        textColor,
        headingTextColor,
        businessnameColor,
        font,
        fontlink
        // Add other preferences here
      };

      const response = await fetch('https://restro-wbno.vercel.app/api/saveBusinessPreference', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userid,businessId, businessPreference }),
});

      if (response.ok) {
        console.log('User preferences saved to the backend.');
        alert('User preferences saved');
      } else {
        console.error('Failed to save user preferences to the backend.');
        alert('Failed to save user preferences to the backend.');
      }
    } catch (error) {
      console.error('Error saving user preferences:', error);
      alert('Error saving user preferences:', error);
    }
  };

  useEffect(() => {
    
    const authToken = localStorage.getItem('authToken');
    const signUpType = localStorage.getItem('signuptype');
  
    if (!authToken || signUpType !== 'Service Provider') {
      navigate('/login');
    }

    Font.register({
      family: "Lato",
      fonts: [
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 600 },
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 700 },
      ],
    });

    fetchBusinessData();
    fetchdata();
    fetchOffers();
    fetchweeklyOffers();
    retrieveUserPreferences(businessId);

    // setloading(false);

}, [businessId]);

  const retrieveUserPreferences = async (businessId) => {
    try {
      // const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restro-wbno.vercel.app/api/getBusinessPreferences/${businessId}`);
      if (response.ok) {
        const businessPreference = await response.json();
        if (businessPreference && businessPreference.length > 0) {
          setBackgroundColor(businessPreference[businessPreference.length - 1].backgroundColor ?? 'white');
          setTextColor(businessPreference[businessPreference.length - 1].textColor ?? 'black');
          setFont(businessPreference[businessPreference.length - 1].font ?? 'Lato');
          setHeadingTextColor(businessPreference[businessPreference.length - 1].headingTextColor ?? 'black');
          setBusinessnameColor(businessPreference[businessPreference.length - 1].businessnameColor ?? 'black');
          setFontlink(businessPreference[businessPreference.length - 1].fontlink ?? '');
        }
        Font.register({
          family: businessPreference[businessPreference.length - 1].font ?? 'Lato',
          fonts: [
            { src: businessPreference[businessPreference.length - 1].fontlink ?? fontlink, fontWeight: 600 },
            { src: businessPreference[businessPreference.length - 1].fontlink ?? fontlink, fontWeight: 700 },
          ],
        });
        setloading(false);
      } else {
        Font.register({
          family: "Lato",
          fonts: [
            { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 600 },
            { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 700 },
          ],
        });
        setloading(false);
        console.error('Failed to retrieve user preferences from the backend.');
      }
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      setloading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restro-wbno.vercel.app/api/offerbybusinessid?businessId=${businessId}`);
      const data = await response.json();
  
      if (response.ok) {
        if (data.success && Array.isArray(data.offers)) {
          const availableoffers = data.offers.filter((offer) => offer.switchState === true);
          setOffers(availableoffers);
        } else {
          setOffers([]);
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

  const fetchweeklyOffers = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restro-wbno.vercel.app/api/weeklyofferbybusiness?businessId=${businessId}`);
      const data = await response.json();
  
      if (response.ok) {
        if (data.success && Array.isArray(data.weeklyoffers)) {
          const availableweeklyoffers = data.weeklyoffers.filter((weeklyoffer) => weeklyoffer.switchState === true);
          setweeklyOffers(availableweeklyoffers);
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
    } catch (error) {
      console.error('Error fetching weeklyoffers:', error);
      setweeklyOffers([]); // Set empty array in case of error
      setloading(false);
    }
  };

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
        </div>
        :
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <Servicenavbar />
                    </div>
                    <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Servicenav/>
                        </div>
                        <div className='my-5 mx-4 pb-5'>
                            <div className='exportable-div ' ref={divToExportRef}>
                                <div className='box p-4'  style={{ backgroundColor, color: textColor,fontFamily: font }}>
                                <div className='row'>
                                    <div className="">
                                        <h5 className='fw-bold' style={{color: headingTextColor, fontFamily: font}}>Business Detail</h5>
                                    </div>
                                </div>
                                <hr />
                                    <div className='row'>
                                        <div className='col-12 text-center me-auto'>
                                            <h1 className='text-uppercase' style={{color:businessnameColor, fontFamily: font}}>{business?.name}</h1>
                                        </div>
                                        <div className='col-12'>
                                            <div className='row px-2'>
                                                {services.map((product, index) => (
                                                    <div key={index} className='col-6 mb-3'>
                                                        {/* Display product information */}
                                                        <div className='row p-2'>
                                                            <div className='col-8'>
                                                                <p className='mb-0 fw-bold fs-5'>{product.name}</p>
                                                                <p className='mb-0 fw-bold'>{product.time}</p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p className='mb-0 fw-bold fs-5'>{product.price}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                              <div className='row'>   
                                                {offers.length == 0 ? <div></div> :
                                                    <div className="pt-4">
                                                        <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font}}>Offers</h5>
                                                    </div>
                                                  }

                                                    <div className="row offerlist">
                                                        {offers.map((offer) => (
                                                          <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                                            <div className="boxitem my-3 p-3">
                                                              <div className="row">
                                                                {/* <div className="col-3 f-flex justify-content-center">
                                                                  <div className="boxtxt">
                                                                    <p className='bx fw-bold text-white'>{offer.offerName[0]}</p>
                                                                  </div>
                                                                </div> */}
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
                                                                      <li key={result.value} style={{ fontFamily: font, color: textColor}} className=' badge autocursor me-2 my-2 fs-6'>{result.label}
                                                                        {index < offer.searchResults.length - 1}</li>
                                                                    ))}
                                                                </ul>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        ))}
                                                    </div>
                                              </div>

                                              <div className='row'>
                                                {weeklyoffers.length == 0 ? <div></div> :
                                                    <div className="pt-4">
                                                        <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font}}>Weekly Offers</h5>
                                                    </div>
                                                  }

                                                  {weeklyoffers.map((offer) => (
                                                    <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                                        <div className="boxitem my-3 py-5 px-4">
                                                    <p className='fw-bold h4 mb-3' style={{ fontFamily: font, color: textColor}}>{offer.offerName}</p>
                                                    <div className=" mb-3">
                                                      <div className="d-flex">
                                                        <i class="fa-solid fa-calendar-days mt-1 me-2"></i>
                                                        <p className='fs-6 fw-bold' style={{ fontFamily: font, color: textColor}}> {new Date(offer.startDate).toLocaleDateString()} -</p>
                                                        <p className='fs-6 fw-bold' style={{ fontFamily: font, color: textColor}}>{new Date(offer.endDate).toLocaleDateString()}</p>
                                                      </div>
                                                      <div className="d-flex">
                                                        <i class="fa-solid fa-clock mt-1 me-2 "></i>
                                                        <p className='fs-6 fw-bold' style={{ fontFamily: font, color: textColor}}>{convertTo12HourFormat(offer.startTime)} - </p>
                                                        <p className='fs-6 fw-bold' style={{ fontFamily: font, color: textColor}}> {convertTo12HourFormat(offer.endTime)}</p>
                                                      </div>
                                                    </div>
                                                    <div className='mb-3 padd-left'>
                                                      <p className='fs-5 fw-normal mb-0'>Days</p>
                                                        <ul>
                                                              {offer.selectedDays.map((result, index) => (
                                                                <li key={result.value} className=' badge me-2 my-2 fs-6' style={{ fontFamily: font, color: textColor}}>{result}
                                                                  {index < offer.selectedDays.length - 1}</li>
                                                              ))}
                                                        </ul>
                                                    </div>

                                                    <div className='padd-left'>
                                                      <p className='fs-5 fw-normal mb-0'>Services</p>
                                                        <ul className='itemlist'>
                                                            {offer.searchResults.map((result,index) => (
                                                            <li key={result.value} className=' badge me-0 my-2 fs-6' style={{ fontFamily: font, color: textColor}}>{result.label}
                                                            {index < offer.searchResults.length - 1}</li>
                                                            ))}
                                                        </ul>
                                                    
                                                      <p className='h4 fw-bold pt-3' style={{ fontFamily: font, color: textColor}}>RS. {offer.price} /-</p>
                                                    </div>
                                                    </div>

                                                    </div>
                                                  ))}
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div className="">
                        <div>
                            <label htmlFor="backgroundColor">Background Color:</label>
                            <input
                            type="color"
                            id="backgroundColor"
                            value={backgroundColor}
                            onChange={(e) => handleBackgroundColorChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="businessnameColor">Businessname Text Color:</label>
                            <input
                            type="color"
                            id="businessnameColor"
                            value={businessnameColor}
                            onChange={(e) => {        
                                // handleHeadingTextColor(e.target.value);
                                handleStorenameColor(e.target.value);
                            }}
                            />
                        </div>

                        <div>
                            <label htmlFor="textColor">Text Color:</label>
                            <input
                            type="color"
                            id="textColor"
                            value={textColor}
                            onChange={(e) => handleTextColorChange(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="headingtextColor">Heading Text Color:</label>
                            <input
                            type="color"
                            id="headingtextColor"
                            value={headingTextColor}
                            onChange={(e) => {        
                                // handleHeadingTextColor(e.target.value);
                                handleHeadingTextColor(e.target.value);
                            }}
                            />
                        </div>

                        <FontPicker apiKey="AIzaSyBe6AEuTCWpxst1ETNizb1lVdsl5hm6MYA" 
                          activeFontFamily={font}
                          onChange={handleChangeFont}
                        />

                        <button onClick={saveBusinessPreferencesToBackend}>Save Preference</button>

                        <button onClick={handleExportClick}>Export as JPG</button>
                        <div>
                          <button onClick={generatePDF}>Export as PDF</button>
                        </div>
                    </div>
                        
                    </div>
                </div>
            </div>
}
        </div>
    );
}
