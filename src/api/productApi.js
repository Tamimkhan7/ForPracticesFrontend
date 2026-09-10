import axiosInstance from './axiosInstance';

export const getProducts = (pageNumber, pageSize, searchValue, minValue, maxValue) =>
  axiosInstance.get('/Product', {
    params: { pageNumber, pageSize, searchValue, minValue, maxValue },
  });

export const getProductById = (id) => axiosInstance.get(`/Product/${id}`);

const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const createProduct = (data) =>  axiosInstance.post('/Product', toFormData(data), {
    headers: { 'Content-Type': undefined },
  });

export const updateProduct = (id, data) =>  axiosInstance.put(`/Product/${id}`, toFormData(data), {
    headers: { 'Content-Type': undefined },
  });

export const deleteProduct = (id) => axiosInstance.delete(`/Product/${id}`);