import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Suppliers from './Suppliers';

const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/admin/suppliers" element={<Suppliers />} />
      </Routes>
    </div>
  );
};

export default Content;
