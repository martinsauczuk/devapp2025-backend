import { UUID, WithId, Persona, Auto } from '../../Models';
import { Temporal } from 'temporal-polyfill';
import process from 'process';

const personas: Record<UUID, WithId<Persona>> = {};
const autos: Record<UUID, WithId<Auto>> = {};

if (process.env.SEED_DATA === 'true') {
    personas['1'] = {
        _id: '1',
        dni: '123456789',
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaDeNacimiento: new Temporal.PlainDate(1980, 4, 21),
        genero: 'masculino',
        esDonanteDeOrganos: true,
        // Relationships
        autos: ['1', '2']
    };
    personas['2'] = {
        _id: '2',
        dni: '987654321',
        nombre: 'María',
        apellido: 'Martinez',
        fechaDeNacimiento: new Temporal.PlainDate(1982, 7, 13),
        genero: 'femenino',
        esDonanteDeOrganos: true,
        // Relationships
        autos: ['3']
    };
    personas['3'] = {
        _id: '3',
        dni: '987654321',
        nombre: 'Sasha',
        apellido: 'Rusiska',
        fechaDeNacimiento: new Temporal.PlainDate(1995, 3, 1),
        genero: 'no binario',
        esDonanteDeOrganos: false,
        // Relationships
        autos: ['4', '5']
    };

    autos['1'] = {
        _id: '1',
        patente: 'AA 123 BB',
        marca: 'Ford',
        modelo: 'Fiesta',
        anho: 1995,
        color: 'Rojo',
        nroChasis: 'AA1234ABCDEF',
        nroMotor: 'ABC123DEFPOI',
        // Relationships
        owner: '1'
    };
    autos['2'] = {
        _id: '2',
        patente: 'AA 123 CC',
        marca: 'Ford',
        modelo: 'Falcon',
        anho: 1976,
        color: 'Verde',
        nroChasis: 'BB1234ABCDEF',
        nroMotor: 'BBC123DEFPOI',
        // Relationships
        owner: '1'
    };

    autos['3'] = {
        _id: '3',
        patente: 'BB 123 AA',
        marca: 'Chevrolet',
        modelo: 'Corsa',
        anho: 2005,
        color: 'Negro',
        nroChasis: '9826GHRY3458',
        nroMotor: '9826GHRY3458SA',
        // Relationships
        owner: '2'
    };

    autos['4'] = {
        _id: '4',
        patente: 'CC 123 AA',
        marca: 'Fiat',
        modelo: 'Uno',
        anho: 1980,
        color: 'Blanco',
        nroChasis: '9273HEL1234',
        nroMotor: 'HELPMEIWANTTODIE',
        // Relationships
        owner: '3'
    };
    autos['5'] = {
        _id: '5',
        patente: 'CC 123 BB',
        marca: 'Fiat',
        modelo: 'Toro',
        anho: 2024,
        color: 'Blanco',
        nroChasis: '8992347HEU34',
        nroMotor: 'WRUMWRUMWRUUUUMM',
        // Relationships
        owner: '3'
    };
}

export const db: {
    personas: Record<UUID, WithId<Persona>>;
    autos: Record<UUID, WithId<Auto>>;
} = {
    personas,
    autos
};
