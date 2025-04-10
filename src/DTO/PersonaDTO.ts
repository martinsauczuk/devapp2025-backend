import { Persona } from '../Models';

export type PersonaDTO = Pick<Persona, 'dni' | 'nombre' | 'apellido'>;
