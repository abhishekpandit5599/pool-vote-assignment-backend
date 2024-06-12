import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Pooling System API',
    description: 'API documentation for the Pooling System project',
  },
  host: 'localhost:5000/api',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/index.ts']; // adjust the path as necessary

swaggerAutogen()(outputFile, endpointsFiles, doc);
