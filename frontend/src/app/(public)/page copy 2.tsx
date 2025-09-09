"use client";
import React, { useState } from "react";
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
    { lat: -15.6550913, lng: -55.9941522, name: 'cuiaba' },
    { lat: -15.6892992, lng: -56.0216036, name: 'profarma' },
]
export default function Page() {
    const { currentTime } = CurrentTime();
    const { coords, error } = LocationTracker();

    const [formData, setFormData] = useState({});

    const [dist, setDist] = React.useState<Number | null>(null);

    React.useEffect(() => {
        if (coords) {
            const coord = { lat: coords.latitude, lng: coords.longitude };
            Object.entries(positions).map(([key, value]) => {
                const distance = geoDistance(coord, value);
                console.log({ distance });
            })

            /*
            setDist(distance);
            setFormData(prev => ({
                ...prev,
                distance,
                coords: coord
            }));*/
        }
    }, [coords])

    const render = () => {
        coords && Object.entries(positions).map(([key, value]) => {
            const coord = { lat: coords.latitude, lng: coords.longitude };
            const distance = geoDistance(coord, value);
            return <p>{key}{value}{distance}</p>
        })||<></>
    }

    return (
        <PageContainer>
            {render()}

            <Card sx={{ px: 2 }} elevation={3}>

                <CardHeader sx={{ textAlign: 'center' }}
                    title={currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--"}
                    subheader={currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando..."}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mb: 2, p: 2 }}>
                    <Typography sx={{ mb: 1 }} variant="body2" color="textSecondary">Clique na câmera para tirar uma foto</Typography>
                    <WebcamCapture onCapture={(photo) => { setFormData(prev => ({ ...prev, photo })) }} />
                    <Button sx={{ mt: 1 }} disabled variant="contained" fullWidth>Envia Ponto</Button>
                </Box>

            </Card>
        </PageContainer>
    );
}