// import React, { useState } from 'react';
// import Usernavbar from './userpanel/Usernavbar';
// import { useNavigate} from 'react-router-dom'

// export default function Addcategory() {
//   const [selectedImage, setSelectedImage] = useState(null);
//   // const [credentails, setcredentails] = useState({ name: ""})
//   const [credentails, setcredentails] = useState({ name: "",img: ""})

//   const [message, setmessage] = useState(false);
//     const [alertshow, setalertshow] = useState('');
//     let navigate = useNavigate();

//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedImage(file);

//     // Create a preview URL for the selected image
//     const imageUrl = URL.createObjectURL(file);
//     document.querySelector('.preview-image').src = imageUrl;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch("http://localhost:3001/api/addcategory", {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ name: credentails.name,img: credentails.img})
//     });

//     const json = await response.json();
//     console.log(json);

//     if (json.Success) {
//       // setcredentails({ name: ""})
//       setcredentails({ name: "",img: "" })
//       setmessage(true)
//       setalertshow(json.message)
//       navigate('/Userpanel/Menu')
//     }
//   }

//   const onchange = (event) => {
//     setcredentails({ ...credentails, [event.target.name]: event.target.value });
//   }

//   return (
//     <div className='bg'>
//       <div className='container-fluid'>
//         <div className="row">
//           <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
//             <Usernavbar/>
//           </div>

//           <div className="col-10">
//             <form onSubmit={handleSubmit} className='mb-5'>
//               <div className="bg-white mt-5 px-3 py-5 box">
//                 <div className='row'>
//                     <p className='h5'>Add a new category</p>
//                     <p> {credentails.name}</p>
//                     <p> {credentails.img}</p>
//                     <nav aria-label="breadcrumb">
//                         <ol class="breadcrumb mb-0">
//                             <li class="breadcrumb-item"><a href="/Userpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
//                             <li class="breadcrumb-item active" aria-current="page">Add a new category</li>
//                         </ol>
//                     </nav>
//                 </div><hr />

//                 <div className="row">
//                   <div className="d-flex align-items-center">
//                     <input
//                       type="file"
//                       name="category_image"
//                       id="category_image"
//                       accept="image/*"
//                       className="form-control-file d-none"
//                       onChange={handleImageChange}
//                     />
//                     <label htmlFor="category_image" className="mb-0">
//                       <div htmlFor="profile-image" className="btn btn-outline-primary waves-effect waves-light my-2 mdi mdi-upload">
//                         <span className="d-none d-lg-inline">
//                           <i className="fa-solid fa-upload me-2"></i>Image
//                         </span>
//                       </div>
//                     </label>
//                     <div className="mx-2">
//                       <img className="avatar-xl rounded-circle img-thumbnail preview-image img-fluid" name="img" onChange={onchange} alt="Select image" style={{ width: '100px', height: '100px' }} />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="row mt-3">
//                     <div className="col-4">
//                         <div class="mb-3">
//                             <label for="exampleInputtext1" class="form-label">Category Name *</label>
//                             <input type="text" class="form-control" name="name" onChange={onchange} placeholder='Category Name' id="exampleInputtext1"/>
//                         </div>
//                     </div>
//                 </div><hr />

//                 <div className="d-flex">
//                     <button className='btn btnclr text-white'>Save </button>
//                     <a href="/Userpanel/Category" className='btn btn-secondary pb-0'>Cancel</a>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import React, { useState } from 'react';
import Usernavbar from './userpanel/Usernavbar';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const restaurantId = location.state?.restaurantId;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurantId: restaurantId,
                    name: categoryName
                })
            });

            const json = await response.json();

            if (json.success) {
                navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } });
            } else {
                console.error('Error adding category:', json.message);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    const handleCancelAddCategory = () => {
        navigate('/Userpanel/Menu', { state: { restaurantId: restaurantId } });
    }

    return (
        <div className='bg'>
            <div className='container-fluid'>
                <div className="row">
                    <div className='col-2 vh-100 p-0' style={{ backgroundColor: "#fff" }}>
                        <Usernavbar />
                    </div>

                    <div className="col-10">
                        <div className="bg-white mt-5 px-3 py-5 box">
                            <div className='row'>
                                <p className='h5'>Add Category</p>
                                {/* Rest of your navigation and layout */}
                            </div>
                            <hr />

                            <form onSubmit={handleSubmit}>
                                <div className="row mt-3">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="categoryName" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="categoryName"
                                                value={categoryName}
                                                onChange={(e) => setCategoryName(e.target.value)}
                                                placeholder='Category Name'
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mt-3">
                                    <button type="submit" className='btn btnclr text-white me-2'>Save</button>
                                    <a onClick={() => handleCancelAddCategory()} className='btn btn-secondary text-white'>Cancel</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}