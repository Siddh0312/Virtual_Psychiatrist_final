import axios from 'axios';

export async function uploadPdf(formData) {
  return axios.post('/api/upload', formData);  // Proxy sends to https://localhost:7187/api/upload
}
