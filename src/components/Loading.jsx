import React from 'react'
import Lottie from "lottie-react";
import loadingAnim from "../assets/loading-animation.json";

function Loading() {
  return (
    <div className="min-h-inheri h-full p-14 flex justify-center items-center ">
          <Lottie
            animationData={loadingAnim}
            loop={true}
            className="w-[380px]"
          />
          
        </div>
  )
}

export default Loading