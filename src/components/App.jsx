import React from 'react';
import Header from './Header';
import Footer from './Footer';
import TaskForm from './TaskForm';
import Filters from './Filters';
import TaskList from './TaskList';
import ImageModal from './ImageModal';

export default function App(props) {
  const { watchlist, statuses, types, currentFilter, error } = props;

  return (
    <>
      <Header />
      <main className="container">
        <TaskForm statuses={statuses} types={types} error={error} />
        <Filters statuses={statuses} currentFilter={currentFilter} />
        <TaskList watchlist={watchlist} />
      </main>
      <ImageModal />
      <Footer />
    </>
  );
}
