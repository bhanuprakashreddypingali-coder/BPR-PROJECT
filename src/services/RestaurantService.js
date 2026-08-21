import API from "./api";

export const getAllRestaurants = async () => {
    const response = await API.get("/restaurants");
    return response.data;
}; 