import axios from 'axios';

// Create an Axios instance with default options
const instance = axios.create({
    baseURL: 'https://api.openai.com/v1/chat',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VUE_APP_OPENAI_API_KEY}`
    }
});

instance.interceptors.request.use((config) => {
    return config;

}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
  
    function (response) {
        return response;
    }, 
    
    function (error) {
        console.log(error);
        return Promise.reject(error);
    }
  );

export default instance;
