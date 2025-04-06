import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const MainPage = () => {
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // 날씨 데이터와 명언은 추후 실제 API 연동 시 구현 예정....
  const weather = { temp: "22°C", condition: "맑음" };
  const quote =
    "Documentation is a love letter that you write to your future self";

  // 혼잣말 저장 핸들러
  const handleSaveMonologue = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("혼잣말 내용을 입력해주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      // 백엔드 서버 주소를 직접 지정하여 API 호출
      const response = await axios.post("http://localhost:80/api/monologues/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // 토큰이 있으면 Authorization 헤더에 추가
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
      });

      console.log("API 응답:", response);

      setSuccess("혼잣말이 성공적으로 저장되었습니다😊");
      setContent("");
      setFile(null);

      // 파일 입력 필드 초기화
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
      
      // 3초 후 성공 메시지 숨기기
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("혼잣말 저장 중 오류:", err);
      setError(
        err.response?.data || "저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center mb-5">
        <Col md={8}>
          <h1 className="display-4 mb-3">혼잣말 기록장</h1>
          <p className="lead">
            버그와의 싸움... 개발 과정의 모든 순간을 기록하세요👻
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="text-center p-5">
              <Card.Title as="h3" className="mb-4">
                오늘의 개발자 명언
              </Card.Title>
              <blockquote className="blockquote">
                <p className="mb-0">{quote}</p>
              </blockquote>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">지금의 혼잣말</h3>
                <div>
                  {weather && (
                    <span className={darkMode ? "text-light" : "text-muted"}>
                      {weather.temp} {weather.condition}
                    </span>
                  )}
                </div>
              </div>

              {isLoggedIn ? (
                <Form onSubmit={handleSaveMonologue}>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>첨부파일 (선택)</Form.Label>
                    <Form.Control
                      type="file"
                      id="file-upload"
                      onChange={(e) => setFile(e.target.files[0])} // 한 개만
                    />
                    <Form.Text
                      className={darkMode ? "text-light" : "text-muted"}
                    >
                      코드, 스크린샷, 에러 메시지 등등 모두 첨부할 수 있습니다
                    </Form.Text>
                  </Form.Group>
                  <div className="d-flex justify-content-between align-items-center">
                    {file && (
                      <div className="text-success">
                        <small>
                          <i className="bi bi-paperclip"></i> {file.name}
                        </small>
                      </div>
                    )}
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      className="ms-auto"
                    >
                      {isSubmitting ? "저장 중..." : "기록하기"}
                    </Button>
                  </div>
                </Form>
              ) : (
                // 로그인이 안된 상태인때
                <div className="text-center py-4">
                  <p className="mb-3">
                    혼잣말을 기록하려면 로그인이 필요합니다.
                  </p>
                  <div>
                    <Button
                      as={Link}
                      to="/users/login"
                      variant="primary"
                      className="me-2"
                    >
                      로그인
                    </Button>
                    <Button
                      as={Link}
                      to="/users/signup"
                      variant="outline-primary"
                    >
                      회원가입
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className={`h-100 shadow-sm ${darkMode ? "bg-dark text-light" : ""}`}>
            <Card.Body className="d-flex flex-column">
              <h4>내 혼잣말 기록</h4>
              <p>지금까지 작성한 혼잣말을 모아볼 수 있습니다.</p>
              <Button
                as={Link}
                to="/monologues"
                variant={darkMode ? "outline-light" : "outline-primary"}
                className="mt-auto"
              >
                기록 보기
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className={`h-100 shadow-sm ${darkMode ? "bg-dark text-light" : ""}`}>
            <Card.Body className="d-flex flex-column">
              <h4>혼잣말 작성하기</h4>
              <p>조금 더 여유롭게 혼잣말을 작성하고 싶으신가요?</p>
              <Button
                as={Link}
                to="/monologues/write"
                variant={darkMode ? "outline-light" : "outline-primary"}
                className="mt-auto"
              >
                작성 페이지로
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className={`h-100 shadow-sm ${darkMode ? "bg-dark text-light" : ""}`}>
            <Card.Body className="d-flex flex-column">
              <h4>랜덤 회고</h4>
              <p>과거에 작성한 혼잣말을 랜덤으로 읽고 되돌아보세요.</p>
              <Button
                as={Link}
                to="/monologues/random"
                variant={darkMode ? "outline-light" : "outline-primary"}
                className="mt-auto"
              >
                랜덤 회고하기
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;