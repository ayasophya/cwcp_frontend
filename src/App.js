import logo from './logo.svg';
import './App.css';
import CategoriesList from './Components/Categories';
import ProductsList from './Components/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId/products" element={<ProductsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
