import { Auto } from './auto';

type Genero = 'masculino' | 'femenino' | 'no binario';

export type Persona = {
    dni: string;
    nombre: string;
    apellido: string;
    fechaDeNacimiento: Date;
    genero: Genero;
    esDonanteDeOrganos: boolean;
    // Relationships
    autos: Auto[];
};

export type PersonaListings = Pick<Persona, 'dni' | 'nombre' | 'apellido'>;
