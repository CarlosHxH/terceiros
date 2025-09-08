"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Button, Card, CardHeader } from "@mui/material";
import { PageContainer, useSession } from "@toolpad/core";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WebcamCapture from "@/components/WebcamCapture";

function CurrentTime() {
    const [value, setValue] = React.useState<Date | null>(null);
    const [isLoading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!!value) {
            setLoading(false);
        }
        const interval = setInterval(() => {
            setValue(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return { currentTime: value, isLoading };
}

export default function Page() {
    const { currentTime } = CurrentTime();

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
                        <WebcamCapture />
                    </Box>

                    <Box sx={{mt:4}}>
                        <Button fullWidth style={{backgroundColor:"#1976d2", color: 'white'}}>Envia Ponto</Button>
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