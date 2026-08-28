import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

function AddProductPage() {
  const navigate = useNavigate();

  const handleProductCreated = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Product List
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Product</h1>
      <p className="text-sm text-gray-500 mb-6">
        Fill in the details below to add a product.
      </p>

      <ProductForm onProductCreated={handleProductCreated} />
    </div>
  );
}
// onProductCreated(response.data)

export default AddProductPage;