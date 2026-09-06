import axiosInstance from './axiosInstance';

export const getProducts = (pageNumber = 1, pageSize = 10) =>
  axiosInstance.get('/Product', {
    params: { pageNumber, pageSize },
  });

export const createProduct = (data) => axiosInstance.post('/Product', data);
export const updateProduct = (id, data) => axiosInstance.put(`/Product/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/Product/${id}`);