import React, { useEffect, useState } from 'react';

export default function ImageModal() {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const open = (e) => {
      const img = e.target.closest('.poster-wrapper img');
      if (img) setSrc(img.src);
    };
    const close = (e) => {
      if (e.key === 'Escape') setSrc(null);
    };

    document.addEventListener('click', open);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('click', open);
      document.removeEventListener('keydown', close);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = src ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [src]);

  if (!src) return null;

  return (
    <div className="modal active" onClick={() => setSrc(null)}>
      <button className="modal-close" onClick={() => setSrc(null)}>
        &times;
      </button>
      <img
        className="modal-content"
        src={src}
        alt="Полное изображение"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
