import fetch from 'node-fetch';
import soap from 'soap';

const REST_URL = 'http://localhost:3000/calculos';
const SOAP_URL = 'http://localhost:3000/calculator?wsdl';


/* Interacción Servicios REST */
async function enviarNumerosREST(intA, intB, operacion) {
    console.log("Enviando números y operación a través de REST...");
    const response = await fetch(REST_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intA,intB,operacion}),
        });
    const nuevoCalculo = await response.json();
    console.log("Cálculo creado:", nuevoCalculo);
    return nuevoCalculo;
}

/* Interacción Servicios SOAP */
async function realizarOperacionSOAP(intA, intB, operacion) {
    console.log("Realizando operación a través de SOAP...");
    const client = await soap.createClientAsync(SOAP_URL);
    let result;

    switch (operacion) {
        case 1:
            result = await client.AddAsync({intA, intB});
            console.log(`Resultado de la suma (${intA} + ${intB}):`, result[0].AddResult);
            break;
        default:
            console.log("Operación no válida");
            break;
    }
}
  
/* Función principal (Opcional) */
async function main() {

    /*Datos de entrada*/
    const intA = 70;
    const intB = 5;
    const operacion = 1; 
        /*  
            1: Suma
            2: Multiplicación
            3: División 
            4: Potencia
        */

    /* Llamada a Servicios REST */
    const calculo = await enviarNumerosREST(intA, intB, operacion);
  
    /* Llamada a Servicios SOAP */
    await realizarOperacionSOAP(calculo.intA, calculo.intB, calculo.operacion);
  }
  

main().catch(console.error);
  