import axios from 'axios';

// Create an Axios instance with default options
const instance = axios.create({
    baseURL: 'https://vision.googleapis.com/v1',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ya29.a0AfB_byAQzBPGvO5fpPDER2PN9ZBCVrQx86A4bOWvCFua5SQWs6SDXXGOg2m688rELLytsDD3HdkzVwQObCmkXx7x0vg5-vs7P1qZJKdVj7HF1YcfJUeRage5hJLRFBOqb6fi9QsRN3Dkcg017fESKOHTungPEHQ-SRf1zXIOU44aCgYKAQ0SARASFQHGX2MiZazodQqtnEBiA63bwUfd0Q0178`,
        'x-goog-user-project': 'evaluai-407504'
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
