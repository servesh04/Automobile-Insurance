import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000); // Display for 4 seconds
  }, []);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Container */}
      <div 
        className="position-fixed p-3" 
        style={{ top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {notifications.map(n => {
          const isSuccess = n.type === 'success';
          const bgColor = '#F5EDE0'; // Cream
          const borderColor = isSuccess ? '#2D7D46' : '#A63D2F'; // Green or Red
          const textColor = isSuccess ? '#2D7D46' : '#A63D2F';
          
          return (
            <div 
              key={n.id}
              className="toast show align-items-center"
              role="alert"
              aria-live="assertive"
              aria-atomic="true"
              style={{
                background: bgColor,
                borderLeft: `5px solid ${borderColor}`,
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                color: textColor,
                minWidth: '320px',
                boxShadow: '0 8px 16px rgba(61,43,31,0.1)',
                animation: 'slideInRight 0.3s ease-out'
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-3">
                <div className="d-flex align-items-center gap-3 fw-semibold" style={{ fontSize: '14px', letterSpacing: '0.02em' }}>
                  {isSuccess ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  )}
                  {n.message}
                </div>
                <button 
                  type="button" 
                  onClick={() => removeNotification(n.id)}
                  style={{ background: 'transparent', border: 'none', color: textColor, opacity: 0.6, cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.6}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          )
        })}
      </div>
      
      <style>
        {`
          @keyframes slideInRight {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </NotificationContext.Provider>
  );
};
