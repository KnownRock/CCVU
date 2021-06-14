import React, { useState, useEffect, useRef } from 'react'
import logo from './logo.svg'
import './App.css'

import Camera from './Camera'
import KeyMouseHandleDiv from './KeyMouseHandleDiv'
import Sidebar from './SideMenu' 


function App() {
  const videoRef = useRef()
  const [container,setContainer] = useState(null)
  const [writable, setWritable] = useState(null)
  const [resolutionId,setResolutionId] = useState(localStorage.getItem('resolutionId') ?? 1)
  const [wheelsense,setWheelsense] = useState(+(localStorage.getItem('wheelsense') ?? 100))

  useEffect(_=>{
    if(!videoRef) return ;
    setContainer(videoRef.current)
    console.log(videoRef.current);
  },[videoRef])

  useEffect(_=>{
    localStorage.setItem('resolutionId',resolutionId)

  },[resolutionId])

  useEffect(_=>{
    localStorage.setItem('wheelsense',wheelsense)

  },[wheelsense])

  

  useEffect(_=>{
    (async () => {
      const [port] = await window.navigator.serial.getPorts()
      const serial = port
      if(serial.writable) return
      await serial.open({ baudRate: 115200 })
      const writable = serial.writable.getWriter()
      setWritable(writable)
    })() 
  },[])

  return (
    <div className="App"> 
      <KeyMouseHandleDiv container={container} writable={writable} wheelsense={wheelsense} >
        <Camera resolutionId={resolutionId} videoRef={videoRef}></Camera>
      </KeyMouseHandleDiv>

      <Sidebar 
        resolutionId={resolutionId} setResolutionId={setResolutionId}
        wheelsense={wheelsense} setWheelsense={setWheelsense}
        writable={writable} setWritable={setWritable}
        ></Sidebar>
    </div>
  )
}

export default App
