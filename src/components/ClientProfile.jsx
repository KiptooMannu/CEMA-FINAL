import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './_ClientProfile.scss';

const ClientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch client data
        const clientResponse = await fetch(`https://cema-health-program.onrender.com/api/clients/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!clientResponse.ok) {
          throw new Error('Failed to fetch client data');
        }
        
        const clientData = await clientResponse.json();
        setClient(clientData.data);

        // Fetch enrollments
        const enrollmentsResponse = await fetch(`https://cema-health-program.onrender.com/api/clients/${id}/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!enrollmentsResponse.ok) {
          throw new Error('Failed to fetch client enrollments');
        }
        
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData.data.enrollments || []);

      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="client-profile-container">
        <div className="loading-spinner"></div>
        <p>Loading client profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-profile-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate(-1)} className="back-button">
          Back to Clients
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-profile-container">
        <div className="error-message">Client not found</div>
        <button onClick={() => navigate(-1)} className="back-button">
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="client-profile-page">
      <ToastContainer />
      
      <div className="profile-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Clients
        </button>
        <h1>Client Profile</h1>
      </div>

      <div className="profile-container">
        <div className="basic-info">
          <h2>
            {client.first_name} {client.last_name}
            <span className="client-id">ID: {client.id}</span>
          </h2>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Date of Birth:</span>
              <span className="value">{formatDate(client.dateOfBirth)}</span>
            </div>
            <div className="info-item">
              <span className="label">Gender:</span>
              <span className="value">{client.gender || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{client.email || '-'}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{client.phone || '-'}</span>
            </div>
            <div className="info-item full-width">
              <span className="label">Address:</span>
              <span className="value">{client.address || '-'}</span>
            </div>
          </div>
        </div>

        <div className="enrollments-section">
          <h2>Program Enrollments</h2>
          
          {enrollments.length > 0 ? (
            <div className="enrollments-table">
              <table>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Status</th>
                    <th>Enrolled Date</th>
                    <th>Completed Date</th>
                    <th>Doctors Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map(enrollment => (
                    <tr key={enrollment.id}>
                      <td>{enrollment.program?.name || 'Unknown Program'}</td>
                      <td>
                        <span className={`status-badge ${enrollment.status}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td>{formatDate(enrollment.enrolledAt)}</td>
                      <td>{formatDate(enrollment.completedAt)}</td>
                      <td>{enrollment.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-enrollments">
              <p>This client is not enrolled in any programs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;