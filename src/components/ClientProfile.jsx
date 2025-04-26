import React, { useState, useEffect } from 'react';
import './_ClientProfile.scss';

const ClientProfile = ({ client }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async (clientId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/clients/${clientId}/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(data.data); // Access the 'data' property of the response
        } else {
          const errorData = await response.json();
          setError(errorData?.message || 'Failed to fetch client profile.');
        }
      } catch (err) {
        setError('Network error occurred.');
        console.error('Error fetching client profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (client?.clientId) {
      fetchProfile(client.clientId);
    } else {
      setProfile(null); // Clear profile
    }
  }, [client]);

  if (loading) {
    return <p>Loading client profile...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!profile) {
    return <p>No client selected or found.</p>;
  }

  return (
    <div className="client-profile">
      <h3>Client Profile</h3>
      <p>Client ID: {profile.clientId}</p>
      <p>Name: {profile.name}</p>
      <p>Age: {profile.age}</p>
      <p>Gender: {profile.gender}</p>
      <p>Date of Birth: {profile.dateOfBirth}</p>
      <p>Enrolled Programs: {profile.enrollments?.map(e => e.programName).join(', ') || 'Not enrolled in any program'}</p>
    </div>
  );
};

export default ClientProfile;
