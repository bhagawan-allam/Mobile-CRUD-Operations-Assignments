import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

function AddressForm({ customerId, address, onSaved, onCancel }) {
  const [form, setForm] = useState({
    address: address?.address || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || ''
  });

  const handleSave = () => {
    if (!form.address) { alert('Address required'); return; }
    if (address && address.id) {
      api.put('/addresses/' + address.id, form).then(()=>{ onSaved(); }).catch(e=>alert(e));
    } else {
      api.post('/addresses', { customerId, ...form }).then(()=>{ onSaved(); }).catch(e=>alert(e));
    }
  };

  return (
    <div className="card">
      <h4>{address ? 'Edit' : 'Add'} Address</h4>
      <input placeholder="Address" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
      <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} />
      <input placeholder="State" value={form.state} onChange={e=>setForm({...form, state: e.target.value})} />
      <input placeholder="Pincode" value={form.pincode} onChange={e=>setForm({...form, pincode: e.target.value})} />
      <div style={{display:'flex', gap:8}}>
        <button onClick={handleSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

export default AddressForm;
