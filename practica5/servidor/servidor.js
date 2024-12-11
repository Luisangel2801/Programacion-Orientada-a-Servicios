const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

let calculos =[]


/*      SERVICIOS REST       */

app.delete('/calculos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const calculo = calculos.findIndex(c => c.id === id);

    console.log(calculo);

    if (calculo === -1) {
        return res.status(404).send("Operacion no encontrada");
    }
    
    const calculoEliminado = calculos.splice(calculo, 1);
    res.json(calculoEliminado[0]);
});

app.get('/calculos/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const calculo = calculos.find(c => c.id === id);
    if(!calculo){
        return res.status(404).json({error: 'El calculo no existe'});
    } 
})

app.get('/calculos', (req, res) => {
    res.json(calculos);
});

app.put('/calculos/:id', (req, res) => {

    const { id } = req.params;
    const opId = parseInt(id);
    const { intA, intB, operacion} = req.body;

    console.log('Antes de actualizar', calculos[opId]);

    calculos[opId].intA = intA || calculos[opId].intA;
    calculos[opId].intB = intB || calculos[opId].intB;
    calculos[opId].operacion = operacion || calculos[opId].operacion;

    console.log('Déspues de actualizar', calculos[opId]);
});

app.post('/calculos', (req, res) => {
    const nuevoCalculo = {
        id: calculos.length + 1,
        intA: req.body.intA,
        intB: req.body.intB,
        operacion: req.body.operacion,
    };
    calculos.push(nuevoCalculo);
    res.status(201).json(nuevoCalculo);
});

/*      SERVICIOS SOAP       */

const service = {
    CalculatorService: {
        CalculatorPort:{
            Add: function(args,callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = intA + intB;
                callback(null,{AddResult: result});
            },
            Pow: function(args,callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = Math.pow(intA,intB);
                callback(null,{PowResult: result});
            },
            Mult: function(args,callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = intA * intB;
                callback(null,{MultResult: result});
            },
            Div: function(args,callback){
                const intA = args.intA;
                const intB = args.intB;
                if (intB === 0) {
                    callback(new Error("No se puede realizar la división por cero"));
                } else {
                    const result = intA / intB;
                    callback(null, { DivResult: result });
                }
            }
        }
    }
}


const wsdlPath = path.join(__dirname,'requerimientos.wsdl');
const wsdl = fs.readFileSync(wsdlPath,'utf8');

app.listen(PORT, () => {
    soap.listen(app, '/calculator', service, wsdl);
    console.log(`Servicio REST corriendo en http://localhost:${PORT}`);
    console.log(`Servicio SOAP corriendo en http://localhost:${PORT}/calculator`);
  });