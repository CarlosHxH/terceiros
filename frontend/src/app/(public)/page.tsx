"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Card, CardHeader } from "@mui/material";
import { PageContainer, useSession } from "@toolpad/core";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WebcamCapture from "@/components/WebcamCapture";
import LocationTracker from "@/hooks/LocationTracker";
import CurrentTime from "@/hooks/CurrentTime";
import { useToast } from "@/components/Toast";
import base64ToFile from "@/hooks/base64ToFile";
import useClientIP from "@/hooks/useClientIP";
import { api } from "@/lib/api";


export default function Page() {
    const session = useSession();
    const toast = useToast();
    const { currentTime } = CurrentTime();
    const { coords } = LocationTracker();
    const { ip, loading: ipLoading } = useClientIP();
    
    const [pontos, setPontos] = useState<ApiPontoData[]>([]);
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [formData, setFormData] = useState<ApiPontoData>({
        ip: '',
        funcionario: 0,
        latitude: '',
        longitude: '',
        foto: null,
    });

    // Atualizar formData quando coordenadas, sessão ou IP mudarem
    useEffect(() => {
        console.log({coords});
        
        if (!coords || !session?.user?.id || !ip) return;
        
        setFormData(prev => ({
            ...prev,
            funcionario: Number(session.user?.id||0),
            latitude: coords.latitude.toString(),
            longitude: coords.longitude.toString(),
            ip: ip
        }));
    }, [coords, session?.user?.id, ip]);

    const onCapture = async (foto: string|null) => {
        if (foto) {
            try {
                const photo = await base64ToFile(foto, `photo_${Date.now()}.png`);
                
                if (photo instanceof File) {
                    setFormData(prev => ({ 
                        ...prev, 
                        foto: photo 
                    }));
                    setDisabled(false); // Ativar botão Enviar quando a foto for capturada
                } else {
                    toast.showError?.('Erro ao processar a foto');
                }
            } catch (error) {
                console.error('Erro ao processar foto:', error);
                toast.showError?.('Erro ao processar a foto');
            }
        }
    };

    const onSubmit = async () => {
        // Validações
        if (!formData.foto) {
            toast.showError?.('Por favor, capture uma foto antes de enviar');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            toast.showError?.('Aguarde a localização ser carregada');
            return;
        }

        if (!formData.ip) {
            toast.showError?.('Aguarde o IP ser carregado');
            return;
        }

        if (!formData.funcionario) {
            toast.showError?.('Dados do usuário não encontrados');
            return;
        }

        try {
            const form = new FormData();

            // Adicionar dados do formulário
            form.append('funcionario', formData.funcionario.toString());
            form.append('latitude', formData.latitude);
            form.append('longitude', formData.longitude);
            form.append('ip', formData.ip);
            form.append('foto', formData.foto, formData.foto.name);

            console.log('Dados a serem enviados:', {
                funcionario: formData.funcionario,
                latitude: formData.latitude,
                longitude: formData.longitude,
                ip: formData.ip,
                foto: formData.foto.name
            });

            const response = await api<Usuario>({
                endpoint: "api/pontos",
                method: "POST",
                data: form
            })
            console.log({response});
            
/*
            // Aqui você faria a requisição para sua API
            const response = await fetch('http://192.168.134.46:8000/api/pontos', {
                 method: 'POST',
                 body: form,
            });*/

            if (!response.data) {
                throw new Error('Erro ao enviar dados');
            }
            console.log(response.data);
            

            // Adicionar aos pontos (simulação)
            setPontos(prev => [...prev, { ...formData }]);

            // Reset do formulário
            setFormData(prev => ({
                ...prev,
                foto: null,
            }));
            setOpen(false);
            setDisabled(true);

            toast.showSuccess?.('Ponto registrado com sucesso!');

        } catch (error) {
            console.error('Erro ao enviar ponto:', error);
            toast.showError?.('Erro ao registrar ponto. Tente novamente.');
        }
    };

    // Verificar se todos os dados necessários estão carregados
    const isDataReady = coords && ip && !ipLoading && session?.user?.id;
   
    const title = currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--";
    const subtitle = currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando...";

    return (
        <PageContainer>
            <Card sx={{ px: 2 }} elevation={3}>
                <CardHeader sx={{ textAlign: 'center' }} title={title} subheader={subtitle} />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 2, p: 2 }}>
                    
                    {/* Status dos dados necessários */}
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography
                            variant="caption"
                            color={coords ? "success.main" : "warning.main"}
                            sx={{ display: 'block' }}
                        >
                            {coords ? "✓ Localização obtida" : "⏳ Obtendo localização..."}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={ip && !ipLoading ? "success.main" : "warning.main"}
                            sx={{ display: 'block' }}
                        >
                            {ip && !ipLoading ? `✓ IP obtido: ${ip}` : "⏳ Obtendo IP..."}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={session?.user?.id ? "success.main" : "warning.main"}
                            sx={{ display: 'block' }}
                        >
                            {session?.user?.id ? "✓ Usuário identificado" : "⏳ Carregando usuário..."}
                        </Typography>
                    </Box>

                    <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">
                        Clique na câmera para tirar uma foto
                    </Typography>

                    {!open ? (
                        <Button 
                            onClick={() => setOpen(true)} 
                            variant="outlined" 
                            sx={{ mb: 2 }}
                            disabled={!isDataReady}
                        >
                            CAPTURAR FACIAL
                        </Button>
                    ) : (
                        <Box sx={{ mb: 2 }}>
                            <WebcamCapture onCapture={onCapture} />
                            <Button onClick={() => setOpen(false)} sx={{ mt: 1 }} variant="text">
                                Cancelar
                            </Button>
                        </Box>
                    )}

                    <Button
                        onClick={onSubmit}
                        disabled={disabled || !isDataReady}
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        {!isDataReady ? 'Carregando dados...' : 'Enviar Ponto'}
                    </Button>

                    {/* Debug info (remova em produção) */}
                    {process.env.NODE_ENV === 'development' && (
                        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1, fontSize: '0.75rem' }}>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                Debug Info:
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                IP: {ip || 'Carregando...'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                Coords: {coords ? `${coords.latitude}, ${coords.longitude}` : 'Carregando...'}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                                User ID: {session?.user?.id || 'Não logado'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Card>
        </PageContainer>
    );
}