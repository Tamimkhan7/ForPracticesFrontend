import axiosInstance from './axiosInstance';

export const getProducts = (pageNumber, pageSize, searchValue, minValue, maxValue) =>
  axiosInstance.get('/Product', {
    params: { pageNumber, pageSize, searchValue, minValue, maxValue },
  });

export const createProduct = (data) => axiosInstance.post('/Product', data);
export const updateProduct = (id, data) => axiosInstance.put(`/Product/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/Product/${id}`);