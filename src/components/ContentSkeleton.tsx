// components/ContentSkeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // import styles

const ContentSkeleton: React.FC = () => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
    <div className="card h-100">
      <Skeleton height={180} /> {/* Assuming typical card image height */}
      <div className="card-body">
        <Skeleton width="80%" height={20} className="mb-2" /> {/* Title */}
        <Skeleton width="60%" height={16} /> {/* Creator */}
        <Skeleton width="40%" height={16} className="mt-1" /> {/* Pricing */}
      </div>
    </div>
  </div>
);

export default ContentSkeleton;