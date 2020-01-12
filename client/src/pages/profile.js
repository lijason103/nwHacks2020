import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardActions,
  Button, CircularProgress } from '@material-ui/core';

import '../css/profile.css';

const Profile = ({
  username,
}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/jobs?user_id=${username}`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoading(false);
        setJobs(response);
      });
  }, []);

  const deleteJob = (id) => {
    fetch('/jobs', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: username,
        id,
      })
    })
  }

  return (
    <div className="page">
      <div className="page-content">
        {loading ? (
          <CircularProgress style={{ margin: 30 }}/>
        ) : (
          <div className="job-containers">
            {jobs.map(({fields}) => (
              <Card key={fields.id}>
                <CardContent>
                  {fields.url}
                </CardContent>
                <CardActions>
                  <Button
                    size="small" 
                    onClick={() => {
                      deleteJob(fields.id);
                    }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
