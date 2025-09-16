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

export default function Page() {
    const session = useSession();
    const toast = useToast();
    const { currentTime } = CurrentTime();
    const { coords } = LocationTracker();
    const [pontos, setPontos] = useState<ApiPontoData[]>([]);
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);

    const [formData, setFormData] = useState<FormData>();

    /*
    {
        ip: '',
        funcionario: 0,
        latitude: '',
        longitude: '',
        foto: '',
    }*/
    // Fixed useEffect - uncommented and corrected
    useEffect(() => {
        if (!coords) return;
        setFormData('funcionario', session?.user?.id ? Number(session.user.id) : 0);
        
        /*    prev => ({
            ...prev,
            funcionario: session?.user?.id ? Number(session.user.id) : 0,
            latitude: coords.latitude.toString(),
            longitude: coords.longitude.toString(),
        }));*/
    }, [coords, session?.user?.id]);

    const onCapture = async (foto: string) => {
        if (foto) {
            const photo = await base64ToFile(foto, Date.now() + ".png");
            setFormData((prev) => ({ 
                ...prev, 
                foto: photo instanceof File ? photo : prev.foto 
            }));
            setDisabled(false); // Ativar botão Enviar quando a foto for capturada
        }
    };

    const onSubmit = () => {
        // Validation before submitting
        if (!formData?.foto) {
            toast.showError?.('Por favor, capture uma foto antes de enviar');
            return;
        }

        if (!formData.latitude || !formData.longitude) {
            toast.showError?.('Aguarde a localização ser carregada');
            return;
        }

        const form = new FormData();

        // Add non-blob data
        if (formData.funcionario) form.append('userId', formData.funcionario);
        if (formData.coords) form.append('coords', JSON.stringify(formData.coords));
        if (formData.foto) form.append('foto', formData.foto);

        // Add blob data (photo) if it exists
        if (formData.photo instanceof File) {
            form.append('photo', formData.photo, formData.photo.name);
        }

        console.log('Original formData:', formData);

        // Add to pontos array
        setPontos((prev) => [...prev, formData]);

        // Reset form
        //setFormData({});
        setOpen(false);
        setDisabled(true);

        toast.showSuccess('Sucesso ao registrar ponto');
    };

    const title = currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--";
    const subtitle = currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando...";

    return (
        <PageContainer>
            <Card sx={{ px: 2 }} elevation={3}>
                <CardHeader sx={{ textAlign: 'center' }} title={title} subheader={subtitle} />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 2, p: 2 }}>
                    <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">
                        Clique na câmera para tirar uma foto
                    </Typography>

                    {!open ? (
                        <Button onClick={() => setOpen(true)} variant="outlined" sx={{ mb: 2 }}>
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
                        disabled={disabled}
                        variant="contained"
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Enviar Ponto
                    </Button>

                    {/* Show current location status */}
                    <Typography
                        variant="caption"
                        color={coords ? "success.main" : "warning.main"}
                        sx={{ mt: 1 }}
                    >
                        {coords ? "✓ Localização obtida" : "⏳ Obtendo localização..."}
                    </Typography>
                </Box>
            </Card>
        </PageContainer>
    );
}