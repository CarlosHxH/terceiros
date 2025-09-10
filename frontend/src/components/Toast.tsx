"use client"
// contexts/ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

// types/toast.ts
export interface ToastMessage {
  id: string;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ToastContextType {
  showToast: (message: string, severity?: ToastMessage['severity'], duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
  defaultDuration?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 3,
  defaultDuration = 6000 
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const showToast = useCallback((
    message: string, 
    severity: AlertColor = 'info', 
    duration: number = defaultDuration
  ) => {
    const id = generateId();
    const newToast: ToastMessage = {
      id,
      message,
      severity,
      duration
    };

    setToasts(prevToasts => {
      const updatedToasts = [...prevToasts, newToast];
      // Limita o número máximo de toasts
      if (updatedToasts.length > maxToasts) {
        return updatedToasts.slice(-maxToasts);
      }
      return updatedToasts;
    });

    // Auto-remove o toast após a duração especificada
    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }
  }, [generateId, maxToasts, defaultDuration]);

  const hideToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência para diferentes tipos de toast
  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const value: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast,
    clearAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Renderiza todos os toasts */}
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'right' 
          }}
          style={{
            top: `${40 + (index * 70)}px` // Empilha os toasts verticalmente
          }}
          onClose={() => hideToast(toast.id)}
        >
          <Alert 
            onClose={() => hideToast(toast.id)} 
            severity={toast.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
};

// hooks/useToast.ts
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};


/*
// Exemplo de uso em um componente
// components/ExampleComponent.tsx
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useToast } from '../hooks/useToast';

const ExampleComponent: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, clearAllToasts } = useToast();

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" gutterBottom>
        Exemplo de Toast Context
      </Typography>
      
      <Button 
        variant="contained" 
        color="success"
        onClick={() => showSuccess('Operação realizada com sucesso!')}
      >
        Toast de Sucesso
      </Button>
      
      <Button 
        variant="contained" 
        color="error"
        onClick={() => showError('Erro ao processar solicitação')}
      >
        Toast de Erro
      </Button>
      
      <Button 
        variant="contained" 
        color="warning"
        onClick={() => showWarning('Atenção: Verifique os dados inseridos')}
      >
        Toast de Aviso
      </Button>
      
      <Button 
        variant="contained" 
        color="info"
        onClick={() => showInfo('Informação adicional disponível')}
      >
        Toast de Informação
      </Button>
      
      <Button 
        variant="outlined"
        onClick={() => clearAllToasts()}
      >
        Limpar Todos os Toasts
      </Button>
    </Box>
  );
};

// App.tsx - Como usar o provider
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastProvider } from './contexts/ToastContext';
import ExampleComponent from './components/ExampleComponent';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider maxToasts={5} defaultDuration={5000}>
        <div className="App">
          <ExampleComponent />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
*/