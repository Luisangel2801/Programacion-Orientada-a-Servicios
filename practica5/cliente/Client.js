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

async function obtenerOperacion(id) {
    const response = await fetch(`${REST_URL}/${id}`);

    const data = response.json();

    console.log(data);
}

async function actualizarOperacion(id, {intA, intB, operacion}) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({intA, intB, operacion})
    })
}

async function eliminarOperacion(id) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'DELETE',
    })
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
        case 2:
            result = await client.PowAsync({intA, intB});
            console.log(`Resultado de la potencia(${intA} ^ ${intB}):`, result[0].PowResult);
            break;
        case 3:
            result = await client.MultAsync({intA, intB});
            console.log(`Resultado de la multiplicación (${intA} * ${intB}):`, result[0].MultResult);
            break;
        case 4:
            result = await client.DivAsync({intA, intB});
            console.log(`Resultado de la división (${intA} / ${intB}):`, result[0].DivResult);
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
    const operacion = 2; 
        

    /* Llamada a Servicios REST */
    const calculo = await enviarNumerosREST(intA, intB, operacion);
    // Actualizar
    const update = actualizarOperacion(0, { intA: 2, intB: 3, operacion: 1});
    //Obtener operacion
    const getop = await obtenerOperacion(1);
    console.log(getop);
    // Eliminar
    const deleteOp = eliminarOperacion(1);

    const op = await (1,4, 3);
    console.log(op);
  
  }
  

main().catch(console.error);
  