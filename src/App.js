import './App.css';
import CategoriesList from './Pages/Categories';
import ProductsList from './Pages/Products';
import AdminPanel from './Pages/AdminPanel';
import Suppliers from './Pages/Suppliers';
import SupplierDetails from './Pages/SupplierDetails';
import OrdersList from './Pages/Orders';
import InventoryList from './Pages/Inventory';
import Reports from './Pages/Reports';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';
import InventoryDetails from './Pages/InventoryDetails';
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
          <Route path="/admin/inventory/:categoryId/products" element={<InventoryDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
