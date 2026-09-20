import React from 'react';

export default function TaskCard({ item }) {
  return (
    <div className="card">
      <span className="status-pill">{item.status.label}</span>

      <div className="poster-wrapper">
        {item.poster ? (
          <img src={item.poster} alt={item.title} />
        ) : (
          <div className="no-poster">Нет постера</div>
        )}
      </div>

      <div className="info">
        <div className="type">{item.type}</div>
        <h3>{item.title}</h3>
        <div className="date">Дата: {item.dueDate}</div>
      </div>

      <form action={`/delete/${item.id}`} method="POST">
        <button type="submit" className="del-btn">Удалить</button>
      </form>
    </div>
  );
}
