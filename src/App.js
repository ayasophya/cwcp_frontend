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
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
