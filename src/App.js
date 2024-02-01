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
import { ToastContainer } from 'react-toastify';

function App() {

  useEffect(() => {
    const expirationTime = new Date(new Date().getTime() + 10800000);
    if (!Boolean(Cookies.get('isAuthenticated'))) {
        console.log("trying...")
        if(!Cookies.get('sessionId'))
          Cookies.set("sessionId", uuidv4(), {expires: expirationTime})
    }
    console.log('sessionid: ' + Cookies.get('sessionId'))
  }, [])

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
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
          <Route path="/admin/editEmployee/:employeeId" element={<EditEmployee />} />
          <Route path="/suppliers/:supplierId" element={<SupplierDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />  
          <Route path="/categories/products/search-result/:query" element={<ProductsList />} />     
          <Route path="/admin/inventory/:categoryId/products" element={<InventoryDetails />} />
          <Route path="/categories/:categoryId/products/:productId" element={<ProductDetails />} />
          <Route path="/user/accountDetails/:userId" element={<AccountDetails />} />
          <Route path="/user/shopping-cart" element={<ShoppingCart />} />
          <Route path="/admin/categories/:categoryId/products/:productId" element={<AdminProductDetails />} />
          <Route path="/admin/categories/:categoryId/products/:productId/edit" element={<EditProductForm />} />
        </Routes>
      </div>
      </BrowserRouter>
  );
}

export default App;
