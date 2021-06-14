import React, { useState, useEffect, useRef } from 'react'
import keyboardHandler from './keyboardHandler'
function KeyMouseHandleDiv(props) {
  const {children, ...otherProps} = props
  // const [serialPort, setSerialPort] = useState(null)
  
  //const containerAuto = useState()
  const container = useRef()

  container.current = props.container

  const {writable,wheelsense} = props

  const lastestPoint = useRef()
  const sendedPoint = useRef()
  useEffect(_=>{
    if(!writable) return

    const interval = setInterval(async _=>{
      if(!lastestPoint.current) return
      if(sendedPoint.current === lastestPoint.current) return

      const point = sendedPoint.current = lastestPoint.current
      const conW = container.current.offsetWidth
      const conH = container.current.offsetHeight
      let x = (~~(point.x/conW * 4096))
      let y = (~~(point.y/conH * 4096))
      if(x<0) x=0
      if(x>=4096) x = 4095
      if(y<0) y=0
      if(y>=4096) y = 4095

      const data = new Uint8Array([
      0x57, 0xAB, 0x00, 0x04, 0x07, 
      0x02, 0x00, x%256, x/256, y%256, y/256, 0x00,
      0x00])

      data[12] = data.reduce((acc, val) => acc+ val, 0)
      await writable.write(data)
      
    },10)

    return _=>{
      clearInterval(interval)
    };
  },[writable])

  const lastestKey = useRef()
  const sendedKey = useRef()
  useEffect(_=>{
    if(!writable) return

    const kbh = keyboardHandler.getHandler(writable)

    const interval = setInterval(async _=>{
      if(!lastestKey.current) return
      if(sendedKey.current === lastestKey.current) return

      const key = sendedKey.current = lastestKey.current
      kbh.onKeyEvent(key)

    },10)

    return _=>{
      clearInterval(interval)
    };
  },[writable])



  useEffect(_=>{
    if(!container.current) return 

    const handleMouseHandlers0 = ['move'].map(el=>{
      const handleMouse = async e=>{
        if(!writable) return
  
        lastestPoint.current = {
          x:e.offsetX,
          y:e.offsetY,
        }
        console.log(lastestPoint.current);
        e.stopPropagation()
      }
      return handleMouse
    })

    const handleMouseHandlers1 = ['down','up'].map(el=>{
      const handleMouse = async e=>{
        if(!writable) return
  
        const data = new Uint8Array([
          0x57, 0xAB, 0x00, 0x04, 0x07, 
          0x01, e.buttons, 0x00, 0x00, 0x00, 0x00, 0x00,
          0x00])

        data[12] = data.reduce((acc, val) => acc+ val, 0)
        await writable.write(data)

        e.stopPropagation()
      }
      return handleMouse
    })

    const handleKeyHandlers = ['up','down'].map(el=>{
      return e=>{
        lastestKey.current = {
          code:e.code,
          type:el
        }
        e.stopPropagation()
      };
    })

    const handleWheel = async e =>{
      const rawValue = -(~~(e.deltaY*(+(wheelsense ?? 100))))
      console.log(rawValue);
      var value = 0
      if(rawValue <0){
        value = 256 + rawValue
        if(value < 129) value = 129
      }else{
        value = rawValue
        if(value >128) value = 127
      }
      var data = new Uint8Array([
        0x57, 0xAB, 0x00, 0x05, 0x05, 
        0x01, 0x00, 0x00, 0x00, value, 
        0x00]) 

      data[10] = data.reduce((acc, val) => acc+ val, 0)
      await writable.write(data)

      e.preventDefault();
    }



    const handleMenu = event => event.preventDefault()
    
    document.addEventListener('keyup',handleKeyHandlers[0])
    document.addEventListener('keydown',handleKeyHandlers[1])
    document.addEventListener('contextmenu', handleMenu);

    container.current.addEventListener('wheel',handleWheel)
    container.current.addEventListener('mousemove', handleMouseHandlers0[0])
    container.current.addEventListener('mousedown', handleMouseHandlers1[0])
    container.current.addEventListener('mouseup', handleMouseHandlers1[1])
    return _=>{
      document.removeEventListener('keyup',handleKeyHandlers[0])
      document.removeEventListener('keydown',handleKeyHandlers[1])
      document.removeEventListener('contextmenu', handleMenu);

      container.current.addEventListener('wheel',handleWheel)
      container.current.removeEventListener('mousemove', handleMouseHandlers0[0])
      container.current.removeEventListener('mousedown', handleMouseHandlers1[0])
      container.current.removeEventListener('mouseup', handleMouseHandlers1[1])
    }

    
  },[container,writable,wheelsense])

  

  return (
    <div   {...otherProps} > 
      {children}
      {/* <button style={{position: 'absolute',top:0}} onClick={handleRequestSerial}>Set Serial Port</button> */}
    </div>
  )
}

export default KeyMouseHandleDiv
