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

export default function Page() {
    const { currentTime } = CurrentTime();
    const { coords, error } = LocationTracker();

    const [formData, setFormData] = useState({});

    const [dist, setDist] = React.useState<Number | null>(null);

    const cuiaba = { lat: -15.6550913, lng: -55.9941522 };
    //const profarma = {lat: -15.6892992, lng: -56.0216036};

    React.useEffect(() => {
        if (coords) {
            const coord = { lat: coords.latitude, lng: coords.longitude };
            const distance = geoDistance(coord, cuiaba);
            setDist(distance);
            setFormData(prev => ({
                ...prev,
                distance,
                coords: coord
            }));
        }
    }, [coords])



    return (
        <PageContainer>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }} gutterBottom>
                    Ponto
                </Typography>
                <Card sx={{ p: 2, mb: 2 }} elevation={3}>
                    <CardHeader sx={{ textAlign: 'center' }}
                        title={currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--"}
                        subheader={currentTime ? format(currentTime, "EEEE, dd'/'MM'/'yyyy", { locale: ptBR }) : "Carregando..."}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 2 }}>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Clique na câmera para tirar uma foto
                            </Typography>
                        </Box>
                        <WebcamCapture onCapture={(photo) => {setFormData(prev => ({...prev, photo})) }} />
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Button fullWidth style={{ backgroundColor: "#1976d2", color: 'white' }}>Envia Ponto</Button>
                    </Box>

                    {false && (<Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1">
                            Matrícula: 123456
                        </Typography>
                        <Typography variant="body1">
                            Cargo: Desenvolvedor
                        </Typography>
                        <Typography variant="body1">
                            Departamento: Tecnologia
                        </Typography>
                    </Box>)}

                </Card>
            </Box>
        </PageContainer>
    );
}