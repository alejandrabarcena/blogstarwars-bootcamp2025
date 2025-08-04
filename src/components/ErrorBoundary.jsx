import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-vh-100 bg-dark text-white d-flex align-items-center justify-content-center">
          <div className="text-center">
            <AlertTriangle size={64} className="text-warning mb-4" />
            <h1 className="text-warning mb-3">Something went wrong</h1>
            <p className="text-muted mb-4">
              The Force is not strong with this component right now.
            </p>
            <button
              className="btn btn-warning"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} className="me-2" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;