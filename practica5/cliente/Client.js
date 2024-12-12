import fetch from 'node-fetch';
import soap from 'soap';
import readline from 'readline';

const REST_URL = 'http://localhost:3000/calculos';
const SOAP_URL = 'http://localhost:3000/calculator?wsdl';

// Crear interfaz de lectura
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer preguntas y obtener respuestas
const askQuestion = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
};

/* Interacción Servicios REST */
async function enviarNumerosREST(intA, intB, operacion) {
    console.log("Enviando números y operación a través de REST...");
    const response = await fetch(REST_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intA, intB, operacion }),
    });
    const nuevoCalculo = await response.json();
    console.log("Cálculo creado:", nuevoCalculo);
    return nuevoCalculo;
}
/*
async function obtenerOperacion(id) {
    const response = await fetch(`${REST_URL}/${id}`);
    console.log('entro en obtener');
    const data = await response.json();

    console.log(data);
}*/
/*
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
    const data = response.json();
    console.log(data);
}*/
/* Interacción Servicios SOAP */
async function realizarOperacionSOAP(intA, intB, operacion) {
    console.log("Realizando operación a través de SOAP...");
    const client = await soap.createClientAsync(SOAP_URL);
    let result;

    switch (operacion) {
        case '1':
            result = await client.AddAsync({intA, intB});
            console.log(`Resultado de la suma (${intA} + ${intB}):`, result[0].AddResult);
            break;
        case '2':
            result = await client.PowAsync({intA, intB});
            console.log(`Resultado de la potencia(${intA} ^ ${intB}):`, result[0].PowResult);
            break;
        case '3':
            result = await client.MultAsync({intA, intB});
            console.log(`Resultado de la multiplicación (${intA} * ${intB}):`, result[0].MultResult);
            break;
        case '4':
            result = await client.DivAsync({intA, intB});
            console.log(`Resultado de la división (${intA} / ${intB}):`, result[0].DivResult);
            break;
        default:
            console.log("Operación no válida");
            break;
    }
}
  
/* Función principal */
async function main() {
    try {
        console.log('Selecciona un método REST')
        console.log('1. GET')
        console.log('2. POST')
        console.log('3. PUT')
        console.log('4. DELETE')
        const metodo = await askQuestion('Seleccione el número del método REST (1-4): ');

        if (!['1', '2', '3', '4'].includes(metodo)) {
            console.log('Error: Debe seleccionar un método REST válido');
            rl.close();
            return;
        }


        switch (metodo) {
            case '1':
                console.log('GET');
                break;
            case '2':
                const intA = await askQuestion('Ingrese el primer número (intA): ');
                const intB = await askQuestion('Ingrese el segundo número (intB): ');

                const num1 = parseFloat(intA);
                const num2 = parseFloat(intB);

                if (isNaN(num1) || isNaN(num2)) {
                    console.log('Error: Debe ingresar números válidos');
                    rl.close();
                    return;
                }
                
                console.log('Opciones de operación:');
                console.log('1. Suma');
                console.log('2. Potencia');
                console.log('3. Multiplicación');
                console.log('4. División');
                
                const operacion = await askQuestion('Seleccione el número de la operación (1-4): ');

                // Validar operación
                if (!['1', '2', '3', '4'].includes(operacion)) {
                    console.log('Error: Debe seleccionar una operación válida');
                    rl.close();
                    return;
                }
                // Llamada a Servicios REST
                const calculo = await enviarNumerosREST(num1, num2, operacion);
                
                // Llamada a Servicios SOAP
                await realizarOperacionSOAP(calculo.intA, calculo.intB, calculo.operacion);
                break;
            case '3':
                console.log('PUT');
                break;
            case '4':
                console.log('DELETE');
                break;
            default:
                console.log('Método no válido');
                break;
        }
        // Actualizar
        //const update = actualizarOperacion(0, { intA: 2, intB: 3, operacion: 1});
        //Obtener operacion
        
        //const getop = await obtenerOperacion(1);
        
        // Eliminar
        //console.log('llego a eliminar casi');
        //eliminarOperacion(1);
        rl.close();
    } catch (error) {
        console.error('Ocurrió un error:', error);
        rl.close();
    }
}

main().catch(console.error);