export const nameRegex = /^[a-zA-Z]+$/;
export const fullnameRegex = /^[A-Za-z\s]*$/;
export const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const phoneRegex = /(0|91)?[6-9][0-9]{9}/;
export const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/;
export const postalCodeRegex = /^[1-9]{1}[0-9]{2}s{0,1}[0-9]{3}$/;