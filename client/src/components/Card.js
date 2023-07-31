import React, { useRef, useState, useEffect } from 'react'
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
    let dispach = useDispatchCart();
    let data = useCart()
    const priceRef = useRef();
    let options = props.options;
    let priceoptions = Object.keys(options)

    const [qty, setQty] = useState(1)
    const [size, setSize] = useState("")

    let foodItems = props.foodItem;

    const handleAddtoCart = async () => {

        let food = [];
        for (const item of data) {
            if (item.id === foodItems._id) {
                food = item;

                break;
            }
        }

        if (food !== []) {
            if (food.size === size) {
                await dispach({ type: "UPDATE", id: foodItems._id, price: finalPrice, qty: qty })
                return
            }
            else if (food.size !== size) {
                await dispach({ type: "ADD", id: foodItems._id, name: foodItems.name, price: finalPrice, img: foodItems.img, qty: qty, size: size })
                return
            }
            return
        }
        await dispach({ type: "ADD", id: foodItems._id, name: foodItems.name, price: finalPrice, img: foodItems.img, qty: qty, size: size })
    }

    let finalPrice = qty * parseInt(options[size]);   //This is where Price is changing

    useEffect(() => {
        setSize(priceRef.current.value)
    }, [])

    return (
        <div>
            <div className="card mt-4" style={{ "width": "18rem", "maxHeight": "360px" }}>
                <img src={foodItems.img} className="card-img-top img-fluid" style={{ height: "120px", width: "100%", objectFit: "cover" }} alt="..." />
                <div className="card-body">
                    <h5 className="card-title">{foodItems.name}</h5>
                    <select className='m-2 h-100  bg-sucess' onChange={(e) => setQty(e.target.value)}>
                        {Array.from(Array(6), (e, i) => {
                            return (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            )
                        })}

                    </select>
                    <select className='m-2 h-100  bg-sucess' ref={priceRef} onChange={(e) => setSize(e.target.value)}>
                        {priceoptions.map((data) => {
                            return <option key={data} value={data}>{data}</option>
                        })}
                    </select>

                    <div className='d-inline text-white h-100 fs-5'>
                        ₹{finalPrice}/-
                    </div>
                    <hr />

                    <button className='btn btn-success justify-content-center ms-2' onClick={() => handleAddtoCart()}>Add to Cart</button>
                </div>
            </div>
        </div>
    )
}
