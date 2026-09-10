import { useState, useEffect } from 'react';
import { createProduct } from '../api/productApi';
import FileThumbnail from './FileThumbnail';
import { ACCEPTED_FILE_TYPES } from '../utils/fileHelpers';

const MAX_FILE_SIZE_MB = 5;

function ProductForm({ onProductCreated }) {
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productQuantity: '',
  });
  const [file, setFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Avoid leaking object URLs created for local previews
  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0] || null;
    setFileError(null);

    if (!selected) {
      setFile(null);
      setFilePreviewUrl(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File must be smaller than ${MAX_FILE_SIZE_MB}MB.`);
      setFile(null);
      setFilePreviewUrl(null);
      e.target.value = '';
      return;
    }

    setFile(selected);
    setFilePreviewUrl(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) return;

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        productName: formData.productName,
        productDescription: formData.productDescription,
        productPrice: Number(formData.productPrice),
        productQuantity: Number(formData.productQuantity),
        image: file || undefined,
      };

      const response = await createProduct(payload);
      onProductCreated(response.data);

      setFormData({
        productName: '',
        productDescription: '',
        productPrice: '',
        productQuantity: '',
      });
      setFile(null);
      setFilePreviewUrl(null);
    } catch (err) {
      setError('Could not create product. Check your input.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          name="productDescription"
          value={formData.productDescription}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (৳)
          </label>
          <input
            type="number"
            name="productPrice"
            value={formData.productPrice}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            name="productQuantity"
            value={formData.productQuantity}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product File (image, PDF, DOC or DOCX)
        </label>
        <input
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded-md w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {fileError && (
          <p className="text-xs text-red-600 mt-1">{fileError}</p>
        )}
        {filePreviewUrl && (
          <div className="mt-3">
            <FileThumbnail url={filePreviewUrl} name={file.name} sizeClass="h-28 w-28" clickable={false} />
            <p className="text-[11px] text-gray-500 mt-1">{file.name}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting || !!fileError}
        className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {submitting ? 'Adding...' : 'Add Product'}
      </button>
    </form>
  );
}

export default ProductForm;