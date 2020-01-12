import React, { useEffect } from 'react';

const Profile = () => {
  useEffect(() => {
    fetch('/jobs')
      .then(response => response.json())
      .then(response => console.log(response));
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        This is profile
      </div>
    </div>
  );
};

export default Profile;
