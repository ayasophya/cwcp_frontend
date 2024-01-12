import './App.css';
import CategoriesList from './Pages/Categories';
import ProductsList from './Pages/Products';
import AdminPanel from './AdminPanel';
import Suppliers from './Components/Suppliers';
import SupplierDetails from './Components/SupplierDetails';
import OrdersList from './Components/Orders';
import InventoryList from './Components/Inventory';
import Reports from './Components/Reports';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';
import ProductSearchResult from './Pages/ProductSearchResult';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId/products" element={<ProductsList />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/inventory" element={<InventoryList />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />  
          <Route path="/categories/products/search-result/:query" element={<ProductsList />} />     
   
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
