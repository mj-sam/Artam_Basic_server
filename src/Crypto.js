import express    from 'express'
import bodyParser from 'body-parser'
import cors       from 'cors'
import routes     from './routes'
import helmet     from 'helmet'
import { Brute } from './middlewares'

const corsConfig = {
  'origin': '*',
  'credentials': true,
  'preflightContinue': true,
  'methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'allowedHeaders': 'Content-Type,x-access-key,x-user-info',
  'exposedHeaders': 'x-access-key,x-user-info'
}

const app = express();
app.use(helmet());
app.use(Brute.speedLimiter);
/* app config */
app.use(express.json());
app.options('*', cors(corsConfig));
app.use('*', cors(corsConfig));


//app.use('/images/profiles', express.static('./images/users'));
app.use('/images/posts', Brute.Limiter, express.static('./images/posts'));

/* app routes */
app.use(routes)

app.listen(4848, () => {
  console.log('\x1b[32m%s\x1b[0m', 'Crypto Server is Running at: http://localhost:4848')
})
