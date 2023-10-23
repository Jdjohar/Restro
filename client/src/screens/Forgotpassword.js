import React, { useState } from 'react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Send a request to the backend to initiate the password reset process
      const response = await fetch('https://restroproject.onrender.com/api/resetpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        // Handle non-OK response status codes (e.g., 404 or 500)
        throw new Error('Network response was not ok');
      }
  
      let json;
      let isJSON = false;
  
      try {
        const responseBody = await response.clone().json();
        json = responseBody;
        isJSON = true;
      } catch (jsonError) {
        // Parsing as JSON failed; treat it as plain text
        const textResponse = await response.text();
        json = textResponse;
      }
  
      if (isJSON && json.success) {
        setMessage('Password reset instructions sent to your email.');
      } else if (isJSON) {
        setMessage('Error: ' + json.message);
      } else {
        setMessage(json); // Treat plain text as the response message
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  
  
  

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label mt-4">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
            {message && <p>{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
