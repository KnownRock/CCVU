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
    // wheelsense, setWheelsense,
  } = props;

  const handleChange = (e) => {
    setWheelsense(e.target.value)
  }

  return (
    <div>
     
        <SimpleModel open={open} setOpen={setOpen}>


          <div className={classes.paper} style={{width:'300px'}}>
            
            <h2 id="transition-modal-title">Setting Wheel Sensitivity</h2>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{width:'100%'}}
              value={wheelsense}
              onChange={handleChange}
            >
              {[9600, 19200, 38400, 57600, 115200].map((el,index)=>(
                <MenuItem value={el} key={index}>{el}</MenuItem>
              ))}
            </Select>
            
            {/* <p id="transition-modal-description">react-transition-group animates me.</p> */}
          </div>
          </SimpleModel>
    </div>
  );
}
