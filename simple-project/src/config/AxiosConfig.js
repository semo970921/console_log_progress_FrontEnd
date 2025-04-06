import axios from 'axios';

// 기본 URL 설정 (개발 환경에서는 프록시 이용)
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:80' 
  : '';

// 요청 인터셉터 추가
axios.interceptors.request.use(
  config => {
    // 요청 보내기 전 처리
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 요청 에러 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
axios.interceptors.response.use(
  response => {
    // 응답 데이터 처리
    return response;
  },
  error => {
    // 응답 에러 처리
    if (error.response && error.response.status === 401) {
      // 인증 오류 처리 (예: 토큰 만료)
      localStorage.removeItem('token');
      window.location.href = '/users/login';
    }
    return Promise.reject(error);
  }
);

export default axios;