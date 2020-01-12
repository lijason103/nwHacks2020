import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardActions,
  IconButton, CircularProgress, Grid, Typography, Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';

import {
  withRouter,
} from 'react-router-dom';
import '../css/profile.css';

import DeleteModal from '../components/DeleteModal';

const useStyles = makeStyles({
  content: {
    marginBottom: 14,
    marginTop: 14,
  },
  card: {
    minHeight: 230,
  }
});

const Profile = ({
  username, loggedIn, history,
}) => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [toDelete, setToDelete] = useState('');

  
  useEffect(() => {
    if (!loggedIn) {
      history.push('/');
    }
    fetch(`/jobs?user_id=${username}`)
      .then(response => response.json())
      .then(response => {
        const newJobs = response.filter((job) => {
          return job.fields.id !== 'DELETED';
        });
        setLoading(false);
        setJobs(newJobs);
      });
  }, []);

  const handleToDelete = (id) => {
    setToDelete(id);
    setDeleteModal(true);
  }

  const deleteJob = () => {
    fetch('/jobs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: username,
        id: toDelete,
      })
    })
      .then((response) => {
        setDeleteModal(false);
        if (response.status === 200) {
          setLoading(true);
          fetch(`/jobs?user_id=${username}`)
            .then(response => response.json())
            .then(response => {
              const newJobs = response.filter((job) => {
                return job.fields.id !== 'DELETED';
              });
              setLoading(false);
              setJobs(newJobs);
            });
        }
      })
  };

  const navigateToHome = () => {
    history.push('/');
  };

  return (
    <div className="page">
      <div className="page-content">
        {loading ? (
          <CircularProgress style={{ margin: 30 }}/>
        ) : (
          <div className="page-container">
            <Grid container spacing={2}>
              {jobs.map(({fields}, index) => {
                const match = fields.url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
                return (
                  <Grid item key={fields.id}>
                    <Card key={fields.id} variant="outlined" className={classes.card}>
                      <CardContent>
                        <Tooltip title={fields.url} placement="bottom" arrow>
                          <div>
                            <Typography color="textSecondary">
                              {`Webpage #${index + 1}`}
                            </Typography>
                          
                            <Typography variant="h5" component="h2">
                              {match[2]}
                            </Typography>
                          </div>
                        </Tooltip>
                        
                        <Typography className={classes.content} variant="body2" component="p">
                          {`Selector: ${fields.selector}`}
                        </Typography>
                        {fields.condition.length > 0 ? (
                          <Typography variant="body2" component="p">
                            {`Operator: ${fields.condition}`}
                          </Typography>
                        ) : (
                          <Typography variant="body2" component="p" style={{ visibility: 'hidden' }}>
                            {`Operator:`}
                          </Typography>
                        )}
                        {fields.value.length > 0 ? (
                          <Typography variant="body2" component="p">
                            {`Value: ${fields.value}`}
                          </Typography>
                        ) : (
                          <Typography variant="body2" component="p" style={{ visibility: 'hidden' }}>
                            {`Value:`}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <IconButton
                          size="small" 
                          onClick={() => {
                            handleToDelete(fields.id);
                          }}
                          variant="contained"
                          color="secondary"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                )
              })}
            </Grid>
            <div className="add-tracker">
              <h4 onClick={navigateToHome}>Add an additional tracker...</h4>
            </div>
          </div>
          
        )}
      </div>

      <DeleteModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        handleDelete={deleteJob}
      />
    </div>
  );
};

export default withRouter(Profile);
