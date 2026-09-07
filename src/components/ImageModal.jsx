import React, { useEffect } from 'react';

export default function ImageModal() {
  useEffect(() => {
    const modal = document.getElementById('imageModal');
    const closeModal = () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    };

    const handleClick = (e) => {
      if (e.target === modal) {
        closeModal();
      }
    };

    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      modal.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div id="imageModal" className="modal">
      <button
        className="modal-close"
        onClick={() => {
          const modal = document.getElementById('imageModal');
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }}
      >
        &times;
      </button>
      <img
        id="modalImage"
        className="modal-content"
        src=""
        alt="Полное изображение"
      />
    </div>
  );
}
