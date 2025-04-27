import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrograms, setTotalPrograms] = useState(0);   // New state for total programs

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch total clients
        const clientsResponse = await fetch('https://cema-health-program.onrender.com/api/clients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch clients: ${clientsResponse.status}`);
        }
        const clientsData = await clientsResponse.json();
        setTotalClients(clientsData.data.length);

        // Fetch total enrollments
        const enrollmentsResponse = await fetch('https://cema-health-program.onrender.com/api/enrollments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!enrollmentsResponse.ok) {
          throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
        }
        const enrollmentsData = await enrollmentsResponse.json();
        setTotalEnrollments(enrollmentsData.data.length);

        // Fetch programs
        const programsResponse = await fetch('https://cema-health-program.onrender.com/api/programs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        const programsData = await programsResponse.json();

        // Set total number of programs
        if (Array.isArray(programsData.data)) {
          setTotalPrograms(programsData.data.length);
          // Count active programs
          // const activeCount = programsData.data.filter((program) => program.status === 'Active').length;
          // setActivePrograms(activeCount);
        } else {
          setTotalPrograms(0);
          setActivePrograms(0);
        }

      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{totalClients}</p>
          <Link to="/search-clients">View All</Link>
        </div>
     
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p>{totalEnrollments}</p>
          <Link to="/enroll-client">New Enrollment</Link>
        </div>
        <div className="stat-card"> {/* New card for total programs */}
          <h3>Total Programs</h3>
          <p>{totalPrograms}</p>
          <Link to="/create-program">Create Program</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/register-client" className="action-button">
            Register New Client
          </Link>
          <Link to="/enroll-client" className="action-button">
            Enroll Client in Program
          </Link>
          <Link to="/create-program" className="action-button">
            Create New Program
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;