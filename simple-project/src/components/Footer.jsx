import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`py-4 mt-auto footer ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container>
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <p className={`mb-2 ${darkMode ? 'text-light' : 'text-muted'}`}>
              Copyright © {currentYear} 혼잣말 기록장 | console.log(progress) | 정승원
            </p>
            <p className={`small mb-3 ${darkMode ? 'text-light' : 'text-muted'}`}>
              에러도 감정도 기록하면 성장입니다.
            </p>
            <div className="d-flex justify-content-center gap-4">
              <a 
                href="https://github.com/semo970921" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'}`}
              >
                <i className="bi bi-github fs-4"></i>
              </a>
              <a 
                href="mailto:semo970921@naver.com" 
                className={`text-decoration-none ${darkMode ? 'text-light' : 'text-dark'}`}
              >
                <i className="bi bi-envelope fs-4"></i>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;