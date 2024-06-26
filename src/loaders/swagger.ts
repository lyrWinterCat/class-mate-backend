import swaggerUI from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "CLASS MATE API",
      description: "CLASS MATE API SERVER TEST",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "이예림",
        url: "http://naver.com",
        email: "yelim527@naver.com",
      },
    },
    servers: [
      //https 테스트
      { url: `http://localhost:5000` },
      //원래소스
      // { url: `http://localhost:${global.port}` },

      //원래주석
      // { url: `http://localhost:${global.port}/api` },
    ],
  },
  apis: [
    "./src/api/routes/*.ts",
    "./src/api/routes/*/*.ts",
    "./src/api/routes/*/*/*.ts",
    "./src/api/routes/*/*/*/*.ts",
    "./src/api/routes/*/*/*/*/*.ts",
  ],
};

const specs = swaggerJsdoc(options);

export { swaggerUI, specs };
