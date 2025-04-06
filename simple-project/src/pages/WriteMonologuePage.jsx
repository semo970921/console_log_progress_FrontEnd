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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const WriteMonologuePage = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const { darkMode } = useTheme();

  // 날씨 데이터는 추후 실제 API 연동 시 구현
  const weather = { temp: "22°C", condition: "맑음" };

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/users/login");
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!content.trim()) {
      setError("혼잣말 내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // 여기에 실제 API 호출 코드가 들어갈 예정
      console.log("혼잣말 저장:", { content, file });

      // 일정 시간 후 성공 메시지 표시 (API 호출 성공 가정학ㅎ~)
      setTimeout(() => {
        setSuccess("혼잣말이 성공적으로 저장되었습니다!");
        setContent("");
        setFile(null);

        // 파일 입력 필드 초기화 (직접 리셋이 불가능해서 이런 방식 사용)
        const fileInput = document.getElementById("file-upload-page");
        if (fileInput) fileInput.value = "";

        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">혼잣말 기록하기</h2>
                {weather && (
                  <div className={darkMode ? "text-light" : "text-muted"}>
                    {weather.temp} {weather.condition}
                  </div>
                )}
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>오늘의 혼잣말</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="오늘 개발하면서 어떤 생각이 들었나요? 자유롭게 작성해보세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>첨부파일 (선택)</Form.Label>
                  <Form.Control
                    type="file"
                    id="file-upload-page"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Form.Text className={darkMode ? "text-light" : "text-muted"}>
                    코드 스크린샷, 오류 메시지 등을 첨부할 수 있습니다.
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end">
                  {file && (
                    <div className="text-success me-auto align-self-center">
                      <i className="bi bi-paperclip"></i> {file.name}
                    </div>
                  )}
                  <Button
                    variant={darkMode ? "outline-light" : "secondary"}
                    className="me-2"
                    onClick={() => navigate("/")}
                  >
                    취소
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "저장 중..." : "기록하기"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WriteMonologuePage;