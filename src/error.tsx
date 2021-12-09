import React from 'react';

interface State {
    hasError: boolean;
    error: any;
    errorInfo: any;
}

interface Props {}

export default class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: '', errorInfo: '' };
    }

    componentDidCatch(error: any, errorInfo: any) {
        this.setState({ hasError: true, error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ margin: '10px 40px' }}>
                    <h3>Something Went Wrong...</h3>
                    <h4>- Refresh the website to restart the browser.</h4>
                    <h4>- Please contact Sehi LYi (sehi_lyi@hms.harvard.edu) to help us fixing this issue</h4>
                    <p>{this.state.error}</p>
                    <p>{this.state.errorInfo}</p>
                </div>
            );
        }
        return this.props.children;
    }
}
