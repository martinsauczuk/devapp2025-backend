import { InvalidData, NonExistentElement, UUID, WithId } from '../Models';
import { IRepository } from '../repositories';
import { IService } from './IService';

export abstract class AbstractService<TEntity, TListings, TRepository extends IRepository<TEntity>>
    implements IService<TEntity, TListings>
{
    protected abstract repository: TRepository;

    protected abstract toListings(entity: WithId<TEntity>): WithId<TListings>;

    protected abstract validate(entity: TEntity): Record<string, string> | undefined;

    public allForListings(): WithId<TListings>[] {
        // Pedir al repositorio todos los datos
        const entities = this.repository.all();
        // Quedarme con los elementos del listing
        return entities.map((e) => this.toListings(e));
    }

    public getById(id: UUID): WithId<TEntity> {
        // Obtener la entidad actualmente en la base
        const actualEntity = this.repository.get(id);
        // Si no está la entidad, lanza un error
        if (!actualEntity) throw new NonExistentElement();
        // Devolver la entidad
        return actualEntity;
    }

    public create(newEntity: TEntity): WithId<TEntity> {
        // Validamos la entidad
        const maybeErrors = this.validate(newEntity);
        // If there are errors, throw an exception
        if (maybeErrors) throw new InvalidData(maybeErrors);
        // Guardamos la entidad
        const savedEntity = this.repository.save(newEntity);
        // Y devolvemos el resultado
        return savedEntity;
    }

    public update(id: UUID, entity: Partial<TEntity>): WithId<TEntity> {
        // Obtener la entidad actualmente en la base
        const actualEntity = this.repository.get(id);
        // Si no está la entidad, lanza un error
        if (!actualEntity) throw new NonExistentElement();
        // Obtener la entidad completa a guardar
        const newEntity = { ...actualEntity, ...entity };
        // Validamos la entidad
        const maybeErrors = this.validate(newEntity);
        // If there are errors, throw an exception
        if (maybeErrors) throw new InvalidData(maybeErrors);
        // Guardamos la entidad y devolvemos el resultado
        return this.repository.save(newEntity, id);
    }

    public deleteById(id: UUID): void {
        // Obtener la entidad actualmente en la base
        const actualEntity = this.repository.get(id);
        // Si no está la entidad, lanza un error
        if (!actualEntity) throw new NonExistentElement();
        // Borramos la entidad
        this.repository.delete(id);
    }
}
