import { toast } from "react-hot-toast";

export const notifySuccess = (message) => 
    toast.success(message, { duration: 3000 });

export const notifyError = (message) =>
    toast.error(message, { duration: 5500 });