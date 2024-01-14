import './App.css';
import CategoriesList from './Pages/Categories';
import ProductsList from './Pages/Products';
import AdminPanel from './Pages/AdminPanel';
import Suppliers from './Pages/Suppliers';
import SupplierDetails from './Pages/SupplierDetails';
import OrdersList from './Pages/Orders';
import InventoryList from './Pages/Inventory';
import Reports from './Pages/Reports';
import Employees from './Pages/Employees';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductDetails from './Pages/ProductDetails';
import AddEmployee from './Pages/AddEmployee';
import InventoryDetails from './Pages/InventoryDetails';
import AdminProductDetails from "./Pages/AdminProductDetails";

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
          <Route path="/admin/employees" element={<Employees />} />
          <Route path="/admin/addEmployee" element={<AddEmployee />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />  
          <Route path="/categories/products/search-result/:query" element={<ProductsList />} />     
          <Route path="/admin/inventory/:categoryId/products" element={<InventoryDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />
          <Route path="/admin/categories/:categoryId/products/:productId" element={<AdminProductDetails />} />
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
