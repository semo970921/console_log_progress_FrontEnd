import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

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
      // 실제 구현에서는 API 호출
      // 테스트용 더미 데이터 배열
      const dummyData = [
        {
          id: 1,
          content: "오늘 React Router를 처음 사용해봤는데 개빡쳐!!!!!!!!!!.",
          createdAt: "2025-03-29T15:30:00",
          weather: "맑음",
          hasAttachment: true,
          attachmentUrl: "#",
        },
        {
          id: 2,
          content:
            "Context API를 사용해서 전역 상태 관리 하는가는 안배웠는디??",
          createdAt: "2025-03-28T11:20:00",
          weather: "흐림",
          hasAttachment: false,
        },
        {
          id: 3,
          content: "CSS는 늘 나를 화나게 한다.",
          createdAt: "2025-03-27T09:45:00",
          weather: "비",
          hasAttachment: false,
        },
        {
          id: 4,
          content: "예외처리는 어려워.",
          createdAt: "2025-03-26T16:10:00",
          weather: "맑음",
          hasAttachment: true,
          attachmentUrl: "#",
        },
        {
          id: 5,
          content: "React Bootstrap은 신이여.",
          createdAt: "2025-03-25T13:50:00",
          weather: "구름조금",
          hasAttachment: false,
        },
      ];

      // 랜덤으로 하나 선택
      const randomIndex = Math.floor(Math.random() * dummyData.length);
      setMonologue(dummyData[randomIndex]);
      setLoading(false);
    } catch (err) {
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
                <p>혼잣말을 불러오는 중...</p>
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
                  {monologue.hasAttachment && (
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
                    to={`/monologues/${monologue.id}`}
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