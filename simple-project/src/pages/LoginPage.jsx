import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost",
  headers: {
    "Content-Type": "application/json"
  }
});

const LoginPage = () => {
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 간단한 유효성 검사
    if (!memberEmail || !memberPassword) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      // 생성한 api 인스턴스로 요청
      const response = await api.post("/auth/login", {
        memberEmail,
        memberPassword
      });
      
      // 응답에서 토큰과 사용자 정보 추출
      const { accessToken, refreshToken, memberName } = response.data;
      
      // 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      login({ 
        email: memberEmail, 
        name: memberName || memberEmail.split('@')[0],
        token: accessToken
      });
      
      // 로그인 성공 후 홈으로 리다이렉트
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
      } else if (err.request) {
        setError("서버에서 응답이 없습니다. 서버 상태를 확인해주세요.");
      } else {
        setError("요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">로그인</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={memberPassword}
                    onChange={(e) => setMemberPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className={darkMode ? "text-light" : ""}>
                  계정이 없으신가요? <Link to="/users/signup">회원가입</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;