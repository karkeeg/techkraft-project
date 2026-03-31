import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';

const MOCK_PROPERTIES = [
  { id: '1', title: 'Modern Villa', location: 'Baluwatar, Kathmandu', price: 'Rs. 5,50,00,000', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop' },
  { id: '2', title: 'Luxury Apartment', location: 'Sanepa, Lalitpur', price: 'Rs. 3,20,00,000', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
  { id: '3', title: 'Traditional House', location: 'Bhaktapur', price: 'Rs. 1,80,00,000', image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1965&auto=format&fit=crop' },
  { id: '4', title: 'Lake View Resort', location: 'Lakeside, Pokhara', price: 'Rs. 8,50,00,000', image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop' }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/favourites')
      .then(res => setFavourites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFavourite = async (propertyId) => {
    const isFavourite = favourites.includes(propertyId);
    try {
      if (isFavourite) {
        await api.delete(`/favourites/${propertyId}`);
        setFavourites(prev => prev.filter(id => id !== propertyId));
        toast.success('Removed from favourites');
      } else {
        await api.post(`/favourites/${propertyId}`);
        setFavourites(prev => [...prev, propertyId]);
        toast.success('Added to favourites');
      }
    } catch (err) {
      toast.error('Action failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1>Welcome, {user.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>Role: <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/qr-receive" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
            <span style={{ border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>QR Upload</span>
          </Link>
          <a href="#favourites" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>
            Your Favourites <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.8rem', marginLeft: '0.3rem' }}>{favourites.length}</span>
          </a>
          <button onClick={logout} style={{ background: 'var(--surface)', color: 'var(--text)' }}>Log Out</button>
        </div>
      </header>

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Available Properties</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {MOCK_PROPERTIES.map(prop => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              isFavourite={favourites.includes(prop.id)}
              onToggleFavourite={toggleFavourite}
            />
          ))}
        </div>
      </section>

      {favourites.length > 0 && (
        <section id="favourites" style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Your Favourites</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {MOCK_PROPERTIES.filter(p => favourites.includes(p.id)).map(prop => (
              <PropertyCard 
                key={prop.id} 
                property={prop} 
                isFavourite={true}
                onToggleFavourite={toggleFavourite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
