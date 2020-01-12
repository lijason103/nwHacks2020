import React, { useState } from 'react';
import '../css/index.css';

import {
  TextField, RadioGroup,
  FormLabel, FormControl,
  FormControlLabel, Radio, Select, MenuItem, Button, InputLabel,
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import SuccessModal from '../components/SuccessModal';
import ErrorModal from '../components/ErrorModal';

const StyledTextField = withStyles({
  root: {
    // backgroundColor: 'black',
  },
})(TextField);

const RADIO_TRACK_CHANGE = 'Track Change';
const RADIO_TRACK_THRESHOLD = 'Track Threshold';

const SELECT_THRESHOLD_ITEMS = [
  { value: '\"!=\"', item: '!=' },
  { value: '\"=\"', item: '=' },
  { value: '\"<\"', item: '<' },
  { value: '\">\"', item: '>' },
];

const validateUrl = (url) => {
  const regex = RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i);
  return regex.test(url);
};

const validateClass = (str) => {
  return str.length > 0;
};

const useStyles = makeStyles({
  formControl: {
    minWidth: 90,
    marginRight: 10,
  },
});

const Index = ({
  username, loggedIn,
}) => {
  const classes = useStyles();
  const [urlInput, setUrlInput] = useState('');
  const [classOrID, setClassOrID] = useState('');
  const [radioValue, setRadioValue] = useState(RADIO_TRACK_CHANGE);
  const [thresholdOperator, setThresholdOperator] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');

  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const submitJob = () => {
    if (!loggedIn) {
      return;
    }
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
      .then(response => {
        if (response.status === 200) {
          setSuccessModal(true);
        } else {
          setErrorModal(true);
        }
      })
      .catch((err) => {
        setErrorModal(true);
      })
  }
  return (
    <div className="page">
      <div className="page-content">
        <div className="top-page">
          <div>
            <p className="title">WebPage Change Tracker</p>
            <p>Track a web page's text by entering the url and the css tag associated with the text.</p>
          </div>
          <div className="image-container">
            <img src={require('../assets/doge.png')} className="image" />
          </div>
        </div>
        <div style={{ width: '70%' }}>
          <p>Enter the URL you want to track.</p>
          <StyledTextField
            id="url-input"
            label="URL"
            onChange={(e) => setUrlInput(e.target.value)}
            value={urlInput}
            variant="outlined"
            margin="dense"
            error={urlInput.length > 0 && !validateUrl(urlInput)}
            helperText={urlInput.length > 0 && !validateUrl(urlInput) && "Invalid URL"}
            style={{
              width: '100%',
            }}
          />
        </div>
        

        <div className={`additional-info ${validateUrl(urlInput) && 'additional-info-show'}`}>
          <p>Additional Information Required</p>

          <StyledTextField
            id="class-input"
            label="Class/ID of Text"
            onChange={(e) => setClassOrID(e.target.value)}
            value={classOrID}
            variant="outlined"
            margin="dense"
          />
        </div>

        <div className={`additional-info ${validateClass(classOrID) && 'additional-info-show'}`}>
          <FormControl style={{ width: 200 }}>
            <FormLabel component="type-of-change">
              Test
            </FormLabel>
            <RadioGroup
              value={radioValue}
              onChange={(e) => setRadioValue(e.target.value)}
            >
              <FormControlLabel
                value={RADIO_TRACK_CHANGE}
                control={<Radio color="primary" />}
                label={RADIO_TRACK_CHANGE}
                labelPlacement="end"
              />
              <FormControlLabel
                value={RADIO_TRACK_THRESHOLD}
                control={<Radio color="primary" />}
                label={RADIO_TRACK_THRESHOLD}
                labelPlacement="end"
              />
            </RadioGroup>
          </FormControl>

          {radioValue === RADIO_TRACK_THRESHOLD && (
            <div className="threshold-input">
              <FormControl className={classes.formControl}>
                <InputLabel
                  id="operator"
                >
                  Operator
                </InputLabel>
                <Select
                  labelId="operator"
                  id="operator"
                  value={thresholdOperator}
                  onChange={(e) => setThresholdOperator(e.target.value)}
                  // variant="outlined"
                  autoWidth
                >
                  {SELECT_THRESHOLD_ITEMS.map((item) => (
                    <MenuItem value={item.value} key={item.item}>{item.item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <StyledTextField
                id="threshold-input"
                label="Threshold Value"
                onChange={(e) => setThresholdValue(e.target.value)}
                value={thresholdValue}
                variant="outlined"
                margin="dense"
              />
            </div>
          )}
          
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: 20 }}
            onClick={submitJob}
            disabled={radioValue === RADIO_TRACK_THRESHOLD && thresholdValue.length === 0}
          >
            Submit
          </Button>
        </div>
      </div>

      <SuccessModal
        open={successModal}
        onClose={() => setSuccessModal(false)}
      />
      <ErrorModal
        open={errorModal}
        onClose={() => setErrorModal(false)}
      />
    </div>
  );
};

export default Index;
