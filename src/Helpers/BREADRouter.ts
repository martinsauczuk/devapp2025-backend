import { Router } from 'express';
import { BREADController } from '../Controllers';

export const BREADRouter = <TEntity, TDto>(controller: BREADController<TEntity, TDto>) => {
    const router = Router();

    router.get('/', controller.browse.bind(controller));
    router.get('/:id', controller.read.bind(controller));
    router.put('/:id', controller.edit.bind(controller));
    router.post('/', controller.add.bind(controller));
    router.delete('/:id', controller.delete.bind(controller));

    return router;
};
