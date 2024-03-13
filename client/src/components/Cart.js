import React, { useState } from 'react'
// import trash from "../trash.svg"
import { useCart, useDispatchCart } from '../components/ContextReducer';



export default function Cart() {



    let dispach = useDispatchCart();
    let data =useCart()
    if(data.length === 0){
        return(
            <div>
                <div className='m-5 w-100 text-white text-center fs-3'>
                    This is cart is Empty!
                </div>
            </div>
        )
    }

    const handleCheckout = async()=>{
        let userEmail = localStorage.getItem("userEmail");
        let response = await fetch("https://restroproject.onrender.com/api/orderData",{
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                order_data:data,
                email:userEmail,
                order_date: new Date().toDateString()
            })

        }
        );

        console.log("Order Response:", response)
        if (response.status === 200){
            dispach({type: "DROP"})
        }
    }

    let totalprice = data.reduce((total,food) => total + food.price, 0)
    return(
        <div>
            <div className='container  m-auto mt-5 table-responsive table-responsive-sm table-responsive-md'>
                <table className='table table-hover'>
                    <thead className='text-success fs-4'>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Quantity</th>
                            <th scope='col'>Option</th>
                            <th scope='col'>Amount</th>
                        </tr>
                        
                    </thead>

                    <tbody className='text-white'>
                        {
                            data.map((food, index) =>(
                                <tr>
                                    <th scope='row'>{index + 1}</th>
                                    <td>{food.name}</td>
                                    <td>{food.qty}</td>
                                    <td>{food.size}</td>
                                    <td>{food.price}</td>
                                    <td><button  className='btn btn-primary' onClick={() =>{dispach({ type: "REMOVE", index:index})}}>Delete</button></td>

                                </tr>
                            ))
                        }
                    </tbody>

                </table>
                <div><h1 className='fs-2'>Total Price: {totalprice}/-</h1></div>


                <button className='btn btn-primary mt-5' onClick={handleCheckout}>Check Out</button>

            </div>
        </div>
    )
}