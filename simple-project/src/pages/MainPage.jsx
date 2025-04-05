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
  const handleSaveMonologue = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("혼잣말 내용을 입력해주세요.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("혼잣말 저장:", { content, file, weather });
      setSuccess("혼잣말이 성공적으로 저장되었습니다😊");
      setContent("");
      setFile(null);
      setIsSubmitting(false);

      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    }, 1000);
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
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
