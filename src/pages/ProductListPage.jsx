import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/productApi';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts(pageNumber, pageSize);
        const data = response.data;

        setProducts(data.items ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? 0);
      } catch (err) {
        setError('Could not load products. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      await deleteProduct(id);
     
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        if (updated.length === 0 && pageNumber > 1) {
          setPageNumber((p) => p - 1);
        }
        return updated;
      });
      setTotalCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      alert('Could not delete product.');
      console.error(err);
    }
  };

  const handlePrev = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPageNumber((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Product List</h1>
        <button
          onClick={() => navigate('/add-product')}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        All products currently in inventory
        {totalCount > 0 && ` (${totalCount} total)`}.
      </p>

      {loading && <p className="text-gray-500">Loading products...</p>}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 p-10">
          No products yet. Click "+ Add Product" to create one.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col"
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {product.productName}
                </h2>
                <p className="text-gray-500 text-sm mt-1 mb-3 flex-grow">
                  {product.productDescription}
                </p>

                <div className="flex justify-between text-sm mb-4">
                  <span className="font-medium text-gray-900">
                    ৳{product.productPrice}
                  </span>
                  <span className="text-gray-500">Qty: {product.productQuantity}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                    className="flex-1 text-sm font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 text-sm font-medium bg-red-50 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={pageNumber <= 1}
              className="text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {pageNumber} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={pageNumber >= totalPages}
              className="text-sm font-medium bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProductListPage;