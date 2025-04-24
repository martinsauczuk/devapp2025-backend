import { UUID, WithId } from '../../Models';
import { IRepository } from '../IRepository';
import crypto from 'crypto';

export abstract class AbstractTransintRepository<TEntity> implements IRepository<TEntity> {
    protected abstract collection: Record<UUID, WithId<TEntity>>;

    public all(): WithId<TEntity>[] {
        return Object.values(this.collection);
    }
    public get(id: UUID): WithId<TEntity> {
        return this.collection[id];
    }
    public save(entity: TEntity, id?: UUID): WithId<TEntity> {
        this.beforeSave(entity, id);
        id = id ?? crypto.randomUUID();
        const entityWithId: WithId<TEntity> = { ...entity, _id: id };
        this.collection[id] = entityWithId;
        this.afterSave(entityWithId);
        return entityWithId;
    }
    public delete(id: UUID): boolean {
        const entity = this.collection[id];
        if (entity) {
            this.beforeDelete(entity, id);
            delete this.collection[id];
            this.afterDelete(entity);
            return true;
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected beforeSave(entity: TEntity, id?: UUID): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected afterSave(entity: WithId<TEntity>): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected beforeDelete(entity: WithId<TEntity>, _id?: UUID): void {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected afterDelete(entity: WithId<TEntity>): void {}
}
