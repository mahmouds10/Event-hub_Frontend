import React, { useEffect } from 'react'
import notFound from "../assets/not-found.svg" 
function NotFound() {
  useEffect(() => {
    document.title = "Not Found";
  },[])
  return (
    <div className='flex justify-center items-center h-full'>
        <img src={notFound} className='w-[100%] md:[40%] lg:w-[50%]' alt="" />
    </div>
  )
}

export default NotFound