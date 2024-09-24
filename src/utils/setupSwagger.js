import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import url from 'url';

const setupSwagger = app => {
  const filepath = url.fileURLToPath(import.meta.url);
  const dirpath = path.dirname(filepath);
  const swaggerDocsPath = path.join(dirpath, '..', '/docs/swagger/collections.yaml');

  const file = fs.readFileSync(swaggerDocsPath, 'utf-8');
  const swaggerDocument = YAML.parse(file);

  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
  };

  app.use('/docs/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
};

export default setupSwagger;
