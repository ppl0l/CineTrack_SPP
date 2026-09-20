import React from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ watchlist }) {
  return (
    <div className="grid">
      {watchlist.length === 0 ? (
        <p className="empty-state">Нет задач</p>
      ) : (
        watchlist.map((item) => <TaskCard key={item.id} item={item} />)
      )}
    </div>
  );
}
