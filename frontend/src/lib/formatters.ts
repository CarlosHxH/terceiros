export const positions = [
    { lat: -15.6550913, lng: -55.9941522, name: 'Cuiabá' },
    { lat: -15.6892992, lng: -56.0216036, name: 'Profarma' },
    { lat: -15.8767226, lng: -52.3248143, name: 'Barra do Garças' },
];

export const formatPrice = (value: number | string): string => {
    try {
        const num = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(num)) return '';
        return num.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
    } catch {
        return '';
    }
} 

export const formatMinutes = (value: number | string): string => {
    const num = typeof value === "number" ? value : parseInt(value, 10);

    if (isNaN(num) || num < 0) return "";

    const hours = Math.floor(num / 60)
    const minutes = num % 60

    if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
    }
    
    if (hours > 0) {
        return `${hours}h`
    }

    return `${minutes}m`
}