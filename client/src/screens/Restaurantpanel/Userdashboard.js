import React from 'react'
import Usernavbar from './Usernavbar'
import Dashboard from './Dashboard'
import Nav from './Nav';

export default function Userdashboard() {
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <Usernavbar/>
                </div>
                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Nav/>
                    </div>
                    <Dashboard/>
                </div>
            </div>
        </div>
    </div>
  )
}
