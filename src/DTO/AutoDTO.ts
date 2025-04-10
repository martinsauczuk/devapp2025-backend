import { Auto } from '../Models';

export type AutoDTO = Pick<Auto, 'patente' | 'marca' | 'modelo' | 'anho'>;
