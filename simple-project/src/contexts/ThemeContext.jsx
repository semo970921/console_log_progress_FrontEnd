import React, { createContext, useState, useEffect, useContext } from "react";


const ThemeContext = createContext();


export const ThemeProvider = ({ children }) => {

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };


  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 커스텀 훅: 테마 컨텍스트 사용
export const useTheme = () => useContext(ThemeContext);