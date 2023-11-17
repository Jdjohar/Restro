import React, { useState, useEffect, useRef } from 'react';
import Retaiernavbar from './Retaiernavbar';
import Retailernav from './Retailernav';
import { useLocation,useNavigate } from 'react-router-dom';
// import Nav from './Nav';
// import { Helmet } from 'react-helmet';
import { PDFViewer,pdf, PDFDownloadLink, Document, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

import FontPicker from "font-picker-react";
import { ColorRing } from  'react-loader-spinner'
// import FontPicker from 'font-picker';
// import html2canvas from 'html2canvas';

import * as htmlToImage from 'html-to-image';

export default function Storedetail() {
    const location = useLocation();
    const userid = location.state?.userid;
    const storeId = location.state?.storeId;
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [ loading, setloading ] = useState(true);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [storenameColor, setStorenameColor] = useState('black');
    const [textColor, setTextColor] = useState('black');
    const [headingTextColor, setHeadingTextColor] = useState('black');
    const [font, setFont] = useState('Lato');
    const [fontlink, setFontlink] = useState('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf');
    const [pdfExportVisible, setPdfExportVisible] = useState(false);
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
            const response = await fetch(`https://restroproject.onrender.com/api/getstores/${storeId}`);
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
            const response = await fetch(`https://restroproject.onrender.com/api/products/${storeId}`);
            const json = await response.json();
            
            if (Array.isArray(json)) {
                setProducts(json);
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

       // Function to save user preferences to the backend
  const saveStorePreferencesToBackend = async () => {
    try {
        
        const userid =  localStorage.getItem("userid");
      const storePreference = {
        backgroundColor,
        textColor,
        headingTextColor,
        storenameColor,
        font,
        fontlink
        // Add other preferences here
      };

      const response = await fetch('https://restroproject.onrender.com/api/saveStorePreferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userid,storeId, storePreference }),
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
    retrieveUserPreferences(storeId);

    // setloading(false);

}, [storeId]);

  const retrieveUserPreferences = async (storeId) => {
    try {
      // const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restroproject.onrender.com/api/getStorePreferences/${storeId}`);
      if (response.ok) {
        const storePreference = await response.json();
        if (storePreference && storePreference.length > 0) {
          setBackgroundColor(storePreference[storePreference.length - 1].backgroundColor ?? 'white');
          setTextColor(storePreference[storePreference.length - 1].textColor ?? 'black');
          setFont(storePreference[storePreference.length - 1].font ?? 'Lato');
          setHeadingTextColor(storePreference[storePreference.length - 1].headingTextColor ?? 'black');
          setStorenameColor(storePreference[storePreference.length - 1].storenameColor ?? 'black');
          setFontlink(storePreference[storePreference.length - 1].fontlink ?? '');
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
                            <div className='exportable-div ' ref={divToExportRef}>
                                <div className='box p-4'  style={{ backgroundColor, color: textColor,fontFamily: font }}>
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
                                                ))}
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
