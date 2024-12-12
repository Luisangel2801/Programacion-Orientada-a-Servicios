const soap = require('soap');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

let calculos =[]


/*      SERVICIOS REST       */

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