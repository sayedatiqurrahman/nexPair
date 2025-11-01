import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'NexGen Pair',
        description: 'Peer to Peer Connection',
        version: '1.0.0',
    },
    host: 'localhost:5000',
    schemes: ['http', 'https'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./server.js']; // your main express file or route folder

swaggerAutogen()(outputFile, endpointsFiles, doc);