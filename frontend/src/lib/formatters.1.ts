export const formatPrice = (value: number | string): string => {
    try {
        const num = typeof value === "number" ? value : parseFloat(value);
        if (isNaN(num)) return '';
        return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
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

export const calcularHoras = (entrada: string, saida: string): string | number => {
    // Importando o moment.js para manipulação de datas
    const moment = require('moment');
    
    // Convertendo as strings de entrada para objetos Moment
    const data1 = moment(entrada, 'HH:mm');
    const data2 = moment(saida, 'HH:mm');
    
    // Calculando a diferença em horas
    const res = data1.diff(data2, 'hours');
    
    return res;
}

export const horas = (
    entrada: string, // formato "HH:mm"
    saida: string,   // formato "HH:mm"
    pausaAlmocoMinutos: number = 60, // pausa em minutos, padrão 60
    jornadaPadraoHoras: number = 8
): {
    horasNormais: number;
    horasExtras: number;
} => {
    // Função para converter "HH:mm" em minutos totais do dia
    function converterParaMinutos(hora: string): number {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
    }
    const entradaMin = converterParaMinutos(entrada);
    const saidaMin = converterParaMinutos(saida);
    // Total de minutos trabalhados descontando a pausa
    const minutosTrabalhados = saidaMin - entradaMin - pausaAlmocoMinutos;
    // Convertendo para horas
    const horasTrabalhadas = minutosTrabalhados / 60;
    // Calculando horas extras
    const horasExtras = horasTrabalhadas > jornadaPadraoHoras ? horasTrabalhadas - jornadaPadraoHoras : 0;
    const horasNormais = horasTrabalhadas > jornadaPadraoHoras ? jornadaPadraoHoras : horasTrabalhadas;
    return {
        horasNormais: Number(horasNormais.toFixed(2)),
        horasExtras: Number(horasExtras.toFixed(2)),
    };
}