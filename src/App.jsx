import { Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
     <Routes>
      <Route path='/' element={<ProductListPage />} />
      <Route path='/add-product' element = {<AddProductPage />} />
      <Route path='/edit-product/:id' element= {<EditProductPage />} />
     </Routes>
    </div>
  )
}

export default App