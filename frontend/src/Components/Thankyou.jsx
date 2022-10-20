import React from 'react'
import { useNavigate } from "react-router-dom";

export const Thankyou = () => {
	let navigate = useNavigate();	

    return(
        <>
            <div className="thankyou-wrapper text-center">
                <h3 className='display-5'>Thank you!</h3>
                <p className='thankyou-subtext'>Your submission has been received.</p>
                <button onClick={()=>navigate('/')} className="btn submit-button mt-5 width-submit btn-lg">Submit another form</button>
            </div>
        </>
    )
}