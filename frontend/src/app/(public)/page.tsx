"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Card, CardHeader } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WebcamCapture from "@/components/WebcamCapture";
import LocationTracker from "@/hooks/LocationTracker";
import geoDistance from 'geo-distance-helper';
import CurrentTime from "@/hooks/CurrentTime";

const positions = [
    { lat: -15.6550913, lng: -55.9941522, name: 'Cuiabá' },
    { lat: -15.6892992, lng: -56.0216036, name: 'Profarma' },
    { lat: -15.8767226, lng: -52.3248143, name: 'Barra do Garças' },
];

interface DistanceInfo {
    name: string;
    distance: number;
    position: { lat: number; lng: number, name: string; };
}

export default function Page() {
    const { currentTime } = CurrentTime();
    const { coords, error } = LocationTracker();

    const [formData, setFormData] = useState({});
    const [distances, setDistances] = useState<DistanceInfo[]>([]);

    const [ disabled, setDisabled ] = useState(true)

    useEffect(() => {
        if (coords) {
            const coord = { lat: coords.latitude, lng: coords.longitude };
            
            const calculatedDistances = positions.map((position) => {
                const distance = geoDistance(coord, position);
                return {
                    name: position.name,
                    distance: distance,
                    position: position
                };
            });
            setDistances(calculatedDistances);
            setFormData(prev => ({
                ...prev,
                distances: calculatedDistances,
                coords: coord
            }));
        }
    }, [coords]);

    const renderDistances = () => {
        if (!coords) {
            return <Typography variant="body2" color="textSecondary">Aguardando localização...</Typography>;
        }

        if (error) {
            return <Typography variant="body2" color="error">Erro ao obter localização: {error}</Typography>;
        }

        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Distâncias:</Typography>
                {distances.map((item, index) => (
                    <Typography key={index} variant="body2">
                        {item.name}: {item.distance}
                    </Typography>
                ))}
            </Box>
        );
    };

    return (
        <PageContainer>
            {renderDistances()}

            <Card sx={{ px: 2 }} elevation={3}>
                <CardHeader 
                    sx={{ textAlign: 'center' }}
                    title={currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--"}
                    subheader={currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando..."}
                />

                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    mb: 2, 
                    p: 2 
                }}>
                    <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">
                        Clique na câmera para tirar uma foto
                    </Typography>
                    <WebcamCapture onCapture={(photo) => {
                        setFormData(prev => ({ ...prev, photo }));
                        setDisabled(!photo);
                    }} />
                    <Button sx={{ mt: 1 }} disabled={disabled} variant="contained" fullWidth>
                        Enviar Ponto
                    </Button>
                </Box>
            </Card>
        </PageContainer>
    );
}