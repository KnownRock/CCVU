import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';

import SimpleModel from '../../SimpleModal'
import availableResolution from '../../utils/availableResolutions'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function(props) {
  const classes = useStyles()
  const {
    open, setOpen, 
    resolutionId, setResolutionId,
  } = props;

  const handleChange = (e) => {
    // console.log(e);
    setResolutionId(e.target.value)
  }

  return (
    <div>
     
        <SimpleModel open={open} setOpen={setOpen}>


          <div className={classes.paper} style={{width:'300px'}}>
            <h2 id="transition-modal-title">Setting Record Resolution</h2>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{width:'100%'}}
              value={resolutionId}
              onChange={handleChange}
            >
              {availableResolution.map((el,index)=>(
                <MenuItem value={index} key={index}>{el.label}</MenuItem>
              ))}
            </Select>
            {/* <h2 id="transition-modal-title">设置滚轮步进</h2>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{width:'100%'}}
              value={wheelSense}
              onChange={handleChangeA}
            >
              {[100,10,1,0.1,0.01].map((el,index)=>(
                <MenuItem value={el} key={index}>{el}</MenuItem>
              ))}
            </Select> */}
            
            {/* <p id="transition-modal-description">react-transition-group animates me.</p> */}
          </div>
          </SimpleModel>
    </div>
  );
}
