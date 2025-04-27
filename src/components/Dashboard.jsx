import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const Dashboard = () => {
  const [totalClients, setTotalClients] = useState(0);
  const [totalEnrollments, setTotalEnrollments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePrograms, setActivePrograms] = useState(0); // Add state for active programs


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch total clients
        const clientsResponse = await fetch('http://localhost:3000/api/clients', {
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
        const enrollmentsResponse = await fetch('http://localhost:3000/api/enrollments', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!enrollmentsResponse.ok) {
          throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
        }
        const enrollmentsData = await enrollmentsResponse.json();
        setTotalEnrollments(enrollmentsData.data.length);

        // Fetch active programs.
        const programsResponse = await fetch('http://localhost:3000/api/programs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }
        const programsData = await programsResponse.json();
        // Check if programsData.data is an array before filtering
        const activeCount = Array.isArray(programsData.data)
          ? programsData.data.filter((program) => program.status === 'Active').length
          : 0;
        setActivePrograms(activeCount);


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
          <h3>Active Programs</h3>
          <p>{activePrograms}</p>
          <Link to="/create-program">Manage</Link>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p>{totalEnrollments}</p>
          <Link to="/enroll-client">New Enrollment</Link>
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
