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
import axios from "axios";

const WriteMonologuePage = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
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

      setSuccess("혼잣말이 성공적으로 저장되었습니다!");
      setContent("");
      setFile(null);

      // 파일 입력 필드 초기화
      const fileInput = document.getElementById("file-upload-page");
      if (fileInput) fileInput.value = "";

      // 2초 후 페이지 강제 리로드하여 목록 페이지로 이동
      setTimeout(() => {
        window.location.href = '/monologues';
      }, 2000);
    } catch (err) {
      console.error("혼잣말 저장 중 오류:", err);
      setError(
        err.response?.data || "저장 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
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
                    onClick={() => navigate("/monologues")}
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