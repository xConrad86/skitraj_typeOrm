const swaggerJsDoc = require("swagger-jsdoc")

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Skitraj API",
        version: "1.0"
      }        
    },
    apis: ['index.ts']
}

export const swaggerDocs = swaggerJsDoc(swaggerOptions)
console.log("Swagger documentation : ", swaggerDocs)
