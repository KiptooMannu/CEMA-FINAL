
import React, { useState, useEffect } from 'react';
import './_CreateProgramForm.scss';
import 'react-toastify/dist/ReactToastify.css';

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      <span>{message}</span>
      <button onClick={onClose} className="toast-close">
        &times;
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
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
};

const CreateProgramForm = ({ onProgramCreated }) => {
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Function to add toast messages
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Function to remove toast by ID
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProgram((prevProgram) => ({
      ...prevProgram,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newProgram.name.trim()) {
      addToast('Program name cannot be empty', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProgram.name,
          description: newProgram.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        addToast('Program created successfully!', 'success');
        onProgramCreated(data.data);
        setNewProgram({ name: '', description: '' });
      } else {
        const errorData = await response.json();
        addToast(errorData?.message || 'Failed to create program', 'error');
      }
    } catch (err) {
      addToast('Network error occurred', 'error');
      console.error('Error creating program:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // UseEffect to auto-remove toasts after 3 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <div className="form-container">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="form-card">
        <h2 className="form-title">Create Health Program</h2>
        <form onSubmit={handleSubmit} className="program-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Program Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={newProgram.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter program name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={newProgram.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter program description"
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Program'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramForm;
