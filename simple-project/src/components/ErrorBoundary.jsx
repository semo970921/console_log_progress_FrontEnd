import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>데이터를 불러오는 중 오류가 발생했습니다. 페이지를 새로고침해 주세요.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;