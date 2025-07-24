// components/ContentCard.tsx
import React from 'react';
import type { Item } from '../store/slices/dataSlice';

const ContentCard: React.FC<{ item: Item }> = ({ item }) => {
  const pricingLabel =
    item.pricingOption === 1
      ? `$${item.price.toFixed(2)}`
      : item.pricingOption === 0
      ? 'Free'
      : 'View Only';

  return (
    <div className="card h-100">
      <img
        src={item.imagePath}
        className="card-img-top"
        alt={item.title}
        loading="lazy"
      />
      <div className="card-body">
        <h5 className="card-title">{item.title}</h5>
        <p className="card-text">By {item.creator}</p>
        <span className="badge bg-info">{pricingLabel}</span>
      </div>
    </div>
  );
};

export default ContentCard;