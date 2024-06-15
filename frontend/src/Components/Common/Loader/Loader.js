import React from 'react'
import loader from "../../../Assets/svgs/loader.svg"

export default function Loader() {
  return (
    <>
        <div style={{
                display: 'flex',
                justifyContent: 'center',
                height: '82vh',
                alignItems: 'center'
        }} >
            <img style={{height: '100px'}} src={loader} alt="" />
        </div>
    </>
  )
}
