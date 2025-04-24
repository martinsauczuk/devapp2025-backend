import { Temporal } from 'temporal-polyfill';
import { PersonaDTO } from '../DTO';
import { Persona, WithId } from '../Models';
import { IRepository, RepositoryFactory } from '../Repositories';
import { AbstractService } from './AbstractService';

export class PersonaService extends AbstractService<Persona, PersonaDTO, IRepository<Persona>> {
    protected repository = RepositoryFactory.personaRepository();

    protected toListings(entity: WithId<Persona>): WithId<PersonaDTO> {
        return {
            _id: entity._id,
            dni: entity.dni,
            nombre: entity.nombre,
            apellido: entity.apellido
        };
    }

    protected validate(entity: Persona): Record<string, string> | undefined {
        const errors: Record<string, string> = {};

        if (entity['dni'] === undefined) {
            errors['dni'] = 'The field is required';
        }
        if (entity['dni'] && typeof entity['dni'] !== 'string') {
            errors['dni'] = 'The field must be a string';
        }

        if (entity['nombre'] === undefined) {
            errors['nombre'] = 'The field is required';
        }
        if (entity['nombre'] && typeof entity['nombre'] !== 'string') {
            errors['nombre'] = 'The field must be a string';
        }

        if (entity['apellido'] === undefined) {
            errors['apellido'] = 'The field is required';
        }
        if (entity['apellido'] && typeof entity['apellido'] !== 'string') {
            errors['apellido'] = 'The field must be a string';
        }

        if (entity['fechaDeNacimiento'] === undefined) {
            errors['fechaDeNacimiento'] = 'The field is required';
        }
        if (
            entity['fechaDeNacimiento'] &&
            typeof entity['fechaDeNacimiento'] !== 'string' &&
            typeof entity['fechaDeNacimiento'] !== 'object' &&
            !((entity['fechaDeNacimiento'] as unknown) instanceof Temporal.PlainDate)
        ) {
            errors['fechaDeNacimiento'] = 'The field must be a string with a valid date of the shape "YYYY-MM-DD"';
        }
        if (
            entity['fechaDeNacimiento'] &&
            typeof entity['fechaDeNacimiento'] === 'string' &&
            !/[0-9]{1,4}-[0-9]{1,2}-[0-9]{1,2}/g.test(entity['fechaDeNacimiento'])
        ) {
            errors['fechaDeNacimiento'] = 'The field must be a string with a valid date of the shape "YYYY-MM-DD"';
        }

        if (entity['genero'] === undefined) {
            errors['genero'] = 'The field is required';
        }
        if (
            (entity['genero'] && typeof entity['genero'] !== 'string') ||
            (entity['genero'] !== 'masculino' && entity['genero'] !== 'femenino' && entity['genero'] !== 'no binario')
        ) {
            errors['genero'] = 'The field must be a one of "masculino", "femenino" or "no binario"';
        }

        if (entity['esDonanteDeOrganos'] === undefined) {
            errors['esDonanteDeOrganos'] = 'The field is required';
        }
        if (entity['esDonanteDeOrganos'] && typeof entity['esDonanteDeOrganos'] !== 'boolean') {
            errors['esDonanteDeOrganos'] = 'The field must be a boolean';
        }

        if (Object.keys(errors).length === 0) return undefined;
        return errors;
    }
}
