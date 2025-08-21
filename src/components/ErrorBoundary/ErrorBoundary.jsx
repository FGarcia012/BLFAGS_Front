import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary atrapó un error:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-boundary-content">
                        <h2>Algo salió mal</h2>
                        <p>Ha ocurrido un error inesperado. Por favor, recarga la página.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="reload-button"
                        >
                            Recargar página
                        </button>
                        {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                            <details style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                                <summary>Detalles del error (solo en desarrollo)</summary>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
