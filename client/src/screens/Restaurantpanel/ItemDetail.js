import React, { useState, useEffect, useRef } from 'react';
import Usernavbar from './Usernavbar';
import { useLocation,useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { Helmet } from 'react-helmet';
import { PDFViewer,pdf, PDFDownloadLink, Document,Image, Page, Text, Font, View, StyleSheet } from '@react-pdf/renderer';

import FontPicker from "font-picker-react";
import { ColorRing } from  'react-loader-spinner'

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
    const [font, setFont] = useState('Lato');
    const [fontlink, setFontlink] = useState('https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf');
    const [pdfExportVisible, setPdfExportVisible] = useState(false);
    const [ loading, setloading ] = useState(true);
    const [offers, setOffers] = useState([]);
    const [weeklyoffers, setweeklyOffers] = useState([]);
    const [images, setImages] = useState([]);
    const [backgroundImage, setBackgroundImage] = useState('');
    const navigate = useNavigate();
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        // padding: 20,
      },
      pageBackground: {
        position: 'absolute',
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
    // Register the Font Awesome font with @react-pdf/renderer
Font.register({
  family: 'FontAwesome',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/webfonts/fa-solid-900.ttf',
});

// Custom Icon Component
const FontAwesomeIcon = ({ name, size, color }) => (
  <Text
    style={{
      fontFamily: 'FontAwesome',
      fontSize: size || 12,
      color: textColor
    }}
  >
    {String.fromCharCode(parseInt(`0x${name}`, 16))}
  </Text>
);
    // const [priceColor, setPriceColor] = useState('black');

    // Function to generate a PDF document from the content
  // const generatePDF = () => {
  //   setPdfExportVisible(true);
  // };
  const fetchImages = async () => {
    try {
      const signuptype = localStorage.getItem('signuptype');
      const response = await fetch('https://real-estate-1kn6.onrender.com/api/images');
      const data = await response.json();
  
      if (response.ok) {
        // Filter images based on category and sign-up type
        const filteredImages = data.filter((image) => {
          return image.category === 'Restaurant' && signuptype === 'Restaurant';
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
          <Page size="A4" style={{ backgroundColor: backgroundColor }} >
            <View>
              <Image src={backgroundImage} style={styles.pageBackground} />
              <View style={{ padding: 20}}>
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

              {offers.length !== 0 && (
                <View style={{ paddingTop: 40 }}>
                  <Text style={{ fontFamily: font,color:categoryColor, fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
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

              {weeklyoffers.length === 0 ? null : (
                <View style={{ paddingTop: 40 }}>
                  <Text style={{ fontFamily: font, color: categoryColor, fontSize: 24, textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>
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
                              <FontAwesomeIcon name="f073" size={12} style={{color: textColor}} />
                              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                              <i class="fa-solid fa-clock mt-1 me-2 "></i>
                              <FontAwesomeIcon name="f017" size={12} style={{color: textColor}} />
                              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                                {convertTo12HourFormat(offer.startTime)} - {convertTo12HourFormat(offer.endTime)}
                              </Text>
                            </View>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor }}>
                              Days
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {offer.selectedDays.map((result, index) => (
                              <Text key={index} style={{ ...styles.text,fontSize: 14, marginRight: 5 }}>
                                {result}
                                {index < offer.selectedDays.length - 1 ? ', ' : ''}
                              </Text>
                            ))}
                            </View>
                          </View>
                          <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: textColor }}>
                              Items
                            </Text>
                            {offer.searchResults.map((result, index) => (
                              <Text
                                key={index}
                                style={{ ...styles.text,fontSize: 12, marginRight: 5 }}
                              >
                                {result.label}
                                {index < offer.searchResults.length - 1 ? ', ' : ''}
                              </Text>
                            ))}
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
        fontlink,
        backgroundImage
        // Add other preferences here
      };

      // Check if backgroundImage is set and not an empty string
   if (backgroundImage && backgroundImage.trim() !== '') {
     // Include the backgroundImage in the userPreference object
     userPreference.backgroundImage = backgroundImage;
   } else {
     // If backgroundImage is not set or empty, set it to null or an empty string as needed
     userPreference.backgroundImage = null; // or userPreference.backgroundImage = ''; 
   }

      const response = await fetch('https://real-estate-1kn6.onrender.com/api/saveColorPreferences', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ userid,restaurantId, userPreference }),
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

  // Call the saveUserPreferencesToBackend function when user ID or restaurant ID is matched
  useEffect(() => {

        const authToken = localStorage.getItem('authToken');
        const signUpType = localStorage.getItem('signuptype');
      
        if (!authToken || signUpType !== 'Restaurant') {
          navigate('/login');
        }

    Font.register({
      family: "Lato",
      fonts: [
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 600 },
        { src: "https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVew-FGC_p9dw.ttf", fontWeight: 700 },
      ],
    });

  const fetchData = async () => {
    if (subcategoryId != null) {
      fetchSubcategoryItems();
    } else if (restaurantId != null) {
      await fetchRestaurantItems();
      await retrieveUserPreferences(restaurantId); // Fetch user preferences for the restaurant
    
    }
    fetchOffers();
    fetchweeklyOffers();
    fetchImages();
    setloading(false);
  };

  fetchData();
}, [subcategoryId, restaurantId]);

  const retrieveUserPreferences = async (restaurantId) => {
    try {
      // const userid = localStorage.getItem('userid');
      const response = await fetch(`https://real-estate-1kn6.onrender.com/api/getUserPreferences/${restaurantId}`);
      if (response.ok) {
        const userPreference = await response.json();
        if (userPreference && userPreference.length > 0) {
          setBackgroundColor(userPreference[userPreference.length - 1].backgroundColor ?? 'white');
          setTextColor(userPreference[userPreference.length - 1].textColor ?? 'black');
          setFont(userPreference[userPreference.length - 1].font ?? 'Lato');
          setHeadingTextColor(userPreference[userPreference.length - 1].headingTextColor ?? 'black');
          setCategoryColor(userPreference[userPreference.length - 1].categoryColor ?? 'black');
          setFontlink(userPreference[userPreference.length - 1].fontlink ?? '');
          setBackgroundImage(userPreference[userPreference.length - 1].backgroundImage ?? '');

           // Apply the fetched background image to the exportable div if it exists
          if (divToExportRef.current && userPreference[userPreference.length - 1].backgroundImage) {
            divToExportRef.current.style.backgroundImage = `url(${userPreference[userPreference.length - 1].backgroundImage})`;
            divToExportRef.current.style.backgroundSize = 'cover';
            divToExportRef.current.style.backgroundColor = 'transparent';
            divToExportRef.current.style.borderRadius = '10px';
          }
        }
        Font.register({
          family: userPreference[userPreference.length - 1].font ?? 'Lato',
          fonts: [
            { src: userPreference[userPreference.length - 1].fontlink ?? fontlink, fontWeight: 600 },
            { src: userPreference[userPreference.length - 1].fontlink ?? fontlink, fontWeight: 700 },
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
        const response = await fetch(`https://real-estate-1kn6.onrender.com/api/getitems/${subcategoryId}`);
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
        setloading(false);
    }
};

const fetchRestaurantItems = async () => {
    try {
        const response = await fetch(`https://real-estate-1kn6.onrender.com/api/getrestaurantitems/${restaurantId}`);
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

const fetchOffers = async () => {
  try {
    const userid = localStorage.getItem('userid');
    const response = await fetch(`https://real-estate-1kn6.onrender.com/api/offerbtrestaurantid?restaurantId=${restaurantId}`);
    const data = await response.json();

    if (response.ok) {
      if (data.success && Array.isArray(data.offers)) {
        const availableoffers = data.offers.filter((offer) => offer.switchState === true);
        setOffers(availableoffers);
      } else {
        setOffers([]);
      }
      // if (Array.isArray(data.offers)) {
      //   setOffers(data.offers);
      // } else {
      //   setOffers([]); // Set empty array if data.offeritems is not an array
      // }
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
    const response = await fetch(`https://real-estate-1kn6.onrender.com/api/weeklyofferbyrestaurant?restaurantId=${restaurantId}`);
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
                          <div className='exportable-div ' ref={divToExportRef} style={{ backgroundColor,backgroundImage, color: textColor, fontFamily: font }}>
                        
                            <div className="box p-4 " >
                                
                                <div className='row'>
                                    <div className="">
                                        <h5 className='fw-bold' style={{ fontFamily: font, color: headingTextColor}}>Item Detail</h5>
                                    </div>
                                </div>
                                <hr />
                                    {Categories.map((categoryItem, indexd) => {
                                return <div className="row" key={indexd}>
                                        
                                    <div className="col-12 text-center me-auto">
                                    <h1 style={{ fontFamily: font, color:categoryColor}} className='text-uppercase'>{categoryItem}</h1>
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
                                                    </div> : ""
                                                })}
                                            </div>
                                        </div>:""
                                    })}
                                </div>
                                })}<hr/>

                                <div className='row'>
                                {offers.length == 0 ? <div></div> :
                                    <div className="pt-4">
                                        <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font,color:categoryColor}}>Offers</h5>
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
                                          <h5 className='fw-bold text-uppercase text-center fs-2' style={{ fontFamily: font,color:categoryColor}}>Weekly Offers</h5>
                                      </div>
                                    }

                                    {weeklyoffers.map((offer) => (
                                      <div key={offer._id} className='col-lg-4 col-md-6 col-sm-12 col-12'>
                                          <div className="boxitem my-3 py-5 px-4">
                                      <p className='fw-bold fs-3 mb-3' style={{ fontFamily: font}}>{offer.offerName}</p>
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
                                      
                                        <p className='fs-4 fw-bold pt-3' style={{ fontFamily: font, color: textColor}}>RS. {offer.price} /-</p>
                                      </div>
                                      </div>

                                      </div>
                                    ))}
                                  </div>
                              </div>
                          </div>
                        </div>
                        
                        <button onClick={handleExportClick}>Export as JPG</button>
                        <div>
                          <button onClick={generatePDF}>Export as PDF</button>
                        </div>
  

                        <button onClick={saveUserPreferencesToBackend}>Save Preference</button>
                        <FontPicker apiKey="AIzaSyBe6AEuTCWpxst1ETNizb1lVdsl5hm6MYA" 
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
                            <label htmlFor="headingTextColor">Heading Text Color:</label>
                            <input
                                type="color"
                                id="headingTextColor"
                                value={headingTextColor}
                                onChange={(e) => handleHeadingTextColor(e.target.value)}
                            />
                        </div>
                        {/* <div>
                            <label htmlFor="headingTextColor">Heading Text Color:</label>
                            <input
                            type="color"
                            id="headingTextColor"
                            value={headingTextColor}
                            onChange={(e) => {        
                                // handleHeadingTextColor(e.target.value);
                                handleHeadingTextColor(e.target.value);
                            }}
                            />
                        </div> */}
                        <div>
                            <label htmlFor="categoryColor">Category Text Color:</label>
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



