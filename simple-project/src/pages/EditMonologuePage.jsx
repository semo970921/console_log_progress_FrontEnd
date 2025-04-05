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
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const EditMonologuePage = () => {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setIsFetching(true);
      setError("");

      try {
        // 테스트용 더미 데이터~~~
        const dummyData = [
          {
            id: 1,
            content:
              "오늘 React Router를 처음 사용해봤는데, 생각보다 쉽게 페이지 전환 기능을 구현할 수 있었다. 특히 useNavigate 훅이 편리하다.",
            createdAt: "2025-03-29T15:30:00",
            weather: "맑음",
            hasAttachment: true,
            attachmentUrl: "#",
            attachmentName: "react-router-example.png",
          },
          {
            id: 2,
            content:
              "Context API를 사용해서 전역 상태 관리를 해보니, 작은 규모의 프로젝트에서는 Redux 없이도 충분히 상태 관리가 가능한 것 같다.",
            createdAt: "2025-03-28T11:20:00",
            weather: "흐림",
            hasAttachment: false,
          },
          {
            id: 3,
            content:
              "CSS 애니메이션에 대해 공부하고 있는데, transition과 transform을 잘 활용하면 상당히 부드러운 UI를 만들 수 있다는 것을 깨달았다.",
            createdAt: "2025-03-27T09:45:00",
            weather: "비",
            hasAttachment: false,
          },
          {
            id: 4,
            content:
              "오늘은 API 호출 시 발생하는 에러 처리에 대해 고민했다. try-catch 블록과 에러 상태를 어떻게 효과적으로 관리할지에 대한 패턴을 찾아봐야겠다.",
            createdAt: "2025-03-26T16:10:00",
            weather: "맑음",
            hasAttachment: true,
            attachmentUrl: "#",
            attachmentName: "error-handling-example.js",
          },
          {
            id: 5,
            content:
              "React Bootstrap을 처음 써봤는데, 기본적인 스타일링이 이미 적용되어 있어서 빠르게 프로토타입을 만들 수 있었다. 다만 커스터마이징에는 약간의 제약이 있는 것 같다.",
            createdAt: "2025-03-25T13:50:00",
            weather: "구름조금",
            hasAttachment: false,
          },
        ];

        // ID로 혼잣말 찾기
        const foundMonologue = dummyData.find((m) => m.id === parseInt(id));

        if (foundMonologue) {
          setContent(foundMonologue.content);
          if (foundMonologue.hasAttachment) {
            setOriginalFile({
              name: foundMonologue.attachmentName,
              url: foundMonologue.attachmentUrl,
            });
          }
        } else {
          setError("해당 혼잣말을 찾을 수 없습니다.");
        }

        setIsFetching(false);
      } catch (err) {
        setError("혼잣말을 불러오는 중 오류가 발생했습니다.");
        setIsFetching(false);
      }
    };

    if (isLoggedIn && id) {
      fetchMonologue();
    }
  }, [isLoggedIn, id]);

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
      // 실제 구현에서는 API 호출 (PUT 또는 PATCH 메소드)
      console.log("혼잣말 업데이트:", { id, content, file });

      // 일정 시간 후 성공 메시지 표시 (API 호출 성공 가정)
      setTimeout(() => {
        setSuccess("혼잣말이 성공적으로 수정되었습니다!");
        setIsLoading(false);

        // 성공 메시지 표시 후 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/monologues/${id}`);
        }, 1500);
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
              <h2 className="mb-4">혼잣말 수정하기</h2>

              {isFetching ? (
                <div className="text-center py-5">
                  <p>혼잣말을 불러오는 중...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  {success && <Alert variant="success">{success}</Alert>}

                  <Form.Group className="mb-4">
                    <Form.Label>혼잣말 내용</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="혼잣말 내용을 입력하세요."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>첨부파일 (선택)</Form.Label>
                    {originalFile && !file && (
                      <div className="mb-2">
                        <p className="mb-2">
                          <small>
                            <i className="bi bi-paperclip"></i> 현재 첨부파일:{" "}
                            {originalFile.name}
                          </small>
                        </p>
                        <Form.Check
                          type="checkbox"
                          id="replace-file"
                          label="파일 교체하기"
                          onChange={(e) => {
                            if (e.target.checked) {
                              document
                                .getElementById("file-upload-edit")
                                .click();
                            }
                          }}
                        />
                      </div>
                    )}
                    <Form.Control
                      type="file"
                      id="file-upload-edit"
                      onChange={(e) => setFile(e.target.files[0])}
                      style={originalFile && !file ? { display: "none" } : {}}
                    />
                    <Form.Text
                      className={darkMode ? "text-light" : "text-muted"}
                    >
                      {file
                        ? `새 파일: ${file.name}`
                        : "코드 스크린샷, 에러 메시지 등을 첨부할 수 있습니다"}
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant={darkMode ? "outline-light" : "secondary"}
                      className="me-2"
                      onClick={() => navigate(`/monologues/${id}`)}
                      disabled={isLoading}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "저장 중..." : "수정 완료"}
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditMonologuePage;
