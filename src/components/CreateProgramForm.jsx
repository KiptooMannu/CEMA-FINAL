import React, { useState, useEffect } from 'react';
import './_CreateProgramForm.scss';
import 'react-toastify/dist/ReactToastify.css';

const CreateProgramForm = ({ onProgramCreated }) => {
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
  });
  const [programs, setPrograms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Fetch programs on component mount
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('https://cema-health-program.onrender.com/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      addToast('Failed to load programs', 'error');
    }
  };

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
    setNewProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!newProgram.name.trim()) {
      addToast('Program name is required', 'error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://cema-health-program.onrender.com/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      });

      const data = await response.json();
      
      if (response.ok) {
        addToast('Program created successfully!', 'success');
        setNewProgram({ name: '', description: '' });
        fetchPrograms(); // Refresh the programs list
      } else {
        throw new Error(data.message || 'Failed to create program');
      }
    } catch (err) {
      addToast(err.message, 'error');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="programs-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="toast-close">
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Create Program Form */}
      <div className="form-card">
        <h2>Create Health Program</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Program Name*</label>
            <input
              type="text"
              name="name"
              value={newProgram.name}
              onChange={handleChange}
              placeholder="Enter program name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={newProgram.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Program'}
          </button>
        </form>
      </div>

      {/* Programs Table */}
      <div className="programs-table-container">
        <h2>Available Programs</h2>
        
        {programs.length > 0 ? (
          <table className="programs-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id}>
                  <td>{program.name}</td>
                  <td>{program.description || '-'}</td>
                  <td className={`status ${program.status}`}>
                    {program.status}
                  </td>
                  <td>{new Date(program.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-programs">No programs available yet</p>
        )}
      </div>
    </div>
  );
};

export default CreateProgramForm;