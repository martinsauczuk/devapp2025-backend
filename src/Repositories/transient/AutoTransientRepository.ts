import { Auto, WithId, UUID, InvalidData } from '../../models';
import { AbstractTransintRepository } from './AbstractTransientRepository';
import { db } from './DB';

export class AutoTransientRepository extends AbstractTransintRepository<Auto> {
    protected collection = db.autos;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected beforeSave(entity: Auto, id?: UUID): void {
        // Validamos que exista un dueño con el ID dado
        const owner = db.personas[entity.owner];
        if (!owner) {
            throw new InvalidData({
                owner: 'The owner does not exist'
            });
        }
    }

    protected afterSave(entity: WithId<Auto>): void {
        // Guardamos el auto en dentro del dueño
        db.personas[entity.owner].autos.push(entity._id);
    }

    protected afterDelete(entity: WithId<Auto>): void {
        // Borrar el auto del dueño
        const owner = db.personas[entity.owner];
        const idx = owner.autos.indexOf(entity._id);
        owner.autos.splice(idx, 1);
    }
}
