"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Card, CardHeader, CardMedia } from "@mui/material";
import { PageContainer, useSession } from "@toolpad/core";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Webcam from 'react-webcam';
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
    const session = useSession();
    const { currentTime } = CurrentTime();

    return (
        <PageContainer>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }} gutterBottom>
                    {currentTime ? format(currentTime, 'HH:mm:ss') : "--:--:--"}
                </Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>
                    {currentTime ? format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Carregando..."}
                </Typography>
                <Card sx={{ p: 2, mb: 2 }} elevation={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Ponto Facil
                    </Typography>

                    <CardHeader sx={{ textAlign: 'center' }}
                        title={session?.user?.name || "Usuário"}
                        subheader="Empresa XYZ"
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: 2 }}>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary">
                                Clique na câmera para tirar uma foto
                            </Typography>
                        </Box>
                        <WebcamCapture/>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1">
                            Matrícula: 123456
                        </Typography>
                        <Typography variant="body1">
                            Cargo: Desenvolvedor
                        </Typography>
                        <Typography variant="body1">
                            Departamento: Tecnologia
                        </Typography>
                    </Box>

                </Card>
            </Box>
        </PageContainer>
    );
}