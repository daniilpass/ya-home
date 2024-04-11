import React, { useState } from 'react';

interface ErrorContentProps {
    title?: React.ReactNode;
    error?: Error;
}

const ErrorContent = ({ title, error }: ErrorContentProps) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const handleCollpaseClick = () => {
        setIsCollapsed(!isCollapsed);
    }

    return (
        <div>
            <div>{title}</div>
            {error && (
                <div
                    onClick={handleCollpaseClick}
                    style={{
                        cursor: 'pointer',
                        color: 'blue',
                        textDecoration: 'underline',
                    }}
                >
                    {isCollapsed ? 'Подробнее' : 'Свернуть'}
                </div>
            )}
            {error && !isCollapsed && (
                <div
                    style={{
                        whiteSpace: 'pre',
                        overflowX: 'scroll',
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        marginTop: '10px',
                        borderRadius: '5px',
                    }}
                >
                    <span>{error?.message}</span>
                    <span>{error?.stack}</span>
                </div>
            )}
        </div>
    );
};

export default ErrorContent;