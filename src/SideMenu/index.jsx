import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ListSubheader from '@material-ui/core/ListSubheader';
import SwitchVideoIcon from '@material-ui/icons/SwitchVideo';
import MouseIcon from '@material-ui/icons/Mouse';
import MemoryIcon from '@material-ui/icons/Memory';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import SettingResolutionModel from './SettingResolutionModel'
import SettingWheelsenseModel from './SettingWheelsenseModel'
import SettingSerialModal from './SettingSerialModal'

const useStyles = makeStyles((theme) =>({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Sidebar(props){
  const classes = useStyles();
  const {
    resolutionId,setResolutionId,
    wheelsense,setWheelsense,
    writable,setWritable
  } = props

  const [isShowMenu, setIsShowMenu] = useState(false)

  // https://material-ui.com/zh/components/drawers/
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsShowMenu(open);
  };


  function handleMenuShow(){
    setIsShowMenu(true);
  }

  function handleMenuHide(){
    setIsShowMenu(false);
  }

  const handleRequestSerial = async ()=>{
    const serial = await window.navigator.serial.requestPort()
    await serial.open({ baudRate: 115200 })
    const writable = serial.writable.getWriter()
    setWritable(writable)
  }

  // https://developer.mozilla.org/zh-CN/docs/Web/API/Fullscreen_API
  function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  const [showResolution,setShowResolution] = useState(false)
  const [showWheelSense,setShowWheelSense] = useState(false)
  const [showSerial,setShowSerial] = useState(false)

  

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
    >
      <List subheader={<ListSubheader>Settings</ListSubheader>} className={classes.root}>

        <ListItem button key={'Setting resolution'} onClick={_=>setShowResolution(true)}>
          <ListItemIcon><SwitchVideoIcon /></ListItemIcon>
          <ListItemText primary={'Resolution'} />
        </ListItem>

        <ListItem button key={'Setting Wheelsense'} onClick={_=>setShowWheelSense(true)}>
          <ListItemIcon><MouseIcon /></ListItemIcon>
          <ListItemText primary={'Wheel Sensitivity'} />
        </ListItem>

        {/* <ListItem button key={'Setting Serial'} onClick={_=>setShowSerial(true)}>
          <ListItemIcon><MouseIcon /></ListItemIcon>
          <ListItemText primary={'Select Serial'} />
        </ListItem> */}

        <ListItem button key={'Setting Serial'} onClick={handleRequestSerial}>
          <ListItemIcon><MemoryIcon /></ListItemIcon>
          <ListItemText primary={'Select Serial'} />
        </ListItem>

        <ListItem button key={'Full Screen'} onClick={toggleFullScreen}>
          <ListItemIcon><FullscreenIcon /></ListItemIcon>
          <ListItemText primary={'Full Screen'} />
        </ListItem>

      </List>
      {/* <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  );


  return (
    <div style={{position:'fixed',height:'100%',display:'flex',alignItems:'center',zIndex:5,width:'0',top:0}}>
      <div style={{height:'100%',backgroundColor:'rgba(0,0,0,0.01)'}} onMouseMove={handleMenuShow} >
        {/* <div style={{display:isShowMenu?'unset':'none'}}>111111</div> */}
        <div style={{width:'5px'}}></div>
      </div>
      <Drawer anchor={'left'} open={isShowMenu} onClose={toggleDrawer( false)}>
        {list('left')}
      </Drawer>
      <SettingResolutionModel 
        open={showResolution} 
        setOpen={setShowResolution}
        resolutionId={resolutionId}
        setResolutionId={setResolutionId}

      ></SettingResolutionModel>
      <SettingWheelsenseModel 
        open={showWheelSense} 
        setOpen={setShowWheelSense}
        wheelsense={wheelsense}
        setWheelsense={setWheelsense}
      ></SettingWheelsenseModel>

      {/* <SettingSerialModal
        open={showSerial} 
        setOpen={setShowSerial}
      >
      </SettingSerialModal> */}
       
    </div>  
  )
}
   



export default Sidebar