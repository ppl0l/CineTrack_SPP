import React from 'react';

export default function TaskCard({ item }) {
  const openModal = (imageSrc) => {
    if (!imageSrc) return;
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    if (modal && modalImg) {
      modal.classList.add('active');
      modalImg.src = imageSrc;
      document.body.style.overflow = 'hidden';
    }
  };

  return (
    <div className="card">
      <span className="status-pill">{item.status.label}</span>

      <div className="poster-wrapper" onClick={() => openModal(item.poster)}>
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
        <button type="submit" className="del-btn">
          Удалить
        </button>
      </form>
    </div>
  );
}
