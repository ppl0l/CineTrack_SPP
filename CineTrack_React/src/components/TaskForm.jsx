import React, { useState } from 'react';

const TODAY = new Date().toISOString().slice(0, 10);

export default function TaskForm({ statuses, types, error }) {
  const [fileName, setFileName] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('plan');

  return (
    <section className="add-form">
      {error && (
        <div className="message-box error">
          {error === 'past_date' &&
            'Для статуса не "Завершено" нельзя выбрать дату в прошлом'}
          {error === 'empty' && 'Пожалуйста, заполните все поля'}
          {error === 'file_too_large' && 'Файл слишком большой (макс. 5MB)'}
          {error === 'invalid_file' &&
            'Разрешены только изображения (JPG, PNG, GIF)'}
        </div>
      )}

      <form action="/add" method="POST" encType="multipart/form-data">
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">Название</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Введите название..."
              required
            />
          </div>

          <div className="field">
            <label htmlFor="type">Тип</label>
            <select id="type" name="type">
              <option value={types.MOVIE}>{types.MOVIE}</option>
              <option value={types.SERIES}>{types.SERIES}</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="status">Статус</label>
            <select
              id="status"
              name="statusId"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {Object.keys(statuses).map((key) => (
                <option key={key} value={key.toLowerCase()}>
                  {statuses[key].label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="dueDate">Дата завершения</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              min={selectedStatus !== 'completed' ? TODAY : undefined}
              required
            />
          </div>

          <div className="field">
            <label>Постер</label>
            <label
              htmlFor="file-upload"
              className={`file-label ${fileName ? 'has-file' : ''}`}
            >
              {fileName ? 'Файл прикреплен' : 'Выбрать файл'}
            </label>
            <input
              id="file-upload"
              type="file"
              name="poster"
              accept="image/*"
              onChange={(e) => setFileName(e.target.files[0]?.name || null)}
            />
          </div>

          <div className="btn-center">
            <button type="submit" className="btn-submit">
              Добавить
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
