import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // 로그아웃 처리 함수 ... 근데 왜 Home으로 안가고 자꾸 로그인딴으로 가니ㅜㅜ
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar
      bg={darkMode ? "dark" : "light"}
      variant={darkMode ? "dark" : "light"}
      className="shadow-sm"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span className="fw-bold">console.log(progress)</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <button onClick={toggleDarkMode} className="theme-toggle me-3">
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* 로그인이 되어있느냐~ 안되어있느냐~에 따름 */}
            {isLoggedIn ? (
              <>
                <Nav.Link as={Link} to="/monologues/random" className="me-2">
                  랜덤 회고
                </Nav.Link>
                <Nav.Link as={Link} to="/monologues" className="me-2">
                  내 기록
                </Nav.Link>
                <Button
                  variant={darkMode ? "outline-light" : "outline-secondary"}
                  onClick={handleLogout}
                >
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/users/login" className="me-2">
                  로그인
                </Nav.Link>
                <Button variant="primary" as={Link} to="/users/signup">
                  회원가입
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
