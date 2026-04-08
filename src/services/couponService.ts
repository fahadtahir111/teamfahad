import apiClient from '@/lib/api-client';

export const couponService = {
    async getAll() {
        const { data } = await apiClient.get('/coupons');
        return data;
    },

    async validate(code: string, cartTotal: number) {
        const { data } = await apiClient.post('/coupons/validate', { code, cartTotal });
        return data;
    },

    async create(couponData: any) {
        const { data } = await apiClient.post('/coupons', couponData);
        return data;
    },

    async update(id: string, couponData: any) {
        const { data } = await apiClient.put(`/coupons/${id}`, couponData);
        return data;
    },

    async delete(id: string) {
        const { data } = await apiClient.delete(`/coupons/${id}`);
        return data;
    }
};
