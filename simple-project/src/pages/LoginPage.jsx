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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const { darkMode } = useTheme();

  // 이미 로그인되어 있으면 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 간단한 유효성 검사
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      
      // 백엔드 서버 URL
      const API_URL = "http://localhost:80";
      
      // 로그인 요청
      const response = await axios.post(`${API_URL}/auth/login`, {
        memberEmail: email,
        memberPassword: password
      });

      console.log("로그인 성공:", response.data);
      
      // 토큰 저장
      if (response.data && response.data.accessToken) {
        // 로컬 스토리지에 토큰 저장
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
        
        login({
          email: response.data.memberEmail,
          name: response.data.memberName
        });
        
        // 홈으로 리다이렉트
        navigate("/");
      } else {
        setError("로그인 응답에 필요한 데이터가 없습니다.");
      }
    } catch (err) {
      console.error("로그인 에러:", err);
      

      if (err.response) {
        setError(err.response.data?.message || "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.");
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        setError("서버 응답이 없습니다. 인터넷 연결을 확인해주세요.");
      } else {
        // 요청 설정 중 오류 발생
        setError("요청 설정 중 오류가 발생했습니다.");
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  계정이 없으신가요?!? <Link to="/users/signup">회원가입</Link>
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