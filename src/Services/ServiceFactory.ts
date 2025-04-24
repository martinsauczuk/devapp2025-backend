import { IService } from './IService';
import { Auto, Persona } from '../Models';
import { AutoService } from './AutoService';
import { PersonaService } from './PersonaService';
import { AutoDTO, PersonaDTO } from '../DTO';

export abstract class ServiceFactory {
    private static personaServiceSingletonInstance: IService<Persona, PersonaDTO> | undefined = undefined;
    private static autoServiceSingletonInstance: IService<Auto, AutoDTO> | undefined = undefined;

    public static personaService(): IService<Persona, PersonaDTO> {
        if (ServiceFactory.personaServiceSingletonInstance === undefined) {
            ServiceFactory.personaServiceSingletonInstance = new PersonaService();
        }
        return ServiceFactory.personaServiceSingletonInstance;
    }

    public static autoService(): IService<Auto, AutoDTO> {
        if (ServiceFactory.autoServiceSingletonInstance === undefined) {
            ServiceFactory.autoServiceSingletonInstance = new AutoService();
        }
        return ServiceFactory.autoServiceSingletonInstance;
    }
}
