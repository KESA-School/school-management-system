import React from 'react';
import toast from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    toast.error('An error occurred. Please try again.');
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center mt-10 text-red-500">
          Something went wrong.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
