import React from 'react'
import Usernavbar from './Usernavbar'
import Dashboard from './Dashboard'

export default function Userdashboard() {
  return (
    <div className='bg'>
        <div className='container-fluid'>
            <div className="row">
                <div className='col-2 vh-100 p-0' style={{backgroundColor:"#fff"}}>
                    <Usernavbar/>
                </div>
                <div className="col-10">
                    <Dashboard/>
                </div>
            </div>
        </div>
    </div>
  )
}
