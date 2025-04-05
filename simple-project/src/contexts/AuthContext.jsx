import React, { createContext, useState, useEffect, useContext } from "react";

// 인증 컨텍스트 생성
const AuthContext = createContext();

// 인증 제공자 컴포넌트
export const AuthProvider = ({ children }) => {
  // 로컬 스토리지에서 로그인 상태 불러오기 또는 기본값 설정
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedAuth = localStorage.getItem("isLoggedIn");
    return savedAuth ? JSON.parse(savedAuth) : false;
  });

  // 사용자 데이터 (실제 서버 연동 시 확장)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });


  const login = (userData) => {
    // 실제 구현에서는 서버 API 연동 필요
    setIsLoggedIn(true);
    setUser(
      userData || {
        name: "백엔드 API가 아직 준비되지않아...",
        email: "test@google.com",
      }
    );
  };


  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // 인증 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    localStorage.setItem("user", JSON.stringify(user));
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
