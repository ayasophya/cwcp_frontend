import logo from './logo.svg';
import './App.css';
import CategoriesList from './Pages/Categories';
import ProductsList from './Pages/Products';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId/products" element={<ProductsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
