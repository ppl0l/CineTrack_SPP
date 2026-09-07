import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ watchlist }) {
  if (watchlist.length === 0) {
    return (
      <div className="grid">
        <div
          style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '48px 0',
            color: 'var(--text-sec)',
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Нет задач</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid">
      {watchlist.map((item) => (
        <TaskCard key={item.id} item={item} />
      ))}
    </div>
  );
}
