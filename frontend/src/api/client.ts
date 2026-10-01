import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const recipeApi = {
  list: () => apiClient.get('/api/recipes'),
  get: (id: number) => apiClient.get(`/api/recipes/${id}`),
  create: (data: { title: string; description?: string; ingredients: string; instructions: string; image_url?: string; prep_time?: number; servings?: number }) =>
    apiClient.post('/api/recipes', data),
};

export const mealPlanApi = {
  list: (params?: { start_date?: string; end_date?: string }) =>
    apiClient.get('/api/meal-plans', { params }),
  create: (data: { recipe_id: number; date: string; meal_type: string }) =>
    apiClient.post('/api/meal-plans', data),
  delete: (id: number) => apiClient.delete(`/api/meal-plans/${id}`),
};

export default apiClient;