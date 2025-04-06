import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 초기 로드시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    
    if (token && userEmail && userName) {
      setCurrentUser({ email: userEmail, name: userName });
      setIsLoggedIn(true);
      
      // axios 기본 헤더 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // 로그인 함수
  const login = (userData) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    
    // 사용자 정보 로컬스토리지에 저장
    localStorage.setItem("userEmail", userData.email);
    localStorage.setItem("userName", userData.name);
  };

  // 로그아웃 함수
  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // 로컬 스토리지 정리
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    // axios 헤더 제거
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    currentUser,
    isLoggedIn,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};