import { AutoDTO } from '../DTO';
import { Auto, UUID, WithId } from '../Models';
import { IRepository, RepositoryFactory } from '../Repositories';
import { AbstractService } from './AbstractService';

export class AutoService extends AbstractService<Auto, AutoDTO, IRepository<Auto>> {
    protected repository = RepositoryFactory.autoRepository();

    public allOfOwner(id: UUID): WithId<AutoDTO>[] {
        // Pedir al repositorio todos los datos
        const entities = this.repository.all();
        // Filtrar por aquellos cuyo owner coincida con el dado
        const relevantEntities = entities.filter((e) => e.owner === id);
        // Quedarme con los elementos del listing
        return relevantEntities.map((e) => this.toListings(e));
    }

    protected toListings(entity: WithId<Auto>): WithId<AutoDTO> {
        return {
            _id: entity._id,
            patente: entity.patente,
            marca: entity.marca,
            modelo: entity.modelo,
            anho: entity.anho
        };
    }

    protected validate(entity: Auto): Record<string, string> | undefined {
        const errors: Record<string, string> = {};

        if (entity['patente'] === undefined) {
            errors['patente'] = 'The field is required';
        }
        if (entity['patente'] && typeof entity['patente'] !== 'string') {
            errors['patente'] = 'The field must be a string';
        }

        if (entity['marca'] === undefined) {
            errors['marca'] = 'The field is required';
        }
        if (entity['marca'] && typeof entity['marca'] !== 'string') {
            errors['marca'] = 'The field must be a string';
        }

        if (entity['modelo'] === undefined) {
            errors['modelo'] = 'The field is required';
        }
        if (entity['modelo'] && typeof entity['modelo'] !== 'string') {
            errors['modelo'] = 'The field must be a string';
        }

        if (entity['anho'] === undefined) {
            errors['anho'] = 'The field is required';
        }
        if (entity['anho'] && typeof entity['anho'] !== 'number') {
            errors['anho'] = 'The field must be a number';
        }

        if (entity['color'] === undefined) {
            errors['color'] = 'The field is required';
        }
        if (entity['color'] && typeof entity['color'] !== 'string') {
            errors['color'] = 'The field must be a string';
        }

        if (entity['nroChasis'] === undefined) {
            errors['nroChasis'] = 'The field is required';
        }
        if (entity['nroChasis'] && typeof entity['nroChasis'] !== 'string') {
            errors['nroChasis'] = 'The field must be a string';
        }

        if (entity['nroMotor'] === undefined) {
            errors['nroMotor'] = 'The field is required';
        }
        if (entity['nroMotor'] && typeof entity['nroMotor'] !== 'string') {
            errors['nroMotor'] = 'The field must be a string';
        }

        if (entity['owner'] === undefined) {
            errors['owner'] = 'The field is required';
        }
        if (entity['owner'] && typeof entity['owner'] !== 'string') {
            errors['owner'] = 'The field must be a UUID';
        }

        if (Object.keys(errors).length === 0) return undefined;
        return errors;
    }
}
