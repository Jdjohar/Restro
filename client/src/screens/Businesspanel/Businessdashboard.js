import React from 'react'
import Servicenavbar from './Servicenavbar';
import Dashboard from './Dashboard';
import Servicenav from './Servicenav';

export default function Retailerdashboard() {
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-lg-2 col-md-3 vh-100 b-shadow bg-white d-lg-block d-md-block d-none'>
                    <Servicenavbar/>
                </div>
                <div className="col-lg-10 col-md-9 col-12 mx-auto">
                    <div className='d-lg-none d-md-none d-block mt-2'>
                        <Servicenav/>
                    </div>
                    <Dashboard/>
                </div>
            </div>
        </div>
    </div>
  )
}
