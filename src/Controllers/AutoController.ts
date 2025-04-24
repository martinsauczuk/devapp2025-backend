import { Request, Response } from 'express';
import { BREADController } from './BREADController';
import { AutoService } from '../services/AutoService';
import { Auto } from '../Models/index';
import { UUID, WithId } from '../Models/UUID';
import { ServiceFactory } from '../services/ServiceFactory';
import { IService } from '../services/index';
import { AutoDTO } from '../DTO/index';

export class AutoController extends BREADController<Auto, AutoDTO> {
    protected service: IService<Auto, AutoDTO> = ServiceFactory.autoService();

    public browse(
        req: Request<never, WithId<AutoDTO>[], never, { owner: UUID }>,
        res: Response<WithId<AutoDTO>[]>
    ): void {
        const entities = !req.query.owner
            ? // Primero obtenemos la totalidad de las entidades desde el service, para listado
              this.service.allForListings()
            : (this.service as AutoService).allOfOwner(req.query.owner);
        // Y ahora preparamos el response
        res.status(200).json(entities);
    }
}
