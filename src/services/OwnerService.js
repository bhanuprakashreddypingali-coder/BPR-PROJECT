import api from "./ApiService";

const OwnerService = {
  getDashboard: async () => {
    const response = await api.get("/owner/dashboard");
    return response.data;
  },

  getRestaurant: async () => {
    const response = await api.get("/owner/restaurant");
    return response.data;
  },

  updateRestaurant: async (restaurantData) => {
    const response = await api.put("/owner/restaurant", restaurantData);
    return response.data;
  },
};

export default OwnerService;