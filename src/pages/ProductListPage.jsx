import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../api/productApi';
import FileThumbnail from '../components/FileThumbnail';
import { resolveFileUrl } from '../utils/fileHelpers';

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokenImages, setBrokenImages] = useState(() => new Set());
  const navigate = useNavigate();

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const [debouncedMin, setDebouncedMin] = useState("");
  const [debouncedMax, setDebouncedMax] = useState("");
  const [priceError, setPriceError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setPageNumber(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        minValue !== "" &&
        maxValue !== "" &&
        Number(minValue) > Number(maxValue)
      ) {
        setPriceError("Min price can't be greater than max price.");
        return;
      }
      setPriceError("");
      setDebouncedMin(minValue);
      setDebouncedMax(maxValue);
      setPageNumber(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [minValue, maxValue]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProducts(
          pageNumber,
          pageSize,
          debouncedSearch,
          debouncedMin === "" ? undefined : debouncedMin,
          debouncedMax === "" ? undefined : debouncedMax
        );
        const data = response.data;

        setProducts(data.items ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotalCount(data.totalCount ?? 0);
        setBrokenImages(new Set());
      } catch (err) {
        setError('Could not load products. Is the backend running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pageNumber, pageSize, debouncedSearch, debouncedMin, debouncedMax]);

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

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleClearPriceFilter = () => {
    setMinValue("");
    setMaxValue("");
  };

  const markImageBroken = (id) => {
    setBrokenImages((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
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
      <p className="text-sm text-gray-500 mb-4">
        All products currently in inventory
        {totalCount > 0 && ` (${totalCount} total)`}.
      </p>

      <div className="relative mb-3">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search products by name..."
          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchValue && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">TK</label>
          <input
            type="number"
            min="0"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            placeholder="Min price"
            className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <span className="text-gray-400 text-sm">to</span>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">TK</label>
          <input
            type="number"
            min="0"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            placeholder="Max price"
            className="w-28 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {(minValue || maxValue) && (
          <button
            onClick={handleClearPriceFilter}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear price filter
          </button>
        )}
      </div>
      {priceError && (
        <p className="text-sm text-red-600 mb-2">{priceError}</p>
      )}

      <div className="mb-6" />

      {loading && <p className="text-gray-500">Loading products...</p>}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300 p-10">
          {debouncedSearch || debouncedMin || debouncedMax
            ? 'No products match the current filters.'
            : 'No products yet. Click "+ Add Product" to create one.'}
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const resolvedUrl = resolveFileUrl(product.imageUrl);
              const showFile = resolvedUrl && !brokenImages.has(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col"
                >
                  {showFile ? (
                    <FileThumbnail
                      url={resolvedUrl}
                      name={product.productName}
                      sizeClass="h-36 w-full"
                      className="mb-3"
                      onImageError={() => markImageBroken(product.id)}
                    />
                  ) : (
                    <div className="w-full h-36 rounded-md mb-3 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                      No file
                    </div>
                  )}

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
              );
            })}
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