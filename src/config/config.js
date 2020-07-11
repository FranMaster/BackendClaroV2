require('./GlobalEnv')
const config={
    port:process.env.PORT,
    database:process.env.DBCONECT,
    caducidadToken:process.env.CADUCIDAD_TOKEN,
    seed:process.env.SEED
}
module.exports=config