"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, Card, CardHeader, CardMedia } from "@mui/material";
import { PageContainer } from "@toolpad/core";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Page() {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
        const interval = setInterval(() => {setCurrentTime(new Date())}, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <PageContainer>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }} gutterBottom>{format(currentTime, 'HH:mm:ss')}</Typography>
                <Typography variant="h6" sx={{ textAlign: 'center' }} gutterBottom>{format(currentTime, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Typography>
                <Card sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        Ponto Facil
                    </Typography>
                    <CardHeader sx={{ textAlign: 'center' }}
                        title="FULANINHO DA SILVA"
                        subheader=""
                    />
                    <CardMedia component="img"
                        height="194"
                        image="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png"
                        alt="Profile Image"
                        sx={{ width: 150, height: 150, margin: '0 auto', borderRadius: '50%' }}
                    />
                </Card>
            </Box>
        </PageContainer>
    );
}
