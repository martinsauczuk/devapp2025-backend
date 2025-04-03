// Importamos nuestras dependencias
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import process from 'process';
import { Persona, PersonaListings } from './model/persona';
import { UUID, WithId } from './model/helper-types';
import { Auto, AutoListings } from './model/auto';

// Creamos nuestra app express
const app = express();
// Leemos el puerto de las variables de entorno, si no está, usamos uno por default
const port = process.env.PORT || 9000;

// Configuramos los plugins
// Más adelante intentaremos entender mejor cómo funcionan estos plugins
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

/*************** DATABASE ******************/
// Usamos un Record (un diccionario) al que accedemos por ID.
// Esto permite acceder en O(1) a un elemento si se tiene el ID,
// vs. O(N) si solo usamos una lista.
const db: {
    personas: Record<UUID, WithId<Persona>>;
    autos: Record<UUID, WithId<Auto>>;
} = {
    personas: {},
    autos: {}
};
// ¿Los autos están duplicados al ponerlos en su propia colección?
// No, porque va a haber un único auto, dentro de la persona, y aca
// solo almacenamos la referencia.

/*************** ENDPOINTS ******************/

// Para estandarizar las rutas de forma fácil, vamos a usar esta variable como auxiliar.
let currentEntityUrl: string = '';

// Personas (BREAD) - no validations
currentEntityUrl = '/personas';

// Browse
app.get(currentEntityUrl + '/', (_req: Request, res: Response<WithId<PersonaListings>[]>) => {
    // Primero obtenemos la totalidad de las entidades de la colección
    const entidades = Object.values(db.personas);
    // Ahora nos quedamos de cada una solo con los datos necesarios para el listado
    const entidadesListing = entidades.map((p) => ({
        _id: p._id,
        dni: p.dni,
        nombre: p.nombre,
        apellido: p.apellido
    }));
    // Y ahora preparamos el response
    res.status(200).json(entidadesListing);
});

// Read
app.get(currentEntityUrl + '/:id', (req: Request<{ id: string }, WithId<Persona>>, res: Response<WithId<Persona>>) => {
    // Primero buscamos el parámetro de la URL
    const id = req.params.id;
    // Obtenemos la entidad con dicho ID
    const entidad = db.personas[id];
    // Si no estaba, se prepara el response como 404
    if (!entidad) {
        res.status(404).json();
    } else {
        // Si está la persona, se devuelve
        res.status(200).json(entidad);
    }
});

// Edit
app.put(
    currentEntityUrl + '/:id',
    (req: Request<{ id: string }, WithId<Persona>, Partial<Persona>>, res: Response<WithId<Persona>>) => {
        // Primero buscamos el parámetro de la URL
        const id = req.params.id;
        // Obtenemos la entidad con dicho ID
        const entidad = db.personas[id];
        // Si no estaba, se prepara el response como 404
        if (!entidad) {
            res.status(404).json();
        } else {
            // Si está la entidad, se actualiza
            // VALIDAMOS LOS DATOS QUE LLEGARON EN EL BODY
            // TODO
            // Actualizamos en la colección
            db.personas[id] = { ...entidad, ...req.body };
            // Y devolvemos la entidad actualizada
            res.status(202).json(db.personas[id]);
        }
    }
);

// Add
app.post(currentEntityUrl + '/', (req: Request<never, WithId<Persona>, Persona>, res: Response<WithId<Persona>>) => {
    // Creamos un nuevo UUID para usar
    const uuid = crypto.randomUUID();
    // Obtenemos la entidad que viene en el body
    const entidad = req.body;
    // VALIDAMOS LA PERSONA
    // TODO
    // Creamos una nueva entidad con ID
    const entidadConId = { ...{ autos: [] }, ...entidad, _id: uuid };
    // La guardamos en la base
    db.personas[uuid] = entidadConId;
    // Devolvemos el response con la entidad actualizada
    res.status(201).json(entidadConId);
});

// Delete
app.delete(currentEntityUrl + '/:id', (req: Request<{ id: string }>, res: Response<never>) => {
    // Primero buscamos el parámetro de la URL
    const id = req.params.id;
    // Obtenemos la entidad con dicho ID
    const entidad = db.personas[id];
    // Si no estaba, se prepara el response como 404
    if (!entidad) {
        res.status(404).json();
    } else {
        // Si está la entidad, se borra (junto con todas las entidades asociadas)
        const autosDePersona = entidad.autos;
        autosDePersona.forEach((a) => {
            const idDeAuto = (a as WithId<Auto>)._id;
            delete db.autos[idDeAuto];
        });
        // Actualizamos en la colección
        delete db.personas[id];
        // Y mandamos el response
        res.status(200).json();
    }
});

// Autos (BREAD)
currentEntityUrl = '/autos';

// Browse
app.get(currentEntityUrl + '/', (req: Request, res: Response<WithId<AutoListings>[]>) => {
    // Puede que venga el ID de una persona por queryParam
    const owner = req.query['owner'];
    if (owner && typeof owner === 'string') {
        // Obtenemos la entidad con dicho ID
        const entidad = db.personas[owner];
        // Si no estaba, se prepara el response como 404
        if (!entidad) {
            res.status(404).json();
        } else {
            // Si está la entidad, devolvemos los autos de esa persona
            const autosListing = (entidad.autos as WithId<Auto>[]).map((p) => ({
                _id: p._id,
                patente: p.patente,
                marca: p.marca,
                modelo: p.modelo,
                anho: p.anho
            }));
            // Y ahora preparamos el response
            res.status(200).json(autosListing);
        }
    } else {
        // Sino, con todos
        // Primero obtenemos la totalidad de las entidades de la colección
        const autos = Object.values(db.autos);
        // Ahora nos quedamos de cada una solo con los datos necesarios para el listado
        const autosListing = autos.map((p) => ({
            _id: p._id,
            patente: p.patente,
            marca: p.marca,
            modelo: p.modelo,
            anho: p.anho
        }));
        // Y ahora preparamos el response
        res.status(200).json(autosListing);
    }
});

// Read
app.get(currentEntityUrl + '/:id', (req: Request<{ id: string }, WithId<Auto>>, res: Response<WithId<Auto>>) => {
    // Primero buscamos el parámetro de la URL
    const id = req.params.id;
    // Obtenemos la entidad con dicho ID
    const entidad = db.autos[id];
    // Si no estaba, se prepara el response como 404
    if (!entidad) {
        res.status(404).json();
    } else {
        // Si está la persona, se devuelve
        res.status(200).json(entidad);
    }
});

// Edit
app.put(
    currentEntityUrl + '/:id',
    (req: Request<{ id: string }, WithId<Auto>, Partial<Auto>>, res: Response<WithId<Auto>>) => {
        // Primero buscamos el parámetro de la URL
        const id = req.params.id;
        // Obtenemos la entidad con dicho ID
        const entidad = db.autos[id];
        // Si no estaba, se prepara el response como 404
        if (!entidad) {
            res.status(404).json();
        } else {
            // Si está la entidad, se actualiza
            // VALIDAMOS LOS DATOS QUE LLEGARON EN EL BODY
            // TODO
            // Actualizamos en la colección
            db.autos[id] = { ...entidad, ...req.body };
            // Y devolvemos la entidad actualizada
            res.status(202).json(db.autos[id]);
        }
    }
);

// Add
app.post(
    '/personas/:id' + currentEntityUrl + '/',
    (req: Request<{ id: string }, WithId<Auto>, Auto>, res: Response<WithId<Auto>>) => {
        // El add de auto es especial, pues se crean dentro de una persona
        // Primero buscamos el parámetro de la URL
        const id = req.params.id;
        // Obtenemos la entidad con dicho ID
        const persona = db.personas[id];
        // Si no estaba, se prepara el response como 404
        if (!persona) {
            res.status(404).json();
        } else {
            // Creamos un nuevo UUID para usar
            const uuid = crypto.randomUUID();
            // Obtenemos la entidad que viene en el body
            const entidad = req.body;
            // VALIDAMOS EL AUTO
            // TODO
            // Creamos una nueva entidad con ID
            const entidadConId = { ...entidad, _id: uuid };
            // La guardamos en la base
            db.autos[uuid] = entidadConId;
            persona.autos.push(entidadConId);
            // Devolvemos el response con la entidad actualizada
            res.status(201).json(entidadConId);
        }
    }
);

// Delete
app.delete(currentEntityUrl + '/:id', (req: Request<{ id: string }>, res: Response<never>) => {
    // Primero buscamos el parámetro de la URL
    const id = req.params.id;
    // Obtenemos la entidad con dicho ID
    const entidad = db.autos[id];
    // Si no estaba, se prepara el response como 404
    if (!entidad) {
        res.status(404).json();
    } else {
        // Si está la entidad, se borra (hay que borrarlo de la persona que lo tiene)
        // esta es una forma poco feliz de hacerlo, pero por ahora alcanza.
        for (const p of Object.values(db.personas)) {
            let found: boolean = false;
            for (let i = 0; i < p.autos.length; i++) {
                const a = p.autos[i] as WithId<Auto>;
                if (a._id === id) {
                    p.autos.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }

        // Actualizamos en la colección
        delete db.autos[id];
        // Y mandamos el response
        res.status(200).json();
    }
});

/*************** FIN ENDPOINTS ******************/

// Levantamos el servidor en el puerto que configuramos
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
