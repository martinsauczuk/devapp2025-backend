import { UUID, WithId } from '../models';

export interface IRepository<TEntity> {
    all(): WithId<TEntity>[];
    get(id: UUID): WithId<TEntity>;
    save(entity: TEntity, id?: UUID): WithId<TEntity>;
    delete(id: UUID): boolean;
}
