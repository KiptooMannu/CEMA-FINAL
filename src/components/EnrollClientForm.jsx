import React, { useState } from 'react';
import './_EnrollClientForm.scss';

const EnrollClientForm = ({ clients, programs, onClientEnrolled }) => {
  const [enrollClientId, setEnrollClientId] = useState('');
  const [enrollProgramId, setEnrollProgramId] = useState(''); // Changed to store Program ID
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [enrollmentError, setEnrollmentError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnrollmentStatus('Enrolling...');
    setEnrollmentError('');

    if (!enrollClientId || !enrollProgramId) {
      setEnrollmentStatus('Failed');
      setEnrollmentError('Please select a Client ID and a Program.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authorization headers (e.g., JWT token)
          // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          clientId: parseInt(enrollClientId), // Ensure it's an integer
          programId: parseInt(enrollProgramId), // Ensure it's an integer
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEnrollmentStatus('Successfully Enrolled');
        if (onClientEnrolled) {
          onClientEnrolled(enrollClientId, enrollProgramId); // Pass back the IDs
        }
        setEnrollClientId('');
        setEnrollProgramId('');
        // Optionally, provide feedback to the user (e.g., a success message)
      } else {
        const errorData = await response.json();
        setEnrollmentStatus('Enrollment Failed');
        setEnrollmentError(errorData?.message || 'Failed to enroll client.');
      }
    } catch (error) {
      console.error('Error enrolling client:', error);
      setEnrollmentStatus('Enrollment Failed');
      setEnrollmentError('Network error occurred while enrolling.');
    }
  };

  return (
    <div className="enroll-client-form">
      <h3>Enroll Client in Program</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Client ID:
          <input
            type="text"
            value={enrollClientId}
            onChange={(e) => setEnrollClientId(e.target.value)}
          />
        </label>
        <label>
          Program:
          <select value={enrollProgramId} onChange={(e) => setEnrollProgramId(e.target.value)}>
            <option value="">Select Program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={enrollmentStatus === 'Enrolling...'}>
          {enrollmentStatus === 'Enrolling...' ? 'Enrolling...' : 'Enroll Client'}
        </button>
        {enrollmentStatus && <p>{enrollmentStatus}</p>}
        {enrollmentError && <p className="error">{enrollmentError}</p>}
      </form>
    </div>
  );
};

export default EnrollClientForm;
