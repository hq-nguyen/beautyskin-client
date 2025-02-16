import axios from 'axios';
const api =  axios.create({
    baseURL: 'http://14.225.210.92:8080/api/', //s
    // baseURL: 'http://14.225.207.163:8080/api/', 
    
});
export default api;