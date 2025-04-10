import { UUID, WithId } from '../models';

export interface IService<TEntity, TListings> {
    allForListings(): WithId<TListings>[];
    getById(id: UUID): WithId<TEntity>;
    create(newEntity: TEntity): WithId<TEntity>;
    update(id: UUID, entity: Partial<TEntity>): WithId<TEntity>;
    deleteById(id: UUID): void;
}
