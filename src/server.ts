// Importamos nuestras dependencias
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import process from 'process';
import { BREADRouter } from './Helpers';
import { AutoController, PersonaController } from './Controllers';

// Creamos nuestra app express
const app = express();
// Leemos el puerto de las variables de entorno, si no está, usamos uno por default
const port = process.env.PORT || 3000;

// Configuramos los plugins
// Más adelante intentaremos entender mejor cómo funcionan estos plugins
app.use(cors());
app.use(helmet());
app.use(express.json());

/*************** ENDPOINTS ******************/
app.use('/personas', BREADRouter(new PersonaController()));
app.use('/autos', BREADRouter(new AutoController()));
/*************** FIN ENDPOINTS ******************/

// Levantamos el servidor en el puerto que configuramos
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
