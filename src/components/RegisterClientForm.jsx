import React, { useState } from 'react';
import './_RegisterClientForm.scss';

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
    firstName: '',
    lastName: '',
    dateOfBirth: new Date().toISOString().split('T')[0],
    gender: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value // Use the input's name directly to update state
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trim all inputs first
    const trimmedData = {
      firstName: newClient.firstName.trim(),
      lastName: newClient.lastName.trim(),
      dateOfBirth: newClient.dateOfBirth,
      gender: newClient.gender,
      address: newClient.address.trim(),
      phone: newClient.phone.trim(),
      email: newClient.email.trim()
    };

    // Validate required fields
    if (!trimmedData.firstName || !trimmedData.lastName) {
      addToast('First name and last name are required', 'error');
      return;
    }

    // Validate email format if provided
    if (trimmedData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedData.email)) {
      addToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload with EXACT field names expected by backend
      const payload = {
        first_name: trimmedData.firstName, // lowercase to match DB
        last_name: trimmedData.lastName,   // lowercase to match DB
        dateOfBirth: trimmedData.dateOfBirth || null,
        gender: trimmedData.gender || null,
        address: trimmedData.address || null,
        phone: trimmedData.phone || null,
        email: trimmedData.email || null
      };

      console.log('Submitting payload:', payload); // Debug log

      const response = await fetch('https://cema-health-program.onrender.com/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other required headers here
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Backend error response:', responseData);
        throw new Error(responseData.message || `Registration failed with status ${response.status}`);
      }

      addToast('Client registered successfully!', 'success');

      // Callback with registered client data
      if (onClientRegistered) {
        onClientRegistered(responseData.data);
      }

      // Reset form
      setNewClient({
        firstName: '',
        lastName: '',
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: '',
        address: '',
        phone: '',
        email: ''
      });

    } catch (error) {
      console.error('Registration error:', error);
      addToast(error.message || 'Failed to register client. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="form-card">
        <h2 className="form-title">Register New Client</h2>
        <form onSubmit={handleSubmit} className="client-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First Name*</label>
              <input
                type="text"
                id="firstName"
                name="firstName" // Changed to match state key
                value={newClient.firstName}
                onChange={handleChange}
                className="form-input"
                placeholder="First name"
                required
                minLength={1}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName" className="form-label">Last Name*</label>
              <input
                type="text"
                id="lastName"
                name="lastName" // Changed to match state key
                value={newClient.lastName}
                onChange={handleChange}
                className="form-input"
                placeholder="Last name"
                required
                minLength={1}
              />
            </div>
          </div>

          <div className="form-row">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={newClient.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newClient.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              value={newClient.address}
              onChange={handleChange}
              className="form-input"
              placeholder="Full address"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Registering...
              </>
            ) : (
              'Register Client'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterClientForm;