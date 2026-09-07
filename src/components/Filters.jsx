import React from 'react';

export default function Filters({ statuses, currentFilter }) {
  return (
    <div className="filters">
      <a
        href="/?statusFilter=all"
        className={currentFilter === 'all' ? 'active' : ''}
      >
        Все
      </a>
      {Object.keys(statuses).map((key) => {
        const status = statuses[key];
        return (
          <a
            key={status.id}
            href={`/?statusFilter=${status.id}`}
            className={currentFilter === status.id ? 'active' : ''}
          >
            {status.label}
          </a>
        );
      })}
    </div>
  );
}
