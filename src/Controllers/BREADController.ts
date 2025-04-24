import { Request, Response } from 'express';
import { WithId } from '../Models';
import { IService } from '../Services';
import { catching } from '../Helpers';

export abstract class BREADController<TEntity, TDto> {
    protected abstract service: IService<TEntity, TDto>;

    public browse(req: Request<never, WithId<TDto>[], never>, res: Response<WithId<TDto>[]>): void {
        // Primero obtenemos la totalidad de las entidades desde el service, para listado
        const entities = this.service.allForListings();
        // Y ahora preparamos el response
        res.status(200).json(entities);
    }

    public read(req: Request<{ id: string }, WithId<TEntity>>, res: Response<WithId<TEntity>>): void {
        // Primero buscamos el parámetro de la URL
        const id = req.params.id;
        try {
            // Obtenemos la entidad con dicho ID
            const entity = this.service.getById(id);
            // Si está la entidad, se devuelve
            res.status(200).json(entity);
        } catch (e) {
            catching(e, {
                NonExistentElement: () => {
                    res.status(404).json();
                }
            });
        }
    }

    public edit(req: Request<{ id: string }, WithId<TEntity>, Partial<TEntity>>, res: Response<WithId<TEntity>>): void {
        // Primero buscamos el parámetro de la URL
        const id = req.params.id;
        try {
            // Actualizamos la entidad
            const newEntity = this.service.update(id, req.body);
            // Y devolvemos la entidad actualizada en el response
            res.status(200).json(newEntity);
        } catch (e) {
            catching(e, {
                NonExistentElement: () => {
                    res.status(404).json();
                },
                InvalidData: (err) => {
                    res.status(400).json(err.errors);
                }
            });
        }
    }

    public add(req: Request<never, WithId<TEntity>, TEntity>, res: Response<WithId<TEntity>>): void {
        try {
            // Creamos la nueva entidad y devolvemos
            const newEntity = this.service.create(req.body);
            // Y devolvemos la entidad creada
            res.status(200).json(newEntity);
        } catch (e) {
            catching(e, {
                InvalidData: (err) => {
                    res.status(400).json(err.errors);
                }
            });
        }
    }

    public delete(req: Request<{ id: string }>, res: Response<never>): void {
        const id = req.params.id;
        try {
            // Borramos la entidad con dicho ID
            this.service.deleteById(id);
            // Devolvemos 200
            res.status(200).json();
        } catch (e) {
            catching(e, {
                NonExistentElement: () => {
                    res.status(404).json();
                }
            });
        }
    }
}
