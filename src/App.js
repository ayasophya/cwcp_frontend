import './App.css';
import CategoriesList from './Components/Categories';
import ProductsList from './Components/Products';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import AdminPanel from './AdminPanel';
import Suppliers from './Components/Suppliers';
import SupplierDetails from './Components/SupplierDetails';
import OrdersList from './Components/Orders';
import InventoryList from './Components/Inventory';
import Reports from './Components/Reports';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId/products" element={<ProductsList />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/admin/orders" element={<OrdersList />} />
          <Route path="/admin/inventory" element={<InventoryList />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />

        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
