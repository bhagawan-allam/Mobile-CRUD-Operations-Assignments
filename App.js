import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import CustomerProfile from './components/CustomerProfile';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Customer CRUD App</h1>
          <nav>
            <Link to="/">Customers</Link>
            <Link to="/create">Add Customer</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<CustomerList />} />
            <Route path="/create" element={<CustomerForm />} />
            <Route path="/customers/:id" element={<CustomerProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
