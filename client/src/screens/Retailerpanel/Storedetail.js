import React, { useState, useEffect, useRef } from 'react';
import Retaiernavbar from './Retaiernavbar';
import Retailernav from './Retailernav';
import bgImage1 from './img/bg-1.jpg';
// import bgImage2 from './Retailerpanel/img/bg-2.jpg';
// import bgImage3 from './Retailerpanel/img/bg-3.jpg';
import { useLocation,useNavigate } from 'react-router-dom';
import { PDFViewer,pdf, PDFDownloadLink,Image, Document, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

import FontPicker from "font-picker-react";
import { ColorRing } from  'react-loader-spinner'

import * as htmlToImage from 'html-to-image';

export default function Storedetail() {
    const location = useLocation();
  const [images, setImages] = useState([]);
    const userid = location.state?.userid;
    const storeId = location.state?.storeId;
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [ loading, setloading ] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState('');
    const [storenameColor, setStorenameColor] = useState('black');
    const [textColor, setTextColor] = useState('black');
    const [headingTextColor, setHeadingTextColor] = useState('black');
    const [font, setFont] = useState('Lato');
    const [fontlink, setFontlink] = useState('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf');
    const [pdfExportVisible, setPdfExportVisible] = useState(false);
    const [offers, setOffers] = useState([]);
    const [weeklyoffers, setweeklyOffers] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    
    const navigate = useNavigate();
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        // padding: 20,
      },
      pageBackground: {
        position: 'absolute',
        // minWidth: '100%',
        // minHeight: '100%',
        // display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1,
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
      shadowedView: {
        // boxshadow: '0 0 4px #999',
        border: '1px solid #999',
        borderRadius: 20,
        padding: 10,
      },
    });
    // const fetchImages = async () => {
    //   try {
    //     const response = await fetch('http://localhost:3001/api/images'); // Update with your backend URL
    //     if (response.ok) {
    //       const data = await response.json();
    //       setImages(data); // Set the fetched images in state
    //     } else {
    //       throw new Error('Failed to fetch images');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching images:', error);
    //   }
    // };

    const fetchImages = async () => {
      try {
        const signuptype = localStorage.getItem('signuptype');
        const response = await fetch('http://localhost:3001/api/images');
        const data = await response.json();
    
        if (response.ok) {
          // Filter images based on category and sign-up type
          const filteredImages = data.filter((image) => {
            return image.category === 'Retailer' && signuptype === 'Retailer';
            // Adjust the condition as needed for your specific matching logic
          });
    
          setImages(filteredImages); // Update state with filtered images
        } else {
          console.error('Failed to fetch images:', data.message || response.statusText);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    
    const generatePDF = async () => {
        try {
            const pdfContent = (
                <Document>
                    <Page size="A4" orientation='portrait' style={{ backgroundColor: backgroundColor }}>
                     <View >
                           <Image src={backgroundImage} style={styles.pageBackground} />
                           <View style={{ padding: 20}}>
                        <Text style={{ fontSize: 18, marginBottom: 20, fontFamily: font, color: headingTextColor }}>
                                Store Detail
                            </Text>
                            {/* Include store name */}
                            <Text style={{ 
                                marginBottom: 10,
                                textAlign: 'center',
                                textTransform: 'uppercase', 
                                fontFamily: font, 
                                color: storenameColor 
                                }}>
                                {store?.name}
                            </Text>
                            {/* Include product details */}
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {products.map((product, index) => (
                                <View key={index} style={{ width: '50%', marginbottom:'20px', paddingLeft:'10px', paddingRight:'10px' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop:'20px'}}>
                                        <Text style={{ fontSize: 16, fontFamily: font, color: textColor }}>
                                            {product.name}
                                        </Text>
                                        <Text style={{ fontSize: 16, fontFamily: font, color: textColor }}>
                                            {product.price}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                                        <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                            {product.description}
                                        </Text>
                                        <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                            {product.quantity}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                        {product.size}
                                    </Text>
                                    <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                        {product.colour}
                                    </Text>
                                </View>
                            ))}
                            </View>

                            {offers.length !== 0 && (
                              <View style={{ paddingTop: 40 }}>
                                <Text style={{ fontFamily: font,color:storenameColor, fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
                                  Offers
                                </Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                  {offers.map((offer) => (
                                    <View key={offer._id} style={{ width: '33.3%', margin:10 }}>
                                      {/* Offer details */}
                                      <View style={[styles.shadowedView, { fontFamily: font, color: textColor }]}>
                                        <Text style={{ fontFamily: font, fontSize: 18, fontWeight: 'bold' }}>
                                          {offer.offerName}
                                        </Text>
                                        <Text style={{ fontFamily: font, fontSize: 14 }}>
                                          {offer.customtxt}
                                        </Text>
                                        {offer.searchResults.length !== 0 && (
                                          <View style={{ marginTop: 10 }}>
                                            <Text style={{ fontFamily: font, fontSize: 14, fontWeight: 'bold' }}>
                                              Items
                                            </Text>
                                            <ul>
                                              {offer.searchResults.map((result, index) => (
                                                <li key={result.value} style={{marginLeft:3}}>
                                                  <Text style={{ fontFamily: font, fontSize: 12, color: textColor,marginRight:2 }}>{result.label}</Text>
                                                  {index < offer.searchResults.length - 1 && ', '}
                                                </li>
                                              ))}
                                            </ul>
                                          </View>
                                        )}
                                      </View>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}

                            {weeklyoffers.length !== 0 && (
                                        <View style={{ paddingTop: 40 }}>
                                          <Text style={{ fontFamily: font, color: storenameColor, fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
                                            Weekly Offers
                                          </Text>
                                          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                            {weeklyoffers.map((offer) => (
                                              <View key={offer._id} style={{ width: '33.3%', margin: 10 }}>
                                                <View style={[styles.shadowedView, { fontFamily: font, color: textColor }]}>
                                                  <Text style={{ fontFamily: font, fontSize: 18, fontWeight: 'bold', color: textColor }}>
                                                    {offer.offerName}
                                                  </Text>
                                                  <View style={{ marginBottom: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                      <i class="fa-solid fa-calendar-days mt-1 me-2 "></i>
                                                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                                        {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                                                      </Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                      <i class="fa-solid fa-clock mt-1 me-2 "></i>
                                                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                                        {convertTo12HourFormat(offer.startTime)} - {convertTo12HourFormat(offer.endTime)}
                                                      </Text>
                                                    </View>
                                                  </View>
                                                  <View style={{ marginBottom: 10 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor }}>
                                                      Days
                                                    </Text>
                                                    <ul>
                                                      {offer.selectedDays.map((result, index) => (
                                                        <li key={index} className='badge' style={{ fontFamily: font, color: textColor }}>
                                                          {result}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </View>
                                                  <View>
                                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor }}>
                                                      Items
                                                    </Text>
                                                    <ul>
                                                      {offer.searchResults.map((result, index) => (
                                                        <li key={result.value} className='badge' style={{ fontFamily: font, color: textColor }}>
                                                          {result.label}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
                                                      RS. {offer.price} /-
                                                    </Text>
                                                  </View>
                                                </View>
                                              </View>
                                            ))}
                                          </View>
                                        </View>
                                      )}
                            </View>
                        </View>
                    </Page>
                </Document>
            );

            // Convert to blob
            const blob = await pdf(pdfContent).toBlob();
            const fileName = `store-detail.pdf`;

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
    // }, [storeId]);

    const fetchStoreData = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/getstores/${storeId}`);
            const json = await response.json();

            if (json.Success) {
                setStore(json.store);
            } else {
                console.error('Error fetching store data:', json.message);
            }

            // Set loading to false after fetching data
            // setloading(false);
        } catch (error) {
            console.error('Error fetching store data:', error);
            // Set loading to false in case of an error
            // setloading(false);
        }
    };

    const fetchdata = async () => {
        try {
            // const storeId =  localStorage.getItem("storeId");
            const response = await fetch(`http://localhost:3001/api/products/${storeId}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setProducts(json);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

  

  const handleStorenameColor = (color) => {
    
    setStorenameColor(color);
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

        // Function to handle background color change
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);

    // Apply selected color as background to the exportable div
    if (divToExportRef.current) {
      divToExportRef.current.style.backgroundColor = color;
      divToExportRef.current.style.backgroundImage = 'none'; 
    }
  };

      // Function to handle setting background image
    const handleSetBackgroundImage = (imageUrl) => {
      setBackgroundImage(imageUrl);
      // Apply selected image as background to the exportable div
    if (divToExportRef.current) {
      divToExportRef.current.style.backgroundImage = `url(${imageUrl})`;
      divToExportRef.current.style.backgroundSize = 'cover'; 
      divToExportRef.current.style.backgroundColor = 'transparent';
      divToExportRef.current.style.borderRadius = '10px';
    }
  };

       // Function to save user preferences to the backend
  const saveStorePreferencesToBackend = async () => {
    try {
        
        const userid =  localStorage.getItem("merchantid");
      const storePreference = {
        backgroundColor,
        textColor,
        headingTextColor,
        storenameColor,
        font,
        fontlink,
        backgroundImage
        // Add other preferences here
      };

       // Check if backgroundImage is set and not an empty string
    if (backgroundImage && backgroundImage.trim() !== '') {
      // Include the backgroundImage in the storePreference object
      storePreference.backgroundImage = backgroundImage;
    } else {
      // If backgroundImage is not set or empty, set it to null or an empty string as needed
      storePreference.backgroundImage = null; // or storePreference.backgroundImage = ''; 
    }

      const response = await fetch('http://localhost:3001/api/saveStorePreferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userid,storeId, storePreference }),
});

      if (response.ok) {
        console.log('User preferences saved to the backend.');
        alert('User preferences saved');
        // Save backgroundImage URL to the database
      const data = await response.json();
      if (data.success) {
        console.log("Background image URL saved:", backgroundImage);
      } else {
        console.error("Failed to save background image URL:", data.message);
      }
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
  
    if (!authToken || signUpType !== 'Retailer') {
      navigate('/login');
    }

    Font.register({
      family: "Lato",
      fonts: [
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 600 },
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 700 },
      ],
    });

    fetchStoreData();
    fetchdata();
    fetchOffers();
    fetchweeklyOffers();
    fetchImages();
    retrieveUserPreferences(storeId);

    // setloading(false);

}, [storeId]);

  const retrieveUserPreferences = async (storeId) => {
    try {
      // const userid = localStorage.getItem('userid');
      const response = await fetch(`http://localhost:3001/api/getStorePreferences/${storeId}`);
      if (response.ok) {
        const storePreference = await response.json();
        if (storePreference && storePreference.length > 0) {
          setBackgroundColor(storePreference[storePreference.length - 1].backgroundColor ?? 'white');
          setTextColor(storePreference[storePreference.length - 1].textColor ?? 'black');
          setFont(storePreference[storePreference.length - 1].font ?? 'Lato');
          setHeadingTextColor(storePreference[storePreference.length - 1].headingTextColor ?? 'black');
          setStorenameColor(storePreference[storePreference.length - 1].storenameColor ?? 'black');
          setFontlink(storePreference[storePreference.length - 1].fontlink ?? '');
          setBackgroundImage(storePreference[storePreference.length - 1].backgroundImage ?? '');

           // Apply the fetched background image to the exportable div if it exists
          if (divToExportRef.current && storePreference[storePreference.length - 1].backgroundImage) {
            divToExportRef.current.style.backgroundImage = `url(${storePreference[storePreference.length - 1].backgroundImage})`;
            divToExportRef.current.style.backgroundSize = 'cover';
            divToExportRef.current.style.backgroundColor = 'transparent';
            divToExportRef.current.style.borderRadius = '10px';
          }
        }
        Font.register({
          family: storePreference[storePreference.length - 1].font ?? 'Lato',
          fonts: [
            { src: storePreference[storePreference.length - 1].fontlink ?? fontlink, fontWeight: 600 },
            { src: storePreference[storePreference.length - 1].fontlink ?? fontlink, fontWeight: 700 },
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
      const response = await fetch(`http://localhost:3001/api/offerbystoreid?storeId=${storeId}`);
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
      const response = await fetch(`http://localhost:3001/api/weeklyofferbystore?storeId=${storeId}`);
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
                        <Retaiernavbar />
                    </div>
                    <div className='col-lg-10 col-md-9 col-12 mx-auto'>
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Retailernav/>
                        </div>
                        <div className='my-5 mx-4 pb-5'>
                            <div className='exportable-div ' ref={divToExportRef} style={{ backgroundColor,backgroundImage, color: textColor,fontFamily: font }}>
                                <div className='box p-4'>
                                <div className='row'>
                                    <div className="">
                                        <h5 className='fw-bold' style={{color: headingTextColor, fontFamily: font}}>Store Detail</h5>
                                    </div>
                                </div>
                                <hr />
                                    <div className='row'>
                                        <div className='col-12 text-center me-auto'>
                                            <h1 className='text-uppercase' style={{color:storenameColor, fontFamily: font}}>{store?.name}</h1>
                                        </div>
                                        <div className='col-12'>
                                            <div className='row px-2'>
                                                {products.map((product, index) => (
                                                    <div key={index} className='col-6 mb-3'>
                                                        {/* Display product information */}
                                                        <div className='row p-2'>
                                                            <div className='col-8'>
                                                                <p className='mb-0 fw-bold fs-5'>{product.name}</p>
                                                                <p className='mb-0 fw-bold'>{product.description}</p>
                                                                <p className='mb-0 fw-bold'>{product.size}</p>
                                                                <p className='my-0'>
                                                                    <span className='fs-6 fw-bold'>{product.colour}</span>
                                                                </p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p className='mb-0 fw-bold fs-5'>{product.price}</p>
                                                                <p className='my-0'>
                                                                    <span className='fs-6 fw-bold'>{product.quantity}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}<hr/>

                                              <div className='row'>
                                                {offers.length == 0 ? <div></div> :
                                                    <div className="pt-4">
                                                        <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font,color:storenameColor}}>Offers</h5>
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
                                                                <span className='fs-5 fw-bold'>Items </span>}
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
                                                        <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font,color:storenameColor}}>Weekly Offers</h5>
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
                                                      <p className='fs-5 fw-normal mb-0'>Items</p>
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
                            <label htmlFor="storenameColor">Storename Text Color:</label>
                            <input
                            type="color"
                            id="storenameColor"
                            value={storenameColor}
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

                        <div className="image-selection row">
                          {images.map((image) => (
                            <div className='col-3' key={image._id}>
                              <img 
                                src={image.imageUrl} 
                                alt={image.imageName} 
                                onClick={() => handleSetBackgroundImage(image.imageUrl)}
                                style={{ width: '100%', height:'80%', paddingRight: "5px" }}
                              />
                              <p>Image Name: {image.imageName}</p>
                              <p>Category: {image.category}</p>
                            </div>
                          ))}
                        </div>

                        {/* <div className="image-selection">
                        {images.map((image, index) => (
                            <img
                            // width={100}
                                key={index}
                                src={image}
                                alt={`Image ${index + 1}`}
                                onClick={() => handleSetBackgroundImage(image)}
                                style={{ width: '25%', paddingRight: "10px" }}
                            />
                        ))}
                      </div> */}

                        <FontPicker apiKey="AIzaSyBe6AEuTCWpxst1ETNizb1lVdsl5hm6MYA" 
                          activeFontFamily={font}
                          onChange={handleChangeFont}
                        />

                        <button onClick={saveStorePreferencesToBackend}>Save Preference</button>

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
