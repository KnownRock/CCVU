import React, { useState, useEffect, useRef, useMemo } from 'react'
import availableResolutions from '../utils/availableResolutions'

// https://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
function getVideoSetting({resolution}){
  return {
    width: { ideal: resolution.width },
    height: { ideal: resolution.height } 
  }
}



function Camera(props) {
  // https://www.reactjs.org/docs/hooks-reference.html#useref
  const videoRef = props.videoRef ?? useRef(null)
  const resolutionId = props.resolutionId ?? 1
  const [video, setVideo] = useState(null)
  useEffect(()=>{
    if(videoRef&&videoRef.current){
      setVideo(videoRef.current)
    }
  },[videoRef])
  


  const [size,setSize] = useState(({
    width:window.innerWidth,
    height:window.innerHeight
  }))

  
  const videoSetting = getVideoSetting({
    resolution:availableResolutions[resolutionId]
  })


  const [muted,setMuted] = useState(false) 
  useEffect(()=>{
    if(!video) return

    video.muted = muted
  },[video,muted])

  useEffect(() => {
    if(!videoRef) return
    const video = videoRef.current
    if(!video) return

    (async ()=>{
      
      video.srcObject && video.srcObject.getTracks().forEach(function(track) {
        track.stop();
      });
      // video.srcObject = null 

      await new Promise(res=>{
        setTimeout(res,500)
      })
     
      // https://davidwalsh.name/browser-camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
        navigator.mediaDevices.getUserMedia({ 
          video: {
            ...videoSetting
          },
          audio:{muted}

        }).then(async function (stream) {
          // https://stackoverflow.com/questions/11642926/stop-close-webcam-stream-which-is-opened-by-navigator-mediadevices-getusermedia
          

          video.srcObject = stream;

          // video.srcObject.start()
        });
    }})()
  },[video,videoSetting])

  useEffect(() =>{
    // https://stackoverflow.com/questions/20127763/video-100-width-and-height
    window.onresize = ()=>{
      setSize({
        width:window.innerWidth,
        height:window.innerHeight
      })
    }
  },[])


  const additionSizeStyle = useMemo(_=>{
    const resolution = availableResolutions[resolutionId]
    const rhr = resolution.width/resolution.height
    const rhs = size.width/size.height
    if (rhr<rhs){
      return {
        height:'100%',
        width:'auto'
      };
    }else{
      return {
        height:'auto',
        width:'100%'
      };
    }
  },[resolutionId,size])

  return (
    <div className="App" style={{width:size.width,height:size.height,display:'flex',justifyContent:'center',alignItems:'center'}}> 
      <video ref={videoRef} style={{maxHeight:'100%',maxWidth:'100%',cursor:'none',...additionSizeStyle}} className="" autoPlay></video> 
    </div>
  )
}

export default Camera
