import { useEffect, useState } from "react";

// Hook personalizado para obter IP do cliente
const useClientIP = () => {
    const [ip, setIP] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getIP = async () => {
            try {
                // Usando múltiplos serviços como fallback
                const services = [
                    'https://api.ipify.org?format=json',
                    'https://httpbin.org/ip',
                    'https://api.my-ip.io/ip.json'
                ];

                for (const service of services) {
                    try {
                        const response = await fetch(service);
                        const data = await response.json();
                        
                        // Diferentes formatos de resposta dos serviços
                        const clientIP = data.ip || data.origin || data.ip_addr;
                        if (clientIP) {
                            setIP(clientIP);
                            setLoading(false);
                            return;
                        }
                    } catch (error) {
                        console.warn(`Falha ao obter IP de ${service}:`, error);
                        continue;
                    }
                }

                // Se todos os serviços falharem, tenta uma abordagem alternativa
                console.warn('Todos os serviços de IP falharam, usando IP local');
                setIP('127.0.0.1');
            } catch (error) {
                console.error('Erro ao obter IP:', error);
                setIP('unknown');
            } finally {
                setLoading(false);
            }
        };

        getIP();
    }, []);

    return { ip, loading };
};

export default useClientIP;