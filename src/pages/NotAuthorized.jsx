import React, { useEffect } from 'react'
import notAuth from "../assets/not-auth.svg"
function NotAuthorized() {
  useEffect(() => {
    document.title = "Not Authorized";
  },[])
  return (
    <div className='flex justify-center items-center h-full'>
        <img src={notAuth} alt="" className='w-[38%]'/>
    </div>
  )
}

export default NotAuthorized