import React, { useState } from 'react';
import './_RegisterClientForm.scss';

// Custom Toast Components
const Toast = ({ message, type, onClose }) => (
  <div className={`toast ${type}`}>
    <span>{message}</span>
    <button onClick={onClose} className="toast-close">
      &times;
    </button>
  </div>
);

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}
  </div>
);

const RegisterClientForm = ({ onClientRegistered }) => {
  const [newClient, setNewClient] = useState({
    name: '',
    age: '',
    gender: '',
    clientId: '',
    dateOfBirth: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newClient.name.trim() || !newClient.clientId.trim()) {
      addToast('Name and Client ID are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient),
      });

      if (response.ok) {
        const data = await response.json();
        addToast('Client registered successfully!', 'success');
        onClientRegistered(data.data);
        setNewClient({
          name: '',
          age: '',
          gender: '',
          clientId: '',
          dateOfBirth: '',
        });
      } else {
        const errorData = await response.json();
        addToast(errorData?.message || 'Failed to register client', 'error');
      }
    } catch (error) {
      console.error('Error registering client:', error);
      addToast('Network error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))} />
      <div className="form-card">
        <h2 className="form-title">Register New Client</h2>
        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newClient.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter client's full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientId" className="form-label">Client ID*</label>
              <input
                type="text"
                id="clientId"
                name="clientId"
                value={newClient.clientId}
                onChange={handleChange}
                className="form-input"
                placeholder="Unique client identifier"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age" className="form-label">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={newClient.age}
                onChange={handleChange}
                className="form-input"
                placeholder="Age in years"
                min="0"
                max="120"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender" className="form-label">Gender</label>
              <select
                id="gender"
                name="gender"
                value={newClient.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={newClient.dateOfBirth}
                onChange={handleChange}
                className="form-input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Client'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterClientForm;
