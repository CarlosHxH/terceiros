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
import dataUrlToFile from "@/hooks/dataUrlToFile";

const positions = [
    { lat: -15.6550913, lng: -55.9941522, name: 'Cuiabá' },
    { lat: -15.6892992, lng: -56.0216036, name: 'Profarma' },
    { lat: -15.8767226, lng: -52.3248143, name: 'Barra do Garças' },
];

interface DistanceInfo {
    name: string;
    distance: Number;
    position: { lat: number; lng: number; name: string; };
}

interface FormDataState {
    userId?: string;
    distances?: DistanceInfo[];
    coords?: { lat: number; lng: number };
    photo?: File | null;
    data?: number;
}

export default function Page() {
    const session = useSession();
    const toast = useToast();
    const { currentTime } = CurrentTime();
    const { coords, error } = LocationTracker();
    const [formData, setFormData] = useState<FormDataState>({});
    const [pontos, setPontos] = useState<FormDataState[]>([]);
    const [open, setOpen] = useState(false);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (coords) {
            const coord = { lat: coords.latitude, lng: coords.longitude };
            setFormData(prev => ({
                ...prev,
                userId: session?.user?.id || '',
                coords: coord,
                data: Date.now()
            }));
        }
    }, [coords, session]);

    const onCapture = async (photo: string | null) => {
        const myBlob = photo ? await dataUrlToFile(photo, Date.now() + ".png") : null;
        setFormData(prev => ({ ...prev, photo: myBlob }));
        setDisabled(!photo);
    };
    

    const onSubmit = () => {
        const form = new FormData();
        // Add non-blob data as JSON strings
        if (formData.userId) {
            form.append('userId', formData.userId);
        }
        if (formData.coords) {
            form.append('coords', JSON.stringify(formData.coords));
        }
        // Add blob data (photo)
        if (formData.photo instanceof File) {
            form.append('photo', formData.photo, formData.photo.name);
        }
        console.log('Original formData:', formData);
        setPontos((prev)=>[...prev, formData])
        setFormData({})
        setOpen(false)
        setDisabled(true)
        toast.showSuccess('Sucesso ao registrar ponto')
    };

    const title = currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--";
    const subtitle = currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando...";

    return (
        <PageContainer>
            <Card sx={{ px: 2 }} elevation={3}>
                <CardHeader sx={{ textAlign: 'center' }} title={title} subheader={subtitle} />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 2, p: 2 }}>
                    <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">Clique na câmera para tirar uma foto</Typography>
                    {!open?(
                        <Button onClick={()=>setOpen(true)}>CAPTURAR FACIAL</Button>
                    ):(
                        <WebcamCapture onCapture={onCapture} />
                    )}
                    <Button onClick={onSubmit} sx={{ mt: 1 }} disabled={disabled} variant="contained" fullWidth>Enviar Ponto</Button>
                </Box>
            </Card>
            {pontos.map((item,i)=>(
                <Box key={i}>
                    {(item?.data)&&<Typography>
                        {["ENTRADA","SAIDA ALMOÇO","VOLTA ALMOÇO","SAIDA"][i]}: {new Date(item?.data).toLocaleString()}
                    </Typography>}
                </Box>
            ))}
        </PageContainer>
    );
}