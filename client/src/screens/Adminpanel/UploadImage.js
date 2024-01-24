import React, { useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

const UploadImage = () => {
  const [image, setImage] = useState('');
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: 'dlq5b1jed', // Replace with your Cloudinary cloud name
      apiKey: '249495292915953', // Replace with your Cloudinary API key
      apiSecret: '7Sqyit1Cc5VeuPfm1OEFWTI5i7I', // Replace with your Cloudinary API secret
    },
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadResponse = await cloudinary.uploader.upload(file, {
        upload_preset: 'restrocloudnary', // Replace with your Cloudinary upload preset
      });

      setImage(uploadResponse.secure_url);
      // Here, you might want to store the URL or perform other actions with the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div>
          <AdvancedImage cldImg={image} />
        </div>
      )}
    </div>
  );
};

const App = () => {
  return <UploadImage />;
};

export default App;
