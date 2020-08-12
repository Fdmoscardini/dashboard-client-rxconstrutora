import axios from "axios";

export const apiInstance = (token) => (
    axios.create({
        baseURL: 'http://'+ `${window.location.hostname}` + ':3004',
        //baseURL: 'http://rxconstrutora.ddns.net:3004',
        headers: { 'X-Access-Token': `${token}` }
    })
);
