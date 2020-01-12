import React, { useState } from 'react';
import '../css/index.css';

import {
  TextField, RadioGroup,
  FormLabel,
  FormControlLabel, Radio, Select, MenuItem, Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const StyledTextField = withStyles({
  root: {
    // backgroundColor: 'black',
  },
})(TextField);

const RADIO_TRACK_CHANGE = 'Track Change';
const RADIO_TRACK_THRESHOLD = 'Track Threshold';

const SELECT_THRESHOLD_ITEMS = [
  '!=', '\"==\"', '<', '>',
];

const Index = ({
  username,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [classOrID, setClassOrID] = useState('');
  const [radioValue, setRadioValue] = useState(RADIO_TRACK_THRESHOLD);
  const [thresholdOperator, setThresholdOperator] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');

  const submitJob = () => {
    fetch('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        user_id: username,
        url: urlInput,
        selector: classOrID,
        track_condition: radioValue,
        condition: thresholdOperator,
        value: thresholdValue,
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => console.log(response));
  }
  return (
    <div className="page">
      <div className="page-content">
        
        <StyledTextField
          id="url-input"
          label="Input URL"
          onChange={(e) => setUrlInput(e.target.value)}
          value={urlInput}
          variant="outlined"
          margin="dense"
        />
        <StyledTextField
          id="class-input"
          label="Class or ID"
          onChange={(e) => setClassOrID(e.target.value)}
          value={classOrID}
          variant="outlined"
          margin="dense"
        />
          
        
        <FormLabel component="type-of-change">

        </FormLabel>
        <RadioGroup
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
        >
          <FormControlLabel
            value={RADIO_TRACK_CHANGE}
            control={<Radio color="primary" />}
            label={RADIO_TRACK_CHANGE}
            labelPlacement="start"
          />
          <FormControlLabel
            value={RADIO_TRACK_THRESHOLD}
            control={<Radio color="primary" />}
            label={RADIO_TRACK_THRESHOLD}
            labelPlacement="start"
          />
        </RadioGroup>

        {radioValue === RADIO_TRACK_THRESHOLD && (
          <div className="threshold-input">
            <Select
              value={thresholdOperator}
              onChange={(e) => setThresholdOperator(e.target.value)}
            >
              {SELECT_THRESHOLD_ITEMS.map((item) => (
                <MenuItem value={item} key={item}>{item}</MenuItem>
              ))}
            </Select>
            <StyledTextField
              id="threshold-input"
              label="Threshold Value"
              onChange={(e) => setThresholdValue(e.target.value)}
              value={thresholdValue}
              variant="outlined"
              margin="dense"
            />
          </div>
        ) }
        
        <Button
          variant="contained"
          color="primary"
          onClick={submitJob}
        >
          Submit
        </Button>
        {/* <button onClick={fetchItems}>Fetch</button> */}
      
        
   

      
      </div>
    </div>
  );
};

export default Index;
