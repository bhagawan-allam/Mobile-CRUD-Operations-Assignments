import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressForm from './AddressForm';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

function CustomerProfile() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const navigate = useNavigate();

  const fetch = () => {
    api.get('/customers/' + id).then(res => setCustomer(res.data)).catch(err => alert(err));
  };

  useEffect(()=>{ fetch(); }, [id]);

  const handleUpdate = () => {
    api.put('/customers/' + id, form).then(()=>{ alert('Updated'); setEditing(false); fetch(); }).catch(e=>alert(e));
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this customer? (will fail if addresses exist)')) return;
    api.delete('/customers/' + id).then(()=>{ alert('Deleted'); navigate('/'); }).catch(e=>alert(e.response?.data?.error || e.message));
  };

  const handleToggleOnlyOne = () => {
    api.put('/customers/' + id + '/only-one', { onlyOne: customer.onlyOneAddress ? 0 : 1 })
      .then(()=> fetch())
      .catch(e=>alert(e));
  };

  const openAddAddress = () => { setAddressToEdit(null); setShowAddressForm(true); };
  const openEditAddress = (addr) => { setAddressToEdit(addr); setShowAddressForm(true); };

  const onAddressSaved = () => { setShowAddressForm(false); fetch(); };
  const deleteAddress = (addrId) => {
    if (!window.confirm('Delete address?')) return;
    api.delete('/addresses/' + addrId).then(()=>fetch()).catch(e=>alert(e));
  };

  if (!customer) return <div>Loading...</div>;

  return (
    <div>
      <div className="card">
        <h3>{customer.firstName} {customer.lastName}</h3>
        {editing ? (
          <div>
            <input value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} />
            <input value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} />
            <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />
            <div style={{display:'flex', gap:8}}>
              <button onClick={handleUpdate}>Save</button>
              <button onClick={()=>setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p>Phone: {customer.phone}</p>
            <p>{customer.city}, {customer.state} • {customer.pincode}</p>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>{ setForm({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone }); setEditing(true); }}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={handleToggleOnlyOne}>{customer.onlyOneAddress ? 'Unset Only One Address' : 'Mark Only One Address'}</button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h4>Addresses</h4>
        <button onClick={openAddAddress}>Add Address</button>
        {customer.addresses.length===0 && <p className="muted">No addresses</p>}
        {customer.addresses.map(a=>(
          <div key={a.id} className="address-item">
            <div><strong>{a.address}</strong></div>
            <div className="muted">{a.city}, {a.state} • {a.pincode}</div>
            <div style={{display:'flex', gap:8, marginTop:6}}>
              <button onClick={()=>openEditAddress(a)}>Edit</button>
              <button onClick={()=>deleteAddress(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showAddressForm && (
        <AddressForm customerId={customer.id} address={addressToEdit} onSaved={onAddressSaved} onCancel={()=>setShowAddressForm(false)} />
      )}
    </div>
  );
}

export default CustomerProfile;
