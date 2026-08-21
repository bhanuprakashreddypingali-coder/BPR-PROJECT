import API from "./api";

export const getAllFoods = async () => {
    const response = await API.get("/foods");
    return response.data;
};