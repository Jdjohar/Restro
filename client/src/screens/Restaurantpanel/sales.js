import React from 'react'
import Usernavbar from './Usernavbar';

export default function Sales() {
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>

                <div className="col-10">
                    <div className="bg-white my-5 p-4 box mx-4">
                        <div className='row'>
                            <div className="col-4 me-auto">
                                <p className='h5'>Sales</p>
                                {/* <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb mb-0">
                                        <li class="breadcrumb-item"><a href="/Restaurantpanel/Userdashboard" className='txtclr text-decoration-none'>Dashboard</a></li>
                                        <li class="breadcrumb-item active" aria-current="page">Categories</li>
                                    </ol>
                                </nav> */}
                            </div>
                            {/* <div className="col-2">
                                <button className='btn rounded-pill btnclr text-white fw-bold' onClick={handleAddClick}>+ Add New</button>
                            </div> */}
                        </div><hr />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
