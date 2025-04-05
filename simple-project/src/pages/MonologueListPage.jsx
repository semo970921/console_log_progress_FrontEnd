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
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const MonologueListPage = () => {
  const [monologues, setMonologues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoggedIn, user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/users/login");
    }
  }, [isLoggedIn, navigate]);

  // 혼잣말 목록 가져오기 (실제 구현에서는 API 호출)
  useEffect(() => {
    // API 호출 이런식으로~~~ 백엔드로~~~
    const fetchMonologues = async () => {
      try {
        // 서버에서 데이터를 가져오는 대신 더미 데이터 사용
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

        setMonologues(dummyData);
        setLoading(false);
      } catch (error) {
        console.error("혼잣말 데이터를 가져오는 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchMonologues();
  }, []);

  // 검색 필터링
  const filteredMonologues = monologues.filter((monologue) =>
    monologue.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
                <p className="text-center py-4">기록을 불러오는 중...</p>
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
                      key={monologue.id}
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
                        {monologue.hasAttachment && (
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
                          to={`/monologues/${monologue.id}`}
                        >
                          상세보기
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          as={Link}
                          to={`/monologues/edit/${monologue.id}`}
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
