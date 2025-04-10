import { UUID } from './UUID';

export type Auto = {
    patente: string;
    marca: string;
    modelo: string;
    anho: number;
    color: string;
    nroChasis: string;
    nroMotor: string;
    // Relationships
    owner: UUID;
};
