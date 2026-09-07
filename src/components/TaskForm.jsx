import React, { useState, useEffect } from 'react';

export default function TaskForm({ statuses, types, error }) {
  const [fileName, setFileName] = useState('Выбрать файл');
  const [hasFile, setHasFile] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('plan');

  useEffect(() => {
    const dateInput = document.getElementById('dueDate');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const todayStr = yyyy + '-' + mm + '-' + dd;

      if (selectedStatus !== 'completed') {
        dateInput.min = todayStr;
      } else {
        dateInput.removeAttribute('min');
      }
    }
  }, [selectedStatus]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileName('Файл прикреплен');
      setHasFile(true);
    } else {
      setFileName('Выбрать файл');
      setHasFile(false);
    }
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

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

      <form
        action="/add"
        method="POST"
        encType="multipart/form-data"
        id="taskForm"
      >
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
            <select id="status" name="statusId" onChange={handleStatusChange}>
              {Object.keys(statuses).map((key) => (
                <option key={key} value={key.toLowerCase()}>
                  {statuses[key].label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="dueDate">Дата завершения</label>
            <input type="date" id="dueDate" name="dueDate" required />
          </div>

          <div className="field">
            <label>Постер</label>
            <label
              htmlFor="file-upload"
              className={`file-label ${hasFile ? 'has-file' : ''}`}
              id="fileLabel"
            >
              <span id="fileName">{fileName}</span>
            </label>
            <input
              id="file-upload"
              type="file"
              name="poster"
              accept="image/*"
              onChange={handleFileChange}
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
