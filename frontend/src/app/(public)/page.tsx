import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { PageContainer } from "@toolpad/core";

export default function Page() {
    return (
        <PageContainer>
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome to the Public Page!
                </Typography>
                <Typography variant="body1">
                    This is a public area of the application. Please sign in to access the
                    dashboard.
                </Typography>
                <Typography>Welcome to a page in the dashboard!</Typography>
            </Box>
        </PageContainer>
    );
}
