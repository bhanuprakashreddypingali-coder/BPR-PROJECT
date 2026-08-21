export const saveUser = (response) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("role", response.role);
    localStorage.setItem("email", response.email);
    localStorage.setItem("name", response.fullName);
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
};

export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};

export const getRole = () => {
    return localStorage.getItem("role");
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const getEmail = () => {
    return localStorage.getItem("email");
};

export const getName = () => {
    return localStorage.getItem("name");
};

export const isCustomer = () => {
    return isLoggedIn() && getRole() === "CUSTOMER";
};

export const isOwner = () => {
    return isLoggedIn() && getRole() === "RESTAURANT_OWNER";
};

export const isAdmin = () => {
    return isLoggedIn() && getRole() === "ADMIN";
};