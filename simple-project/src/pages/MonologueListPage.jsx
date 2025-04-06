import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ListGroup,
  Badge,
  Spinner,
  Alert
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const MonologueListPage = () => {
  const [monologues, setMonologues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/users/login");
    }
  }, [isLoggedIn, navigate]);

  // 혼잣말 목록 가져오기
  useEffect(() => {
    const fetchMonologues = async () => {
      try {
        console.log("혼잣말 목록 요청 시작");
        
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');
        
        // 백엔드 서버 주소를 직접 지정하여 API 호출
        const response = await axios.get("http://localhost:80/api/monologues/list", {
          headers: {
            // 토큰이 있으면 Authorization 헤더에 추가
            ...(token ? { "Authorization": `Bearer ${token}` } : {})
          }
        });
        
        console.log("혼잣말 목록 응답:", response.data);
        setMonologues(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("혼잣말 데이터를 가져오는 중 오류 발생:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchMonologues();
  }, []);

  // 검색 필터링
  const filteredMonologues = Array.isArray(monologues) 
    ? monologues.filter((monologue) =>
        monologue?.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      )
    : [];

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
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
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4">내 혼잣말 기록</h2>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="align-items-center mb-3">
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="기록 내용 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <Button as={Link} to="/monologues/write" variant="primary">
                    새 기록 작성
                  </Button>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">불러오는 중...</span>
                  </Spinner>
                  <p className="mt-2">기록을 불러오는 중...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : filteredMonologues.length === 0 ? (
                <p className="text-center py-4">
                  {searchTerm
                    ? "검색 결과가 없습니다."
                    : "아직 작성한 혼잣말이 없습니다."}
                </p>
              ) : (
                <ListGroup variant="flush">
                  {filteredMonologues.map((monologue) => (
                    <ListGroup.Item
                      key={monologue.monologueNo}
                      className={`border-bottom py-3 ${
                        darkMode ? "text-light bg-dark" : ""
                      }`}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <small
                          className={darkMode ? "text-light" : "text-muted"}
                        >
                          {formatDate(monologue.createdAt)} |{" "}
                          {monologue.weather}
                        </small>
                        {monologue.attachmentNo && (
                          <Badge bg="secondary" pill>
                            첨부파일
                          </Badge>
                        )}
                      </div>
                      <p className="mb-2">{monologue.content}</p>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          as={Link}
                          to={`/monologues/${monologue.monologueNo}`}
                        >
                          상세보기
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          as={Link}
                          to={`/monologues/edit/${monologue.monologueNo}`}
                        >
                          수정
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MonologueListPage;