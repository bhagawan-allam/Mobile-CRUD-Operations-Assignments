import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

function CustomerForm() {
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', city:'', state:'', pincode:'' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic client-side validation
    if (!form.firstName || !form.lastName || !form.phone) {
      alert('First name, last name and phone are required');
      return;
    }
    api.post('/customers', form)
      .then(res => {
        alert('Customer created (id:'+res.data.id+')');
        navigate('/');
      })
      .catch(err => alert('Error: ' + (err.response?.data?.error || err.message)));
  };

  return (
    <div className="card">
      <h3>Create Customer</h3>
      <form onSubmit={handleSubmit}>
        <input placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} required />
        <input placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} required />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} required />
        <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} />
        <input placeholder="State" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} />
        <input placeholder="Pincode" value={form.pincode} onChange={e=>setForm({...form, pincode: e.target.value})} />
        <div style={{display:'flex', gap:8}}>
          <button type="submit">Save</button>
          <button type="button" onClick={()=>navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CustomerForm;
