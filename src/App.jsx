// import React, { useState } from 'react';
// import CreateProgramForm from './components/CreateProgramForm';
// import RegisterClientForm from './components/RegisterClientForm';
// import EnrollmentPage from './components/EnrollClientForm';
// import SearchClientForm from './components/SearchClientForm';
// import ClientProfile from './components/ClientProfile';

// const App = () => {
//   const [programs, setPrograms] = useState([]);
//   const [clients, setClients] = useState([]);
//   const [selectedClient, setSelectedClient] = useState(null);

//   const handleCreateProgram = (newProgram) => {
//     setPrograms([...programs, newProgram]);
//   };

//   const handleRegisterClient = (newClient) => {
//     setClients([...clients, newClient]);
//   };

//   const handleEnrollClient = (clientId, program) => {
//     const updatedClients = clients.map((client) =>
//       client.clientId === clientId
//         ? { ...client, programs: [...client.programs, program] }
//         : client
//     );
//     setClients(updatedClients);
//   };

//   const handleSearchClient = (clientId) => {
//     const foundClient = clients.find((client) => client.clientId === clientId);
//     setSelectedClient(foundClient);
//   };

//   return (
//     <div>
//       <h2>Health Information System</h2>
//       <CreateProgramForm onProgramCreated={handleCreateProgram} />
//       <p>Available Programs: {programs.join(', ')}</p>
//       <RegisterClientForm onClientRegistered={handleRegisterClient} />
//       <EnrollmentPage clients={clients} programs={programs} onClientEnrolled={EnrollmentPage} />
//       <SearchClientForm onClientSearched={handleSearchClient} />
//       <ClientProfile client={selectedClient} />
//     </div>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import CreateProgramForm from './components/CreateProgramForm';
import RegisterClientForm from './components/RegisterClientForm';
import EnrollmentPage from './components/EnrollClientForm';
import SearchClientForm from './components/SearchClientForm';
import ClientProfile from './components/ClientProfile';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <ToastContainer />
        
        <nav className="main-nav">
          <h1>Health Information System</h1>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/create-program">Create Program</Link></li>
            <li><Link to="/register-client">Register Client</Link></li>
            <li><Link to="/enroll-client">Enroll Client</Link></li>
            <li><Link to="/search-clients">Client Search</Link></li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-program" element={<CreateProgramForm />} />
            <Route path="/register-client" element={<RegisterClientForm />} />
            <Route path="/enroll-client" element={<EnrollmentPage />} />
            <Route path="/search-clients" element={<SearchClientForm />} />
            <Route path="/clients/:id/profile" element={<ClientProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;