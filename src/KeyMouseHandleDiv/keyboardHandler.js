import keymap from './keymap';
var specKeyDict = {  
  "AltLeft":4,
  "AltRight":64,
  "ControlLeft":1,
  "ControlRight":16,
  "ShiftLeft":2,
  "ShiftRight":32,
}

function getSpecKeysToSpecKeysBit(specKeys){
  var acc = 0
  for(var k in specKeys){
    acc += specKeyDict[k]
  }
  return acc;
  
}

function getHandler(serialPort) {


  var specKeys = {}

  // ctx.websocket.send('Hello World');
  function onKeyEvent(keyEvent) {
    const obj = keyEvent
    if(obj.type === 'down'){
      if(specKeyDict[obj.code]){
        specKeys[obj.code] = 1
        return ;
      }
      var code = keymap[obj.code] 
      var data = new Uint8Array([
        0x57, 0xAB, 0x00, 0x02, 0x08,
        getSpecKeysToSpecKeysBit(specKeys), 0x00, code, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00])
      // specKeys = {}
      data[13] = data.reduce((acc, val) => acc+ val, 0)
      serialPort.write(data)
    }else if(obj.type === 'up'){
      if(specKeyDict[obj.code] && specKeys[obj.code]){
        var data = new Uint8Array([
          0x57, 0xAB, 0x00, 0x02, 0x08,
          getSpecKeysToSpecKeysBit(specKeys), 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
          0x00])
        specKeys = {}
        data[13] = data.reduce((acc, val) => acc+ val, 0)
        serialPort.write(data)

      }
      var data = new Uint8Array([
        0x57, 0xAB, 0x00, 0x02, 0x08, 
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
        0x00])
      data[13] = data.reduce((acc, val) => acc+ val, 0)
      serialPort.write(data)
    }
    
  }


  return {onKeyEvent};
}

export default {getHandler}