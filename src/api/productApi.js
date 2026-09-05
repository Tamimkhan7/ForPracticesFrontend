import axiosInstance from './axiosInstance';

export const getProducts = () => axiosInstance.get('/Product');
export const createProduct = (data) => axiosInstance.post('/Product', data);
export const updateProduct = (id, data) => axiosInstance.put(`/Product/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/Product/${id}`);


