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

  // 백엔드 연결
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [memberName, setMemberName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const handleInputEmail = (e) => {
    setMemberEmail(e.target.value);
    setFormData({...formData, email: e.target.value}); // formData도 함께 업데이트
  };

  const handleInputPassword = (e) => {
    setMemberPassword(e.target.value);
    setFormData({...formData, password: e.target.value});
  };

  const handleInputName = (e) => {
    setMemberName(e.target.value);
    setFormData({...formData, name: e.target.value});
  };

  const handleInputConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setFormData({...formData, confirmPassword: e.target.value}); 
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const emailRegex =
      /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

    const passwordRegex = /^[A-Za-z0-9]{5,}$/;

    // 커스텀 유효성 검사
    if (!memberName) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!memberEmail) {
      setError("이메일을 입력해주세요.");
      return;
    }

    if (!emailRegex.test(memberEmail)) {
      setError("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    if (!memberPassword) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (!confirmPassword) {
      setError("비밀번호 확인을 입력해주세요.");
      return;
    }

    if (memberPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!passwordRegex.test(memberPassword)) {
      setError("비밀번호는 영문 포함, 최소 5자 이상이어야 합니다.");
      return;
    }

    // 백엔드 API 연결 (개별 상태 사용)
    axios.post("http://localhost:80/members", {
      memberEmail: memberEmail,
      memberPassword: memberPassword,
      memberName: memberName,
    })
    .then((response) => {
      
      login({email: memberEmail, name: memberName});
      navigate("/");
    })
    .catch((error) => {
      setError("회원가입에 실패했습니다. 다시 시도해주슈");
    });
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
                    value={memberName}
                    onChange={handleInputName}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="text" 
                    name="email"
                    placeholder="이메일을 입력하세요"
                    value={memberEmail}
                    onChange={handleInputEmail}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={memberPassword}
                    onChange={handleInputPassword}
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
                    value={confirmPassword}
                    onChange={handleInputConfirmPassword}
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