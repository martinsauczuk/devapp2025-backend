import { UUID } from './UUID';
import { Temporal } from 'temporal-polyfill';

type Genero = 'masculino' | 'femenino' | 'no binario';

export type Persona = {
    dni: string;
    nombre: string;
    apellido: string;
    fechaDeNacimiento: Temporal.PlainDate;
    genero: Genero;
    esDonanteDeOrganos: boolean;
    // Relationships
    autos: UUID[];
};
