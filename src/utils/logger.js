import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';

const setupLogger = app => {
  const logFormatString =
    ':id :remote-addr :method :url HTTP/:http-version :status :res[content-type] :res[content-length] - :response-time[0] ms';

  morgan.token('id', req => req.id);

  app.use((req, _res, next) => {
    req.id = uuidv4();
    next();
  });

  app.use(morgan(logFormatString));
};

export default setupLogger;
