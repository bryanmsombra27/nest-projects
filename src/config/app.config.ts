// centralizando y configurando las variables de entorno PARA TRABAJARLAS DENTRO DEL BUILDING BLOCK DE NEST, ESTO QUIERE DECIR QUE LAS VARIABLES PUEDEN SER EJECUTADAS DENTRO DE LOS MODULOS DE NEST, PARA ACCEDER A LOS VALORES FUERA DE ESTOS MODULOS SE ACCEDE DE LA MANERA TRADICIONAL:  process.env.PORT
export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB,
  port: process.env.PORT,
  defaultLimit: process.env.DEFAULT_LIMIT,
});
