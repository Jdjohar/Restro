import React, { useState, useEffect, useRef } from 'react';
import Usernavbar from './Usernavbar';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import { Helmet } from 'react-helmet';
import { PDFViewer,pdf, PDFDownloadLink, Document, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

import FontPicker from "font-picker-react";
import { ColorRing } from  'react-loader-spinner'
// import FontPicker from 'font-picker';
// import html2canvas from 'html2canvas';

import * as htmlToImage from 'html-to-image';

export default function ItemDetail() {
    const location = useLocation();
    const subcategoryId = location.state?.subcategoryId;
    const restaurantId = location.state?.restaurantId;
    const [items, setItems] = useState([]);
    const [Categories, setCategories] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState('white');
    const [textColor, setTextColor] = useState('black');
    const [headingTextColor, setHeadingTextColor] = useState('black');
    const [categoryColor, setCategoryColor] = useState('black');
    const [font, setFont] = useState('Lato, sans-serif');
    const [fontlink, setFontlink] = useState('');
    const [pdfExportVisible, setPdfExportVisible] = useState(false);
    const [ loading, setloading ] = useState(true);
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
    // const [priceColor, setPriceColor] = useState('black');

    // Function to generate a PDF document from the content
  // const generatePDF = () => {
  //   setPdfExportVisible(true);
  // };
  const generatePDF = async () => {
    try {
      setPdfExportVisible(true);
  
      const timestamp = Date.now();
  
      // Remove any existing PDF content
      const existingPdfElement = document.getElementById('pdf-container');
      if (existingPdfElement) {
        existingPdfElement.remove();
      }
  
      const pdfContainer = document.createElement('div');
      pdfContainer.id = 'pdf-container';
      document.body.appendChild(pdfContainer);
  
      let pdfContent = (
        <Document>
          <Page size="A4" style={{ backgroundColor: backgroundColor }}>
            <View style={{ ...styles.page, backgroundColor: backgroundColor }}>
              <Text style={{ ...styles.header, fontFamily: font, color: headingTextColor }}>
                Items Detail
              </Text>
              {Categories.map((categoryItem, indexd) => (
                <View key={indexd}>
                  <Text
                    style={{
                      fontFamily: font,
                      color: categoryColor,
                      marginBottom: 10,
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  >
                    {categoryItem}
                  </Text>
                  {items.map((subcategoryItem, index) => {
                    return subcategoryItem.items.filter(
                      (item) => item.CategoryName === categoryItem
                    ).length > 0 ? (
                      <View key={index}>
                        <Text
                          style={{
                            fontFamily: font,
                            color: headingTextColor,
                            marginBottom: 10,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                          }}
                        >
                          {subcategoryItem.subcategory}
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          {subcategoryItem.items.map((item, itemIndex) => {
                            return categoryItem == item.CategoryName ? (
                              <View key={itemIndex} style={{ width: '50%' }}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Text style={{ fontSize: 14, fontFamily: font, color: textColor }}>
                                    {item.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontFamily: font,
                                      fontSize: 14,
                                      color: textColor,
                                      marginRight: 30,
                                    }}
                                  >
                                    {item.price} $
                                  </Text>
                                </View>
  
                                <Text
                                  style={{
                                    fontFamily: font,
                                    fontSize: 14,
                                    marginBottom: 10,
                                    color: textColor,
                                  }}
                                >
                                  {item.description}
                                </Text>
                              </View>
                            ) : (
                              ''
                            );
                          })}
                        </View>
                      </View>
                    ) : null;
                  })}
                </View>
              ))}
            </View>
          </Page>
        </Document>
      );
  
      const blob = await pdf(pdfContent, {updateContainer: pdfContent}).toBlob();
      const fileName = `item-detail-${timestamp}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  

  // const PDFDocument = (
  //   <Document>
  //     <Page size="A4" style={{  backgroundColor: backgroundColor }}>
  //       <View style={{ ...styles.page, backgroundColor: backgroundColor,fontFamily:font }}>
  //         <Text style={{...styles.header, fontFamily:font, color: headingTextColor}}>Items Detailgh</Text>
  //           {Categories.map((categoryItem, indexd) => (
  //             <View key={indexd}>
  //               <Text style={{color: categoryColor,marginBottom: 10, textAlign: 'center', textTransform: 'uppercase' }}>
  //                 {categoryItem}
  //               </Text>
  //               {items.map((subcategoryItem, index) => {
  //             return subcategoryItem.items.filter(item => item.CategoryName === categoryItem).length > 0 ?
  //             <View key={index} >
  //             <Text style={{ fontFamily:font, color: headingTextColor ,marginBottom: 10, textAlign: 'center', textTransform: 'uppercase'}}>
  //                 {subcategoryItem.subcategory}
  //             </Text>
  //             <View style={{flexDirection: 'row', flexWrap: 'wrap',fontFamily:font }}>
  //               {subcategoryItem.items.map((item, itemIndex) => {
  //                 return categoryItem == item.CategoryName?
  //                 <View key={itemIndex} style={{ width: '50%',fontFamily:font }}>
  //                   <View style={{ flexDirection: 'row', justifyContent: 'space-between',fontFamily:font}}>
  //                     <Text style={{ fontFamily:font,fontSize: 14, fontWeight: 700, color: textColor}}>
  //                         {item.name}
  //                     </Text>
  //                     <Text style={{fontFamily:font,fontSize: 14, fontWeight: 700, color: textColor, marginRight:30}}>
  //                         {item.price} $
  //                     </Text>
  //                   </View>
                                        
  //                   <Text style={{fontFamily:font,fontSize: 14, marginBottom: 10, color: textColor }}>
  //                        {item.description}
  //                   </Text>
  //                 </View> : ""
  //               })}
  //             </View>
  //           </View> : null
  //           })}
  //             </View>
  //           ))}
  //       </View>
  //     </Page>
  //   </Document>
  // );
  

  // const PDFDocument = (
  //   <Document>
  //     <Page size="A4" style={{ backgroundColor: backgroundColor }}>
  //       <View style={{ ...styles.page, backgroundColor: backgroundColor }}>
  //         <Text style={{ ...styles.header, color: headingTextColor }}>Items Detail</Text>
  //         {Categories.map((categoryItem, indexd) => (
  //           <View key={indexd}>
  //             <Text style={{ color: categoryColor, textAlign: 'center', textTransform: 'uppercase' }}>
  //               {categoryItem}
  //             </Text>
  //             {items.map((subcategoryItem, index) => (
  //               <View key={index}>
  //                 <Text style={{ color: headingTextColor, textAlign: 'center', textTransform: 'uppercase' }}>
  //                   {subcategoryItem.subcategory}
  //                 </Text>
  //                 <View style={{ flexDirection: 'row' }}>
  //                   <View style={{ flex: 1 }}>
  //                     {subcategoryItem.items.slice(0, subcategoryItem.items.length / 2).map((item, itemIndex) => (
  //                       <View key={itemIndex}>
  //                         <Text style={{ fontSize: 14, color: textColor }}>
  //                           {item.name}
  //                         </Text>
  //                         <Text style={{ fontSize: 14, color: textColor }}>
  //                           Price: {item.price} $
  //                         </Text>
  //                         <Text style={{ fontSize: 14, marginBottom: 10, color: textColor }}>
  //                           Description: {item.description}
  //                         </Text>
  //                       </View>
  //                     ))}
  //                   </View>
  //                   <View style={{ flex: 1 }}>
  //                     {subcategoryItem.items.slice(subcategoryItem.items.length / 2).map((item, itemIndex) => (
  //                       <View key={itemIndex}>
  //                         <Text style={{ fontSize: 14, color: textColor }}>
  //                           {item.name}
  //                         </Text>
  //                         <Text style={{ fontSize: 14, color: textColor }}>
  //                           Price: {item.price} $
  //                         </Text>
  //                         <Text style={{ fontSize: 14, marginBottom: 10, color: textColor }}>
  //                           Description: {item.description}
  //                         </Text>
  //                       </View>
  //                     ))}
  //                   </View>
  //                 </View>
  //               </View>
  //             ))}
  //           </View>
  //         ))}
  //       </View>
  //     </Page>
  //   </Document>
  // );

  const handlePDFExportComplete = () => {
    setPdfExportVisible(false);
  };

    const divToExportRef = useRef(null);

    // Function to save user preferences to the backend
  const saveUserPreferencesToBackend = async () => {
    try {
        
        const userid =  localStorage.getItem("userid");
      const userPreference = {
        backgroundColor,
        textColor,
        headingTextColor,
        categoryColor,
        font,
        fontlink
        // Add other preferences here
      };

      const response = await fetch('https://restroproject.onrender.com/api/saveColorPreferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userid,restaurantId, userPreference }),
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

  // Call the saveUserPreferencesToBackend function when user ID or restaurant ID is matched
  useEffect(() => {

    // Font.register({
    //   family: "Josefin Sans",
    //   fonts: [
    //     { src: 'http://fonts.gstatic.com/s/josefinsans/v32/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XXMFrLgTsQV0.ttf', fontWeight: 600 },
    //     { src: 'http://fonts.gstatic.com/s/josefinsans/v32/Qw3PZQNVED7rKGKxtqIqX5E-AVSJrOCfjY46_N_XXMFrLgTsQV0.ttf', fontWeight: 700 },
    //   ],
    // });

      retrieveUserPreferences();
    if (subcategoryId != null) {
      fetchSubcategoryItems();
    } else {
      fetchRestaurantItems();
      // If user ID or restaurant ID is matched, save user preferences
      // saveUserPreferencesToBackend();
      // Retrieve user preferences when component mounts
    }
  }, [subcategoryId]);

  const retrieveUserPreferences = async () => {
    try {
      const userid = localStorage.getItem('userid');
      const response = await fetch(`https://restroproject.onrender.com/api/getUserPreferences/${userid}`);
      if (response.ok) {
        const userPreference = await response.json();
        if (userPreference) {
          setBackgroundColor(userPreference[userPreference.length-1].backgroundColor);
          setTextColor(userPreference[userPreference.length-1].textColor);
          setFont(userPreference[userPreference.length-1].font);
          setHeadingTextColor(userPreference[userPreference.length-1].headingTextColor);
          setCategoryColor(userPreference[userPreference.length-1].categoryColor);
          // console.log(userPreference[userPreference.length-1].categoryColor, "A")
            setFontlink(userPreference[userPreference.length-1].fontlink);
          Font.register({
            family: userPreference[userPreference.length-1].font,
            fonts: [
              { src: userPreference[userPreference.length-1].fontlink, fontWeight: 600 },
              { src: userPreference[userPreference.length-1].fontlink, fontWeight: 700 },
            ],
          });
          // document.querySelectorAll('h2, h3, h4, h5, h6').forEach((element) => {
          //   element.style.color = userPreference[userPreference.length-1].headingTextColor;
          // });
          
          // document.querySelectorAll('h1').forEach((element) => {
          //   element.style.color = userPreference[userPreference.length-1].categoryColor;
          // });
          setloading(false);
        }
      } else {
        console.error('Failed to retrieve user preferences from the backend.');
      }
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
    }
  };

//   const handleExportClick = () => {
//     if (divToExportRef.current) {
//       html2canvas(divToExportRef.current)
//         .then((canvas) => {
//           const imgData = canvas.toDataURL('image/jpeg');
//           const link = document.createElement('a');
//           link.href = imgData;
//           link.download = 'exported-image.jpg';
//           link.click();
//         })
//         .catch((error) => {
//           console.error('Error exporting div to image:', error);
//         });
//     }
// }


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
console.log(selectedFont.files.regular);
  Font.register({
    family: selectedFont.family,
    fonts: [
      { src: selectedFont.files.regular, fontWeight: 600 },
      { src: selectedFont.files.regular, fontWeight: 700 },
    ],
  });

    setFont(selectedFont.family);
    setFontlink(selectedFont.files.regular);
    console.log(selectedFont)
  };




  // Function to handle background color change
  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color);
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

  // Function to handle category heading text color change
  const handleCategoryColor = (color) => {
    
    setCategoryColor(color);
    document.querySelectorAll('h1').forEach((element) => {
      element.style.color = color;
    });
  };
  

// Function to handle price text color change
// const handlePriceColor = (color) => {
//     handleTextElementColor('priceColor', color);
//   };
  
//   const handleTextElementColor = (elementId, color) => {
//     const element = document.getElementById(elementId);
//     if (element) {
//       element.style.color = color;
//       setPriceColor(color);
//     }
//   };


    
    function generateStructuredData(items) {
        return {
          '@context': 'http://schema.org',
          '@type': 'ItemList',
          itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: item.name, // Replace with your item name property
              description: item.description, // Replace with your item description property
              offers: {
                '@type': 'Offer',
                price: item.price, // Replace with your item price property
                availability: item.isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              },
            },
          })),
        };
      }
      
    const fetchSubcategoryItems = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getitems/${subcategoryId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                
                setCategories(Array.from(new Set(json.map(item => item.CategoryName))));

                const uniqueSubcategories = Array.from(new Set(json.map(item => item.Subcategory)));
                setItems(uniqueSubcategories.map(subcategory => ({
                    subcategory,
                    items: json.filter(item => item.Subcategory == subcategory && item.isAvailable.toString() == "true")
                })));
            }
            setloading(false);
        } catch (error) {
            console.error('Error fetching subcategory items:', error);
        }
    };

    const fetchRestaurantItems = async () => {
        try {
            const response = await fetch(`https://restroproject.onrender.com/api/getrestaurantitems/${restaurantId}`);
            const json = await response.json();

            if (Array.isArray(json)) {
                
                setCategories(Array.from(new Set(json.map(item => item.CategoryName))));
                
                const uniqueSubcategories = Array.from(new Set(json.map(item => item.Subcategory)));
                setItems(uniqueSubcategories.map(subcategory => ({
                    subcategory,
                    items: json.filter(item => item.Subcategory == subcategory && item.isAvailable.toString() == "true")
                })));
            }
            console.log(Categories);
            console.log(items);
        } catch (error) {
            console.error('Error fetching restaurant items:', error);
        }
    };


    return (
        <div className='bg'>
            {/* <script type="application/ld+json">
                {JSON.stringify(schememap)}
                </script> */}
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
                <div className="row">
                    <div className='col-lg-2 col-md-3 b-shadow bg-white d-lg-block d-md-block d-none'>
                        <div  >
                        <Usernavbar/>
                        </div>
                    </div>

                    <div className="col-lg-10 col-md-9 col-12 mx-auto"   >
                        
                        <div className='d-lg-none d-md-none d-block mt-2'>
                            <Nav/>
                        </div>
                        <div className='my-5 mx-4 pb-5'>
                          <div className='exportable-div ' ref={divToExportRef}>
                        
                            <div className="box p-4 " style={{ backgroundColor, color: textColor, fontFamily: font }}>
                                
                                <div className='row'>
                                    <div className="">
                                        <h5 className='fw-bold' style={{ fontFamily: font, color: headingTextColor}}>Items Detail</h5>
                                    </div>
                                </div>
                                <hr />
                                    {Categories.map((categoryItem, indexd) => {
                                return <div className="row" key={indexd}>
                                        
                                    <div className="col-12 text-center me-auto">
                                    <h1 style={{ fontFamily: font,color:categoryColor}} className='text-uppercase'>{categoryItem}</h1>
                                    </div>
                                    {items.map((subcategoryItem, index) => {
                                        return subcategoryItem.items.filter(item => item.CategoryName == categoryItem).length > 0 ? 
                                        <div className="col-12" key={index}>
                                            <div className="row px-2">
                                                <div>
                                                    <h3 className='text-center text-uppercase' style={{ fontFamily: font, color: headingTextColor}}>{subcategoryItem.subcategory}</h3>
                                                </div>
                                                {subcategoryItem.items.map((item, itemIndex, ) => {
                                                return categoryItem == item.CategoryName? 
                                                    <div className="col-12 col-md-6 col-lg-6 px-2" key={itemIndex}>
                                                        <div className="row  fs-5">
                                                            <div className="col-8">
                                                                <div>
                                                                    <p className='mb-0 fw-bold '>{item.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="col-4">
                                                                <div>
                                                                    <p className='mb-0 fw-bold'>{item.price} $ </p>
                                                                    {/* &#8377; &#x20B9;  */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div>
                                                            <p className='mt-0'><span className='fs-6 fw-bold'></span>{item.description}</p>
                                                        </div>
                                                        
                                                        
                                                        
                                                        {/* <div>
                                                            <p><span className='fs-6 fw-bold'>SpiceLevel :</span>{item.spiceLevel}</p>
                                                        </div> */}
                                                        {/* <div className='pb-3'>
                                                            <p><span className='fs-6 fw-bold mb-3'>IsAvailable :</span>{item.isAvailable.toString()}</p>                                            
                                                        </div> */}
                                                    </div> : ""
                                                })}
                                            </div>
                                        </div>:""
                                    })}
                                </div>
                                })}
                            </div>
                          </div>
                        </div>
                        
                        <button onClick={handleExportClick}>Export as JPG</button>
                        <div>
                          <button onClick={generatePDF}>Export as PDF</button>
                        </div>
                    {/* {pdfExportVisible && (
                      <div className="pdf-export-overlay">
                        <PDFViewer width="100%" height="100%">
                          {PDFDocument}
                        </PDFViewer>
                        <PDFDownloadLink
                          document={PDFDocument}
                          fileName="item-detail.pdf"
                          style={styles.pdfDownloadLink}
                          onComplete={handlePDFExportComplete}
                        >
                          {({ blob, url, loading, error }) =>
                            loading ? 'Loading PDF...' : 'Download PDF'
                          }
                        </PDFDownloadLink>
                      </div>
                      
      )} */}
  

                        <button onClick={saveUserPreferencesToBackend}>Save Preference</button>
                        <FontPicker apiKey="AIzaSyCbLcicaDu2q0GZPRYx21V6e1Vc9Os0exc" // Replace with your Google Fonts API Key
          activeFontFamily={font}
          onChange={handleChangeFont}
        />
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
                        <div>
                            <label htmlFor="categoryColor">Categoty Text Color:</label>
                            <input
                            type="color"
                            id="categoryColor"
                            value={categoryColor}
                            onChange={(e) => {        
                                // handleHeadingTextColor(e.target.value);
                                handleCategoryColor(e.target.value);
                            }}
                            />
                        </div>
                        

                        {/* <div>
                            <label htmlFor="priceColor">Price Text Color:</label>
                            <input
                                type="color"
                                id="priceColor"
                                value={priceColor}
                                onChange={(e) => handlePriceColor(e.target.value)}
                            />
                        </div> */}
                        
                    </div>
                </div>
            </div>
}

            <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(generateStructuredData(items))}
        </script>
      </Helmet>
        </div>
    );
}



