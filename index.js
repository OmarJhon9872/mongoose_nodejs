const mongoose = require('mongoose');
require('dotenv').configure('./.env');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Conectado"))
    .catch(()=>console.log("Error"));

// Definicion del modelo
const carSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        lowercase: true,
        // uppercase: true,
        trim: true,
        minLength: 2,
        maxLength: 10,
        enum: ["company1", "company2"]
    },
    model: String,
    price: {
        type: Number,
        required: function(){
            return this.sold;
        }
    },
    year: {
        type: Number,
        min: 2000,
        max: 2050,
        get: y => Math.round(y)
    },
    sold: {
        type: Boolean,
        required: true
    },
    extras: [String],
    date: {
        type: Date, 
        default: Date.now()
    }
});
const Car = mongoose.model('cars', carSchema);

crearCar()

// OPERACIONES
// Actualizar carro 2
async function deleteCar(id){

    const car = await Car.deleteOne(
        {_id: id}
    );

    console.log(car);
}

// Actualizar carro 2
async function updateCar2(id){

    const car = await Car.updateOne(
        {_id: id}, 
        {$set: {year: 10000, company: "Mia 2"}}
    );

    console.log(car);
}

// Actualizar carro
async function updateCar(id){

    const car = await Car.findById(id);

    if(!car) return;

    car.company = "MI COMPAÑIA";
    car.year = 2999;
    const res = await car.save()

    console.log(res);
}

// Paginacion de elementos
async function getPaginatedCars(){

    const pageNumber = 1;
    const pageSize = 2;
    const cars = await Car   
                        .find()                     
                        .skip((pageNumber - 1) * pageNumber)
                        .limit(pageSize)
    console.log(cars);
}

// Mas filtros con and or 
async function getMoreFilterAndOrCars(){
    const companyName = 'bmw'
    const cars = await Car   
                        .find()                     
                        .or([{year: 2010}, {year: 2019}])
                        /* .and([{year: 2010}]) */
                        .sort({price: 1})
                        .limit(1)
                        /* .count() */
    console.log(cars);
}

// Mas filtros con in y nin
async function getMoreFilterInNinCars(){
    const companyName = 'bmw'
    const cars = await Car
                        // .find({year: {$in: [2010]}})
                        .find({year: {$nin: [2010]}})
                        .sort({price: 1})
                        .limit(1)
    console.log(cars);
}

// Mas filtros
async function getMoreFilterCars(){
    const companyName = 'bmw'
    const cars = await Car
                        .find({$or: [{company:companyName}, {sold: true}]}, {_id: 0,price: 1})
                        .sort({price: 1})
                        .limit(1)
    console.log(cars);
}

// Filtrar coches
async function getCompanyAndSoldFilterCars(){
    const cars = await Car.find({company: 'bmw', sold: false});
    console.log(cars);
}

// Ver todos los carros
async function getCars(){
    const cars = await Car.find();
    console.log(cars)
}

// Crear carro
async function crearCar(){
    try{
        const car = new Car({
            company: 'bmw',
            model: 'FMde23S23',
            price: 43422,
            year: 2010,
            // sold: true,
            extras: ['Good', 'pretty']        
        });
        const resultado = await car.save();
        console.log(resultado);
    }catch(e){
        console.log(e.message)
    }
}