import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import { _checkForSlot, _submitInboundSlotForm } from '../api';
import { useNavigate } from "react-router-dom";
import { wareHouseTiming } from '../api/constants';
import { isLoggedIn,logout } from '../util/helpers';

export const SlotForm = () => {
	let navigate = useNavigate();	

    const [formData, setFormData] = useState({
        email: '',
        brand: '',
        IO_PO_number: '',
        keyAccountManager: '',
        wareHouseCity: '',
        wareHouseType: '',
        wareHouseType: '',
        timeSlot: '',
        quantityUnits: '',
        dateInboundings: '',
        deliveryType: '',
        industry: '',
    });

    const [quantityAvailable , setQuantity] = useState(0);
    const [message , setMessage] = useState('');
    const [submitError , setSubmitError] = useState('');
    const [isLoading , setLoading] = useState(false);

    useEffect(()=>{
        if(!isLoggedIn()) {
            navigate('/signin');
        }
    },[]);

    useEffect(()=> {checkForQuantityAvailable()} , [formData.dateInboundings , formData.wareHouseType, formData.wareHouseCity] );

    const onInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const checkForQuantityAvailable = async (e) => {
        try {
            if(formData.wareHouseCity && formData.dateInboundings && formData.wareHouseType) {
                const { dateInboundings , wareHouseType, wareHouseCity } = formData;
                const response = await _checkForSlot({ dateInboundings, wareHouseType, wareHouseCity });
                if(response && response.data) {
                    setQuantity(response.data.quantityAvailable);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    const submitForm = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const response = await _submitInboundSlotForm(formData);
            if(response.data.success) {
                setLoading(false);
                navigate('/thankyou');
            } else {
                setLoading(false);
                setSubmitError(response.data.message);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const onQuantityChange= async (e) => {
        if(e.target.value && quantityAvailable < e.target.value) {
            setMessage('Quantity should be less than or equal to quantity available!');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    }

    const getDisabledStatus = () => {
        return (
            (quantityAvailable < (+formData.quantityUnits)) || 
            (+formData.quantityUnits) === 0 || 
            (+formData.quantityUnits) < 0 ||
            isLoading
        )
    }

    const getTimeData = () => {
        if(formData && formData.wareHouseCity) {
            const city = formData.wareHouseCity.split('_')[0];
            let {start , end} = wareHouseTiming[city];
            let timeData = [];
            let timeValue = 'am';
            while(true) {

                timeData.push(`${start}${timeValue} - ${start+1}${(start === 11 && timeValue === 'am') ? 'pm' : timeValue}`);
                start++;
                if(start === 12) {
                    start = 0;
                    timeValue = 'pm'                
                    timeData.push(`12pm - ${start+1}pm`);
                    start++;
                }

                if(start === end) {
                    break;
                }
            }
            return timeData;
        }
        return [];
    }

    const logoutUser = () => {
        logout();
        navigate('/signin');
    }

    return (
        <>
            <div className="m-4 mt-5 d-flex place-center rounded-0">
                <div className="card rounded-0">
                    <div className="card-header text-center">
                        <button className='logout-button' onClick={()=>logoutUser()}>Logout</button>
                        <h1 className="main-heading mt-3">Inbounding Slot Booking by KAMs</h1>
                        <p className="header-sub-text px-2">Please enter following details, after checking available slot in Appointment Booking Sheet of respective month</p>
                        <a href="https://docs.google.com/spreadsheets/d/1aqTbhGy6F5rTJpqgJA4a2gqLWAfR_PehhMn0HrexQ9w/edit?usp=sharing" className="survey-link">View survey sheet</a>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={submitForm}>
                            <div className="form-wrapper">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Email</label>
                                            <input onChange={onInputChange} className="form-control" value={formData.email} name="email" required type="email" />
                                            <span className="email-suggestion mt-1">example@example.com</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Brand / Supplier</label>
                                            <input onChange={onInputChange} className="form-control" value={formData.brand} name="brand" required type="text" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">IO / PO Number?</label>
                                            <input onChange={onInputChange} className="form-control" value={formData.IO_PO_number} name="IO_PO_number" required type="text" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Key Account Manager?</label>
                                            <input className="form-control" onChange={onInputChange} value={formData.keyAccountManager} name="keyAccountManager" required type="text" />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-5">
                                    <div>
                                        <label htmlFor="uname1 d-block">Warehouse City?</label>
                                    </div>
                                    <div className="mt-2">
                                        <div className="form-check form-check-inline ">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'karachi_mart'} value={'KARACHI_MART'} />
                                            <label className="form-check-label" htmlFor="karachi_mart">Karachi Mart</label>
                                        </div>
                                        <div className="form-check form-check-inline ">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'karachi_non_mart'} value={'KARACHI_NON_MART'} />
                                            <label className="form-check-label" htmlFor="karachi_non_mart">Karachi Non Mart</label>
                                        </div>
                                        <div className="form-check form-check-inline margin-box">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'lahore_mart'} value={'LAHORE_MART'} />
                                            <label className="form-check-label" htmlFor="lahore_mart">Lahore Mart</label>
                                        </div>
                                        <div className="form-check form-check-inline margin-box">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'lahore_non_mart'} value={'LAHORE_NON_MART'} />
                                            <label className="form-check-label" htmlFor="lahore_non_mart">Lahore Non Mart</label>
                                        </div>
                                        <div className="form-check form-check-inline margin-box">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'Islamabad'} value={'ISLAMABAD'} />
                                            <label className="form-check-label" htmlFor="Islamabad">Islamabad</label>
                                        </div>
                                        <div className="form-check form-check-inline margin-box">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'Faisalabad'} value={'FAISALABAD'} />
                                            <label className="form-check-label" htmlFor="Faisalabad">Faisalabad</label>
                                        </div>
                                        <div className="form-check form-check-inline margin-box">
                                            <input onChange={onInputChange} className="form-check-input " type="radio" name="wareHouseCity" id={'Peshawar'} value={'PESHAWAR'} />
                                            <label className="form-check-label" htmlFor="Peshawar">Peshawar</label>
                                        </div>
                                    </div>
                                </div>

                                {formData.wareHouseCity && 
                                    <div className="form-group mt-5">
                                        <div>
                                            <label htmlFor="uname1 d-block">Warehouse Type?</label>
                                        </div>
                                        <div className="mt-2">
                                            <div className="form-check form-check-inline ">
                                                <input onChange={(e) => {onInputChange(e)}} className="form-check-input " type="radio" name="wareHouseType" id="NON_BULKY" value="NON_BULKY" />
                                                <label className="form-check-label" htmlFor="NON_BULKY">Non Bulky</label>
                                            </div>
                                            <div className="form-check form-check-inline margin-box">
                                                <input onChange={(e) => {onInputChange(e)}} className="form-check-input " type="radio" name="wareHouseType" id="SEMI_BULKY" value="SEMI_BULKY" />
                                                <label className="form-check-label" htmlFor="SEMI_BULKY">Semi Bulky</label>
                                            </div>
                                            <div className="form-check form-check-inline margin-box">
                                                <input onChange={(e) => {onInputChange(e)}} className="form-check-input " type="radio" name="wareHouseType" id="BULKY" value="BULKY" />
                                                <label className="form-check-label" htmlFor="BULKY">Bulky</label>
                                            </div>
                                        </div>
                                    </div>
                                }


                            {formData.wareHouseType &&
                                <div className="row mt-5">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Date of Inbounding?</label>
                                            <input className="form-control" value={formData.dateInboundings} onChange={(e) => {onInputChange(e)}} name="dateInboundings" required type="date" />
                                        </div>
                                    </div>
                                </div>
                            }

                            {formData.dateInboundings &&
                                <div className="form-group mt-5">
                                    <div>
                                        <label htmlFor="uname1 d-block">Time Slot?</label>
                                    </div>
                                    <div className="mt-2">
                                        <select name='timeSlot' onChange={(e) => {onInputChange(e)}} className="form-dropdown form-control dropdown" data-component="dropdown">
                                            <option value=""> Please Select </option>
                                            {getTimeData().map(time => 
                                                <option value={time}> {time} </option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            }


                            {formData.timeSlot &&
                                <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Quantity / Units?</label>
                                            <input onChange={onInputChange} onBlur={onQuantityChange} className="form-control" value={formData.quantityUnits} name="quantityUnits" required type="number" />
                                            <span className="quantity-text mt-3">{quantityAvailable} remaining {quantityAvailable === 0 ? '- Please select another slot' : ''}</span>
                                            {message && 
                                                <p className="message-text mt-3">{message}</p>
                                            }
                                        </div>
                                    </div>
                                }

                                <div className="row mt-5">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="uname1">Delivery Type?</label>
                                            <div className="form-check form-check mt-2">
                                                <input required onChange={onInputChange} className="form-check-input " type="radio" name="deliveryType" id="pickup" value="pickup" />
                                                <label className="form-check-label" htmlFor="pickup">Pick up</label>
                                            </div>
                                            <div className="form-check form-check mt-2">
                                                <input required onChange={onInputChange} className="form-check-input " type="radio" name="deliveryType" id="dropOff" value="dropOff" />
                                                <label className="form-check-label" htmlFor="dropOff">Drop off</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mt-5">
                                    <div>
                                        <label htmlFor="uname1 d-block">Industry?</label>
                                    </div>
                                    <div className="mt-2">
                                        <select required onChange={onInputChange} name="industry" className="form-dropdown form-control dropdown" data-component="dropdown">
                                            <option value=""> Please Select </option>
                                            <option value="FMCG "> FMCG </option>
                                            <option value="Fashion "> Fashion </option>
                                            <option value="Lifestyle "> Lifestyle </option>
                                            <option value="Electronics"> Electronics </option>
                                        </select>
                                    </div>
                                </div>

                                <hr className='mt-5' />
                                <div className="text-center">
                                    <div className='submit-text mt-3 mb-3'>
                                        {submitError}
                                    </div>
                                    <button disabled = {getDisabledStatus()} type='submit' className="btn submit-button m-5 p-3">{isLoading ? 'Please wait ...' : 'Submit'}</button>
                                </div>

                            </div>
                        </form>

                    </div>
                </div>
            </div>

        </>
    )
}