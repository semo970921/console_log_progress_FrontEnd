import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const MonologueDetailPage = () => {
  const { id } = useParams();
  const [monologue, setMonologue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // 로그인 확인
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);


  useEffect(() => {
    const fetchMonologue = async () => {
      setLoading(true);
      setError("");

      try {
        // 실제 구현에서는 API 호출
        // 테스트용 더미 데이터
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

        // ID로 혼잣말 찾기
        const foundMonologue = dummyData.find((m) => m.id === parseInt(id));

        if (foundMonologue) {
          setMonologue(foundMonologue);
        } else {
          setError("해당 혼잣말을 찾을 수 없습니다.");
        }

        setLoading(false);
      } catch (err) {
        setError("혼잣말을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    if (isLoggedIn && id) {
      fetchMonologue();
    }
  }, [isLoggedIn, id]);

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

  // 삭제 처리 함수 (실제로는 API 호출)
  const handleDelete = () => {
    if (window.confirm("정말로 이 혼잣말을 삭제하시겠습니까?")) {
      // API 호출 시뮬레이션
      console.log("혼잣말 삭제:", id);

      // 삭제 후 목록 페이지로 이동
      navigate("/monologues");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body className="p-4">
              {loading ? (
                <div className="text-center py-5">
                  <p>혼잣말을 불러오는 중...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : monologue ? (
                <>
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h2 className="mb-2">{monologue.id}번째 혼잣말</h2>
                      <p
                        className={`mb-0 ${
                          darkMode ? "text-light" : "text-muted"
                        }`}
                      >
                        {formatDate(monologue.createdAt)} | {monologue.weather}
                      </p>
                    </div>
                    {monologue.hasAttachment && (
                      <Badge bg="secondary" pill>
                        첨부파일
                      </Badge>
                    )}
                  </div>

                  <Card
                    className={`mb-4 ${
                      darkMode ? "bg-dark border-secondary" : "bg-light"
                    }`}
                  >
                    <Card.Body>
                      <p className="mb-0">{monologue.content}</p>
                    </Card.Body>
                  </Card>

                  {monologue.hasAttachment && (
                    <div className="mb-4">
                      <h5>첨부파일</h5>
                      <Card
                        className={darkMode ? "bg-dark border-secondary" : ""}
                      >
                        <Card.Body>
                          <a
                            href={monologue.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={darkMode ? "text-light" : ""}
                          >
                            <i className="bi bi-file-earmark me-2"></i>
                            첨부파일 보기
                          </a>
                        </Card.Body>
                      </Card>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <div>
                      <Button
                        variant="outline-danger"
                        onClick={handleDelete}
                        className="me-2"
                      >
                        삭제
                      </Button>
                      <Button
                        variant="outline-primary"
                        as={Link}
                        to={`/monologues/edit/${monologue.id}`}
                      >
                        수정
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="outline-secondary"
                        as={Link}
                        to="/monologues"
                      >
                        목록으로
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Alert variant="warning">혼잣말을 찾을 수 없습니다.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MonologueDetailPage;