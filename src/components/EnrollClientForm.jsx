import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './_EnrollClientForm.scss';

const EnrollmentPage = () => {
  // State for form data
  const [formData, setFormData] = useState({
    clientId: '',
    programId: '',
    status: 'active',
    notes: ''
  });
  
  // State for UI and data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch clients and programs on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch clients
        const clientsResponse = await fetch('http://localhost:3000/api/clients', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const clientsData = await clientsResponse.json();
        if (clientsResponse.ok) {
          setClients(clientsData.data);
        } else {
          throw new Error(clientsData.message || 'Failed to fetch clients');
        }

        // Fetch programs
        const programsResponse = await fetch('http://localhost:3000/api/programs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const programsData = await programsResponse.json();
        if (programsResponse.ok) {
          setPrograms(programsData.data);
        } else {
          throw new Error(programsData.message || 'Failed to fetch programs');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(error.message);
        setErrors({ fetch: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form inputs
  const validate = () => {
    const newErrors = {};
    if (!formData.clientId) newErrors.clientId = 'Client is required';
    if (!formData.programId) newErrors.programId = 'Program is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/enrollments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          clientId: parseInt(formData.clientId),
          programId: parseInt(formData.programId)
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Enrollment failed');

      // Show success toast
      toast.success('Successfully enrolled client in program!');
      console.log('New enrollment:', data.data);
      
      // Reset form
      setFormData({
        clientId: '',
        programId: '',
        status: 'active',
        notes: ''
      });

    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error(error.message);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter active programs
  const activePrograms = programs.filter(p => p.status === 'active');

  // Render loading state
  if (isLoading) {
    return (
      <div className="page-container">
        <h1>Client Enrollment</h1>
        <div className="loading">Loading clients and programs...</div>
      </div>
    );
  }

  // Render error state
  if (errors.fetch) {
    return (
      <div className="page-container">
        <h1>Client Enrollment</h1>
        <div className="error">Error: {errors.fetch}</div>
      </div>
    );
  }

  // Main render
  return (
    <div className="page-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h1>Client Enrollment</h1>

      <div className="enrollment-form-container">
        <h2>Enroll Client in Program</h2>
        
        <form onSubmit={handleSubmit} className="enrollment-form">
          <div className="form-group">
            <label>Client*</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className={errors.clientId ? 'error' : ''}
              disabled={clients.length === 0}
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name} ({client.id})
                </option>
              ))}
            </select>
            {errors.clientId && <span className="error-message">{errors.clientId}</span>}
            {clients.length === 0 && <span className="info-message">No clients available</span>}
          </div>

          <div className="form-group">
            <label>Program*</label>
            <select
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              className={errors.programId ? 'error' : ''}
              disabled={activePrograms.length === 0}
            >
              <option value="">Select Program</option>
              {activePrograms.map(program => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
            {errors.programId && <span className="error-message">{errors.programId}</span>}
            {activePrograms.length === 0 && <span className="info-message">No active programs available</span>}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional information about this enrollment"
            />
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting || clients.length === 0 || activePrograms.length === 0}
          >
            {isSubmitting ? 'Enrolling...' : 'Enroll Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentPage;