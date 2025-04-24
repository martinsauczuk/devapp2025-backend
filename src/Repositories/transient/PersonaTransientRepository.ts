import { Temporal } from 'temporal-polyfill';
import { InvalidData, Persona, UUID, WithId } from '../../Models';
import { AbstractTransintRepository } from './AbstractTransientRepository';
import { db } from './DB';

export class PersonaTransientRepository extends AbstractTransintRepository<Persona> {
    protected collection = db.personas;

    protected beforeSave(entity: Persona, id?: UUID): void {
        // Por defecto una persona comienza sin autos
        if (!id) {
            entity.autos = [];
        }
        // La fecha, si es string, debe ser transformada a un Temporal
        // (Aunque esto sería bueno que ocurra al recibir el dato en el
        // body, pero recién vamos a ver esto más adelante)
        if (typeof entity.fechaDeNacimiento === 'string') {
            // P.D. Por tipos, no debería ocurrir, estamos haciendo un
            // abuso, sabiendo que en runtime puede pasar, lo ideal es que no pase
            const dateParts = (entity.fechaDeNacimiento as string).split('-');
            const date = new Temporal.PlainDate(Number(dateParts[0]), Number(dateParts[1]), Number(dateParts[2]));
            entity.fechaDeNacimiento = date;
        }
        // Verificamos que todos los autos de la persona existan
        for (const auto of entity.autos) {
            if (!db.autos[auto]) {
                throw new InvalidData({
                    autos: "Not all the given id's exist"
                });
            }
        }
    }

    protected beforeDelete(entity: WithId<Persona>): void {
        // Borramos todos los autos asociados a la persona
        for (const auto of entity.autos) {
            delete db.autos[auto];
        }
    }
}
