import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: any;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let displayMessage = "Something went wrong.";
      try {
        const parsed = JSON.parse(this.state.error.message);
        if (parsed.error && parsed.error.includes('Missing or insufficient permissions')) {
          displayMessage = "You don't have permission to perform this action. Please check your account status.";
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#0a0a0a',
          color: '#fff',
          fontFamily: 'Anton',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: 'var(--red)', fontSize: '48px', marginBottom: '20px' }}>SYSTEM ERROR</h1>
          <p style={{ fontSize: '18px', maxWidth: '600px', marginBottom: '30px' }}>{displayMessage}</p>
          <button 
            className="btn btn-red" 
            onClick={() => window.location.reload()}
          >
            RELOAD SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
