import { createStream } from 'rotating-file-stream';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import url from 'url';
import path from 'path';
import morgan from 'morgan';

const generateFileName = date => {
  const formattedDate = format(date ? date : new Date(), 'yyyy-MM-dd');
  return `${formattedDate}-access.log`;
};

const setupLogger = app => {
  const filepath = url.fileURLToPath(import.meta.url);
  const dirpath = path.dirname(filepath);

  const accessLogStream = createStream(generateFileName, {
    interval: '1d',
    path: path.join(dirpath, '..', 'logs'),
  });

  const logFormatString =
    ':date[iso]: :id :remote-addr :method :url HTTP/:http-version :status :res[content-type] :res[content-length] - :response-time[0] ms';

  morgan.token('id', req => req.id);

  app.use((req, _res, next) => {
    req.id = uuidv4();
    next();
  });

  app.use(morgan(logFormatString, { stream: accessLogStream }));
  app.use(morgan(logFormatString));
};

export default setupLogger;
