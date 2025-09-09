interface Coordenadas {
  lat: number;
  lng: number;
}

export default function useDistance(coords1: Coordenadas, coords2: Coordenadas): number {
  const grausParaRadianos = (graus: number): number => (graus * Math.PI) / 180;
  const raioTerraKm = 6371;

  const latRad1 = grausParaRadianos(coords1.lat);
  const latRad2 = grausParaRadianos(coords2.lat);
  const deltaLat = grausParaRadianos(coords2.lat - coords1.lat);
  const deltaLng = grausParaRadianos(coords2.lng - coords1.lng);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(latRad1) * Math.cos(latRad2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.asin(Math.sqrt(a));
  const distanciaKm = raioTerraKm * c;

  return distanciaKm; // distância em quilômetros
}

/*
const pontoA: Coordenadas = { lat: -15.6550923, lng: -55.9941528 };
const pontoB: Coordenadas = { lat: -15.6550913, lng: -55.9941522 };

const distancia = haversineDistance(pontoA, pontoB);
console.log(`Distância: ${distancia * 1000} metros`);

*/