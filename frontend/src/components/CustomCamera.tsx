import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Camera, FlipCameraIos, CheckCircle, Refresh } from '@mui/icons-material';

// Tipos TypeScript
interface CustomCameraProps {
  onCapture?: (imageData: string) => void;
  overlayImage?: string;
}

const CustomCamera: React.FC<CustomCameraProps> = ({
  onCapture,
  overlayImage = '/personFrame.png'
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [frameLoaded, setFrameLoaded] = useState(false);

  // Handle component mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Preload the frame image
    const img = new Image();
    img.onload = () => setFrameLoaded(true);
    img.onerror = () => {
      console.warn('Frame image failed to load, using fallback');
      setFrameLoaded(true);
    };
    img.src = overlayImage;
  }, [overlayImage]);

  // Manipula o evento de câmera pronta
  const handleCameraReady = useCallback(() => {
    console.log('Camera ready');
    setIsCameraReady(true);
    setIsLoading(false);
    setError(null);
  }, []);

  // Manipula erros da câmera
  const handleCameraError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
    let errorMessage = 'Não foi possível acessar a câmera. Verifique as permissões.';
    
    if (typeof error === 'object' && error.name) {
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Acesso à câmera negado. Por favor, permita o acesso à câmera.';
          break;
        case 'NotFoundError':
          errorMessage = 'Nenhuma câmera encontrada no dispositivo.';
          break;
        case 'NotSupportedError':
          errorMessage = 'Câmera não suportada neste navegador.';
          break;
        case 'NotReadableError':
          errorMessage = 'Câmera está sendo usada por outro aplicativo.';
          break;
        default:
          errorMessage = `Erro na câmera: ${error.message || error.name}`;
      }
    }
    
    setError(errorMessage);
    setIsLoading(false);
    setIsCameraReady(false);
  }, []);

  // Alterna entre câmera frontal e traseira
  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setIsLoading(true);
    setIsCameraReady(false);
    setError(null);
  }, []);

  // Captura a imagem da webcam
  const capture = useCallback(() => {
    if (webcamRef.current && isCameraReady) {
      try {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImage(imageSrc);
          if (onCapture) {
            onCapture(imageSrc);
          }
        } else {
          setError('Falha ao capturar imagem. Tente novamente.');
        }
      } catch (err) {
        console.error('Capture error:', err);
        setError('Erro ao capturar imagem. Tente novamente.');
      }
    }
  }, [onCapture, isCameraReady]);

  // Redefine a captura para tirar outra foto
  const resetCapture = useCallback(() => {
    setCapturedImage(null);
    setError(null);
  }, []);

  // Reinicia a câmera
  const restartCamera = useCallback(() => {
    setError(null);
    setIsLoading(true);
    setIsCameraReady(false);
  }, []);

  // Verifica se há suporte para câmera
  useEffect(() => {
    if (!isMounted) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Seu navegador não suporta acesso à câmera.');
      setIsLoading(false);
      return;
    }

    // Test camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch(err => {
        handleCameraError(err);
      });
  }, [isMounted, handleCameraError]);

  // Reset states when facing mode changes
  useEffect(() => {
    if (facingMode) {
      setCapturedImage(null);
      setError(null);
    }
  }, [facingMode]);

  if (!isMounted) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress size={60} />
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Paper sx={{ p: 2, borderRadius: 3, backgroundColor: '#fafafa' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
            Captura de Foto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posicione-se dentro da moldura e tire sua foto
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            onClose={() => setError(null)}
            action={
              <Button size="small" onClick={restartCamera} startIcon={<Refresh />}>
                Tentar Novamente
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Camera Container */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: '#fff',
            borderRadius: 2,
            overflow: 'hidden',
            minHeight: 400
          }}
        >
          {/* Loading State */}
          {(isLoading || !frameLoaded) && !error && (
            <Box sx={{ 
              width: '100%',
              height: 400,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              gap: 2
            }}>
              <CircularProgress size={50} sx={{ color: '#1976d2' }} />
              <Typography variant="body2" sx={{ color: 'white' }}>
                {!frameLoaded ? 'Carregando moldura...' : 'Carregando câmera...'}
              </Typography>
            </Box>
          )}

          {/* Camera View */}
          {!capturedImage && !error && frameLoaded && (
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
              <Webcam
                key={facingMode}
                audio={false}
                ref={webcamRef}
                height={400}
                width={400}
                color='transparent'
                screenshotFormat="image/jpeg"
                onUserMedia={handleCameraReady}
                onUserMediaError={handleCameraError}
                videoConstraints={{
                  facingMode,
                  width: { ideal: 400, min: 300 },
                  height: { ideal: 530, min: 400 },
                  aspectRatio: 0.8
                }}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              
              {/* Person Frame Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${overlayImage})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
              />

              {/* Instructions Overlay */}
              {isCameraReady && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    zIndex: 15
                  }}
                >
                  Alinhe-se com a moldura
                </Box>
              )}
            </Box>
          )}

          {/* Captured Image View */}
          {capturedImage && (
            <Box sx={{ position: 'relative', width: '100%', maxWidth: 400 }}>
              <Box
                component="img"
                src={capturedImage}
                alt="Foto capturada"
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: 2
                }}
              />
              
              {/* Frame overlay on captured image */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${overlayImage})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  pointerEvents: 'none',
                  zIndex: 10
                }}
              />
            </Box>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: 300,
              width: '100%',
              gap: 2,
              color: 'white'
            }}>
              <Camera sx={{ fontSize: 48, opacity: 0.5 }} />
              <Typography variant="body1" align="center">
                Não foi possível carregar a câmera
              </Typography>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 2, 
          mt: 3, 
          flexWrap: 'wrap'
        }}>
          {!capturedImage && !error ? (
            <>
              <Button
                variant="contained"
                size="large"
                startIcon={<Camera />}
                onClick={capture}
                disabled={!isCameraReady || isLoading || !frameLoaded}
                sx={{
                  minWidth: 140,
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#1565c0' }
                }}
              >
                Capturar
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<FlipCameraIos />}
                onClick={toggleFacingMode}
                disabled={isLoading || !isCameraReady}
                sx={{ minWidth: 140 }}
              >
                Virar Câmera
              </Button>
            </>
          ) : capturedImage ? (
            <>
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircle />}
                onClick={() => {
                  console.log('Image confirmed:', capturedImage);
                  alert('Foto confirmada!');
                }}
                sx={{
                  minWidth: 140,
                  backgroundColor: '#2e7d32',
                  '&:hover': { backgroundColor: '#1b5e20' }
                }}
              >
                Confirmar
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={resetCapture}
                sx={{ minWidth: 140 }}
              >
                Nova Foto
              </Button>
            </>
          ) : null}
        </Box>

        {/* Footer Instructions */}
        {!capturedImage && !error && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              💡 Dica: Use boa iluminação e mantenha o dispositivo firme
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CustomCamera;