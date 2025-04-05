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

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const emailRegex =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

    const passwordRegex = /^[A-Za-z0-9]{5,}$/;

    // 커스텀 유효성 검사
    if (!formData.name) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!formData.email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (!formData.password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (!formData.confirmPassword) {
      setError("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError("비밀번호는 영문 포함, 최소 5자 이상이어야 합니다.");
      return;
    }

    try {
      console.log("회원가입 시도:", {
        name: formData.name,
        email: formData.email,
      });

      login({ email: formData.email, name: formData.name });

      navigate("/");
    } catch (err) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">회원가입</h2>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="text" 
                    name="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <Form.Text className={darkMode ? "text-light" : "text-muted"}>
                    비밀번호는 영문 포함, 최소 5자 이상이어야 합니다.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>비밀번호 확인</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    회원가입
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className={darkMode ? "text-light" : ""}>
                  이미 계정이 있으신가요? <Link to="/users/login">로그인</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
