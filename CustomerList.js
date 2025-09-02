import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

function CustomerList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ city: '', state: '', pincode: '', search: '' });
  const navigate = useNavigate();

  const fetchCustomers = () => {
    const params = { page, limit, ...filters };
    api.get('/customers', { params })
      .then(res => {
        setData(res.data.data);
        setTotal(res.data.total);
      })
      .catch(err => alert('API error: ' + err));
  };

  useEffect(() => { fetchCustomers(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchCustomers();
  };

  const clearFilters = () => {
    setFilters({ city: '', state: '', pincode: '', search: '' });
    setPage(1);
    fetchCustomers();
  };

  return (
    <div>
      <div className="card">
        <form onSubmit={handleSearch} className="controls">
          <input placeholder="Search (name or phone)" value={filters.search} onChange={e=>setFilters({...filters, search: e.target.value})} />
          <input placeholder="City" value={filters.city} onChange={e=>setFilters({...filters, city: e.target.value})} />
          <input placeholder="State" value={filters.state} onChange={e=>setFilters({...filters, state: e.target.value})} />
          <input placeholder="Pincode" value={filters.pincode} onChange={e=>setFilters({...filters, pincode: e.target.value})} />
          <button type="submit">Filter</button>
          <button type="button" onClick={clearFilters}>Clear</button>
        </form>
      </div>

      <div className="card">
        <h3>Customers (Total: {total})</h3>
        {data.map(c=>(
          <div key={c.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <Link className="link" to={`/customers/${c.id}`}><strong>{c.firstName} {c.lastName}</strong></Link>
              <div className="muted">Phone: {c.phone} • {c.city}, {c.state} • {c.pincode}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>navigate(`/customers/${c.id}`)}>View</button>
            </div>
          </div>
        ))}

        <div style={{display:'flex', justifyContent:'space-between', marginTop:12}}>
          <div>Page {page}</div>
          <div>
            <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Prev</button>
            <button disabled={page*limit>=total} onClick={()=>setPage(p=>p+1)}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerList;
