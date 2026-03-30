import React from 'react';
import { Heart } from 'lucide-react';

const PropertyCard = ({ property, isFavourite, onToggleFavourite }) => {
  return (
    <div className="glass" style={{ overflow: 'hidden', padding: '0', display: 'flex', flexDirection: 'column' }}>
      <img 
        src={property.image} 
        alt={property.title} 
        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
      />
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>{property.title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{property.location}</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--primary)' }}>{property.price}</span>
          <button 
            onClick={() => onToggleFavourite(property.id)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: isFavourite ? 'var(--error)' : 'var(--surface)', 
              color: isFavourite ? 'white' : 'var(--text)',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem'
            }}
          >
            <Heart size={14} fill={isFavourite ? "currentColor" : "none"} strokeWidth={2} />
            {isFavourite ? 'Favourite' : 'Add Favourite'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
