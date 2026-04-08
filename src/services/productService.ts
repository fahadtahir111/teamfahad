import apiClient from '@/lib/api-client';

export const productService = {
    async getAll() {
        const { data } = await apiClient.get('/products');
        return data;
    },

    async getById(id: string) {
        const { data } = await apiClient.get(`/products/${id}`);
        return data;
    },

    async getByCategory(categoryId: string) {
        const { data } = await apiClient.get(`/products?categoryId=${categoryId}`);
        return data;
    },

    async create(productData: any) {
        const { data } = await apiClient.post('/products', productData);
        return data;
    },

    async update(id: string, productData: any) {
        const { data } = await apiClient.put(`/products/${id}`, productData);
        return data;
    },

    async delete(id: string) {
        const { data } = await apiClient.delete(`/products/${id}`);
        return data;
    },
};
