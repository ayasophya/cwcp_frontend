import React, { useState } from 'react';
import '../styles/SidebarFilters.css';

const SidebarFilters = ({ setMaterial, setPosition, onApplyFilters }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMaterialChange = (e) => {
    setMaterial(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const applyFiltersHandler = () => {
    onApplyFilters();
  };
  return (
    <>
     <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="toggle-filters-btn">
      </button>
      <div className={`sidebar-filters ${isSidebarOpen ? 'open' : 'closed'}`}>
        <h3>Filters</h3>
        <div>
          <label htmlFor="material">Material</label>
          <select id="material" onChange={handleMaterialChange}>
  <option value="">Select Material</option>
  <option value="Metal">Metal</option>
  <option value="Plastic">Plastic</option>
  <option value="Rubber">Rubber</option>
  <option value="Glass">Glass</option>
  <option value="Ceramic">Ceramic</option>
  <option value="Wood">Wood</option>
  <option value="Composite">Composite</option>

</select>
        </div>
        <div>
          <label htmlFor="position">Position</label>
          <select id="position" onChange={handlePositionChange}>
  <option value="">Select Position</option>
  <option value="Front">Front</option>
  <option value="Rear">Rear</option>
  <option value="Left">Left</option>
  <option value="Right">Right</option>
  <option value="Top">Top</option>
  <option value="Bottom">Bottom</option>
  <option value="Interior">Interior</option>
  <option value="Exterior">Exterior</option>

</select>

        </div>
        <button className="apply-filters-btn" onClick={applyFiltersHandler}>Apply Filters</button>
      </div>
    </>
  );
};

export default SidebarFilters;
