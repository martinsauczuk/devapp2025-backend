import process from 'process';
import { IRepository } from './IRepository';
import { Auto, Persona } from '../Models';
import { AutoTransientRepository, PersonaTransientRepository } from './transient';

export abstract class RepositoryFactory {
    private static personaRepositorySingletonInstance: IRepository<Persona> | undefined = undefined;
    private static autoRepositorySingletonInstance: IRepository<Auto> | undefined = undefined;

    public static personaRepository(): IRepository<Persona> {
        if (RepositoryFactory.personaRepositorySingletonInstance === undefined) {
            RepositoryFactory.personaRepositorySingletonInstance =
                RepositoryFactory.getPersonaRepositoryByConfiguration();
        }
        return RepositoryFactory.personaRepositorySingletonInstance;
    }

    public static autoRepository(): IRepository<Auto> {
        if (RepositoryFactory.autoRepositorySingletonInstance === undefined) {
            RepositoryFactory.autoRepositorySingletonInstance = RepositoryFactory.getAutoRepositoryByConfiguration();
        }
        return RepositoryFactory.autoRepositorySingletonInstance;
    }

    private static getPersonaRepositoryByConfiguration(): IRepository<Persona> {
        if (process.env.REPOSITORY === 'transient') {
            return new PersonaTransientRepository();
        }
        // Default es transient
        return new PersonaTransientRepository();
    }

    private static getAutoRepositoryByConfiguration(): IRepository<Auto> {
        if (process.env.REPOSITORY === 'transient') {
            return new AutoTransientRepository();
        }
        // Default es transient
        return new AutoTransientRepository();
    }
}
