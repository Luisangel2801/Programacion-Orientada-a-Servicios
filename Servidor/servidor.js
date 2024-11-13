const soap = require('soap');
const express = require('express');

const fs = require('fs');       
const path = require('path');

const app = express();
const PORT = 3000;

const service = {
    CalculatorService: {
        CalculatorPort: {
            Add: function (args, callback) {
                const intA = args.intA;
                const intB = args.intB;
                const result = intA + intB;
                callback(null, { AddResult: result });
            },
            Sub: function (args, callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = intA - intB;
                callback(null, { SubResult: result });
            },
            Mult: function(args, callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = intA * intB;
                callback(null, { MultResult: result });
            },
            Div: function(args,callback){
                const intA = args.intA;
                const intB = args.intB;
                const result = intA / intB;
                callback(null, { DivResult: result });
            }
        }
    }
};

const wsdlPath = path.join(__dirname,'requerimientos.wsdl');
const wsdl = fs.readFileSync(wsdlPath,'utf8');
 
app.listen(PORT, () => {
    soap.listen(app, '/calculator', service, wsdl);
    console.log(`Servicio SOAP corriendo en http://10.213.1.152:${PORT}/calculator`);
});
