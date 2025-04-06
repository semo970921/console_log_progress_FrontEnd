import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const MonologueDetailPage = () => {
  const [monologue, setMonologue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { monologueId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/users/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const fetchMonologue = async () => {
      try {
        setLoading(true);
        
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');
        
        // 백엔드에서 혼잣말 상세 정보 가져오기
        const response = await axios.get(`http://localhost:80/api/monologues/${monologueId}`, {
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        
        console.log("혼잣말 상세 조회 응답:", response.data);
        setMonologue(response.data);
        setLoading(false);
      } catch (error) {
        console.error("혼잣말 상세 데이터를 가져오는 중 오류:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    if (monologueId) {
      fetchMonologue();
    }
  }, [monologueId]);

  // 첨부 파일 다운로드 함수
  const handleDownloadFile = async () => {
    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.get(`http://localhost:80/api/monologues/file/${monologueId}`, {
        responseType: 'blob',
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      // 파일 이름 추출
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'download';
      
      if (contentDisposition) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      } else if (monologue.attachmentNo) {
        // 경로에서 파일명 추출
        const pathParts = monologue.attachmentNo.split('/');
        filename = pathParts[pathParts.length - 1];
      }
      
      // Blob URL 생성 및 다운로드
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("첨부파일 다운로드 중 오류:", error);
      alert("첨부파일을 다운로드하는 중 오류가 발생했습니다.");
    }
  };

  // 혼잣말 삭제 함수
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 혼잣말을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      setLoading(true);
      
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      await axios.delete(`http://localhost:80/api/monologues/${monologueId}`, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      alert("혼잣말이 성공적으로 삭제되었습니다.");
      navigate("/monologues");
    } catch (error) {
      console.error("혼잣말 삭제 중 오류:", error);
      setError("삭제 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">혼잣말 상세보기</h2>
                <Button
                  variant={darkMode ? "outline-light" : "outline-secondary"}
                  size="sm"
                  as={Link}
                  to="/monologues"
                >
                  목록으로
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">불러오는 중...</span>
                  </Spinner>
                  <p className="mt-2">혼잣말을 불러오는 중...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : monologue ? (
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className={darkMode ? "text-light" : "text-muted"}>
                      <small>
                        {formatDate(monologue.createdAt)} | {monologue.weather}
                      </small>
                    </div>
                    {monologue.attachmentNo && (
                      <Badge bg="secondary">첨부파일</Badge>
                    )}
                  </div>

                  <Card
                    className={`p-3 mb-4 ${
                      darkMode ? "bg-dark text-light" : "bg-light"
                    }`}
                  >
                    <Card.Text
                      style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}
                    >
                      {monologue.content}
                    </Card.Text>
                  </Card>

                  {monologue.attachmentNo && (
                    <div className="mb-4">
                      <h5>첨부파일</h5>
                      <Card
                        className={`p-3 ${
                          darkMode ? "bg-dark text-light" : "bg-light"
                        }`}
                      >
                        <div className="d-flex align-items-center">
                          <i className="bi bi-file-earmark me-2"></i>
                          <span>
                            {monologue.attachmentNo.split('/').pop()}
                          </span>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="ms-auto"
                            onClick={handleDownloadFile}
                          >
                            다운로드
                          </Button>
                        </div>
                      </Card>
                    </div>
                  )}

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                      variant="outline-primary"
                      as={Link}
                      to={`/monologues/edit/${monologue.monologueNo}`}
                    >
                      수정하기
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={handleDelete}
                    >
                      삭제하기
                    </Button>
                  </div>
                </div>
              ) : (
                <Alert variant="warning">
                  존재하지 않는 혼잣말이거나 접근 권한이 없습니다.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MonologueDetailPage;