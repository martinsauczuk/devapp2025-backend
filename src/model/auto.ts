export type Auto = {
    patente: string;
    marca: string;
    modelo: string;
    anho: number;
    color: string;
    nroChasis: string;
    nroMotor: string;
};

export type AutoListings = Pick<Auto, 'patente' | 'marca' | 'modelo' | 'anho'>;
