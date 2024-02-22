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
import EditEmployee from './Pages/EditEmployee';
import InventoryDetails from './Pages/InventoryDetails';
import AccountDetails from './Pages/AccountDetails';
import AdminProductDetails from "./Pages/AdminProductDetails";
import ShoppingCart from './Pages/ShoppingCart';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import EditProductForm from "./Pages/EditProductForm";
import { Analytics } from '@vercel/analytics/react';
import { ToastContainer } from 'react-toastify';
import EditAccount from './Pages/EditAccount';
import CheckoutPage from './Pages/Checkout';
import UserOrder from './Pages/UserOrder';
import OrderDetails from './Pages/OrderDetails';
import InventoryReports from './Pages/InventoryReport';
import ProductSalesReport from './Pages/ProductSalesReport';
import { AuthProvider, useAuth } from './Auth/AuthService';
import AccountManagement from './Pages/AccountManagement';
import AddressPage from './Pages/AddressPage'; 
import About from './Pages/AboutUs';

function App() {

  useEffect(() => {
    const expirationTime = new Date(new Date().getTime() + 10800000);
    if (!Boolean(Cookies.get('isAuthenticated'))) {
        if(!Cookies.get('sessionId'))
          Cookies.set("sessionId", uuidv4(), {expires: expirationTime})
    }
  }, [])

  const userRoles = () => {
    if (Cookies.get('accessPermission') === undefined) {
        return []
    }
    return Cookies.get('accessPermission')
  }
  const [role, setRole] = useState(() => {
    return (
        Cookies.get('accessPermission')
    )
  })
  useEffect(() => {
    setRole(Cookies.get('accessPermission'))
}, [role])

  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId/products" element={<ProductsList />} />
          {role === 'Admin' &&
          <Route path="/admin" element={<AdminPanel />} />}
          {role === 'Admin' &&
          <Route path="/admin/suppliers" element={<Suppliers />} />}
          {role === 'Admin' &&
          <Route path="/admin/orders" element={<OrdersList />} />}
          {role === 'Admin' &&
          <Route path="/admin/orders/:orderId" element={<OrderDetails />} />}
          {role === 'Admin' &&
          <Route path="/admin/inventory" element={<InventoryList />} />}
          {role === 'Admin' &&
          <Route path="/admin/reports" element={<Reports />} />}
          {role === 'Admin' &&
          <Route path="/admin/reports/inventoryReport" element={<InventoryReports />} />}
          {role === 'Admin' &&
          <Route path="/admin/reports/productSales" element={<ProductSalesReport />} />}
           {role === 'Admin' &&
          <Route path="/admin/employees" element={<Employees />} />}
          {role === 'Admin' &&
          <Route path="/admin/addEmployee" element={<AddEmployee />} />}
          {role === 'Admin' &&
          <Route path="/admin/editEmployee/:employeeId" element={<EditEmployee />} />}
          {role === 'Admin' &&
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />}
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />  
          <Route path="/categories/products/search-result/:query" element={<ProductsList />} />     
          {role === 'Admin' &&
          <Route path="/admin/inventory/:categoryId/products" element={<InventoryDetails />} />}
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />
          <Route path="/user/accountDetails/:userId" element={<AccountDetails />} />
          <Route path="/user/shopping-cart" element={<ShoppingCart />} />
          <Route path="/user/shopping-cart/:cartId/checkout" element={<CheckoutPage />} />
          <Route path="/user/transactions" element={<UserOrder />} />
          {role === 'Admin' &&
          <Route path="/admin/categories/:categoryId/products/:productId" element={<AdminProductDetails />} />}
          {role === 'Admin' &&
          <Route path="/admin/categories/:categoryId/products/:productId/edit" element={<EditProductForm />} />}
          <Route path="/user/editAccount/:userId" element={<EditAccount />} />
          <Route path="/user/account-management" element={<AccountManagement />} />
          <Route path="/user/address/:userId" element={<AddressPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      <Analytics />
      </div>
      </BrowserRouter>
      </AuthProvider>

  );
}

export default App;
