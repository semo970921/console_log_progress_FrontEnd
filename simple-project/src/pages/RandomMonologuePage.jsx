import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";

const RandomMonologuePage = () => {
  const [monologue, setMonologue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // 로그인 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/users/login");
    }
  }, [isLoggedIn, navigate]);

  // 랜덤 혼잣말 가져오기
  const fetchRandomMonologue = async () => {
    setLoading(true);
    setError("");

    try {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem('accessToken');
      
      // 백엔드에서 모든 혼잣말 목록 가져오기
      const response = await axios.get("http://localhost:80/api/monologues/list", {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        }
      });
      
      console.log("혼잣말 목록 응답:", response.data);
      
      // 혼잣말이 있는지 확인
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // 랜덤으로 하나 선택
        const randomIndex = Math.floor(Math.random() * response.data.length);
        setMonologue(response.data[randomIndex]);
      } else {
        // 혼잣말이 없는 경우
        setMonologue(null);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("혼잣말을 불러오는 중 오류 발생:", err);
      setError("혼잣말을 불러오는 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  // 페이지 로드 시 랜덤 혼잣말 가져오기
  useEffect(() => {
    if (isLoggedIn) {
      fetchRandomMonologue();
    }
  }, [isLoggedIn]);

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 날짜 간격 계산 함수
  const getDateDifference = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const then = new Date(dateString);
    const diffTime = Math.abs(now - then);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "하루 전";
    return `${diffDays}일 전`;
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="mb-4 text-center">랜덤 회고</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">불러오는 중...</span>
                </Spinner>
                <p className="mt-3">혼잣말을 불러오는 중...</p>
              </Card.Body>
            </Card>
          ) : monologue ? (
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">
                      {getDateDifference(monologue.createdAt)}의 혼잣말
                    </h5>
                    <p
                      className={`mb-0 ${
                        darkMode ? "text-light" : "text-muted"
                      }`}
                    >
                      <small>
                        {formatDate(monologue.createdAt)} | {monologue.weather}
                      </small>
                    </p>
                  </div>
                  {monologue.attachmentNo && (
                    <span className="badge bg-secondary">첨부파일</span>
                  )}
                </div>

                <Card
                  className={`mb-4 ${
                    darkMode ? "bg-dark border-secondary" : "bg-light"
                  }`}
                >
                  <Card.Body>
                    <blockquote className="mb-0">
                      <p>{monologue.content}</p>
                    </blockquote>
                  </Card.Body>
                </Card>

                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-secondary"
                    as={Link}
                    to={`/monologues/${monologue.monologueNo}`}
                  >
                    상세보기
                  </Button>
                  <Button variant="primary" onClick={fetchRandomMonologue}>
                    다른 회고 보기
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <p>아직 작성한 혼잣말이 없습니다.</p>
                <Button
                  as={Link}
                  to="/monologues/write"
                  variant="primary"
                  className="mt-3"
                >
                  첫 혼잣말 작성하기
                </Button>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RandomMonologuePage;