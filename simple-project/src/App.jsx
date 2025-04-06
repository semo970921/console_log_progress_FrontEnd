import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import MainPage from "./pages/MainPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import WriteMonologuePage from "./pages/WriteMonologuePage";
import RandomMonologuePage from "./pages/RandomMonologuePage";
import MonologueListPage from "./pages/MonologueListPage";
import MonologueDetailPage from "./pages/MonologueDetailPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";
import EditMonologuePage from "./pages/EditMonologuePage";
import "/src/config/AxiosConfig.js";
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/users/signup" element={<SignupPage />} />
                <Route path="/users/login" element={<LoginPage />} />
                <Route
                  path="/monologues/write"
                  element={<WriteMonologuePage />}
                />
                <Route
                  path="/monologues/random"
                  element={<RandomMonologuePage />}
                />
                
                <Route path="/monologues" element={
    <ErrorBoundary>
      <MonologueListPage />
    </ErrorBoundary>
  } />
                <Route
                  path="/monologues/edit/:id"
                  element={<EditMonologuePage />}
                />

                {/* 404 페이지 */}
                <Route
                  path="*"
                  element={
                    <h1 className="text-center my-5">
                      페이지를 찾을 수 없습니다
                    </h1>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;