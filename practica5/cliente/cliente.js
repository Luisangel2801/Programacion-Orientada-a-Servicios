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

async function obtenerOperaciones() {
    const response = await fetch(`${REST_URL}`);
    const data = await response.json();
    console.log("Cálculos:" , data);
}

async function actualizarOperacion(id, intA, intB, operacion) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intA, intB, operacion })
    });
    if (response.ok) {
        const calculoActualizado = await response.json();
        console.log("Cálculo actualizado:", calculoActualizado);
        return calculoActualizado;
    } else {
        console.log("Error al actualizar la operación. Verifica el ID.");
    }
}

async function eliminarOperacion(id) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'DELETE',
    });
    if(response.ok){
        console.log(`Operación con ID ${id} eliminada`);
    } else {
        console.log(`Error al eliminar la operación con ID ${id}`);
    }
}

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
        while (true) {
            console.log('\n===========================');
            console.log('Selecciona una opción:');
            console.log('1. Obtener Cálculos');
            console.log('2. Agregar Cálculo');
            console.log('3. Editar Cálculo');
            console.log('4. Eliminar Cálculo');
            console.log('5. Salir');
            console.log('===========================');
            const metodo = await askQuestion('Seleccione el número del método REST (1-5): ');

            if (!['1', '2', '3', '4', '5'].includes(metodo)) {
                console.log('Error: Debe seleccionar un método REST válido');
                continue;
            }

            if (metodo === '1') {
                await obtenerOperaciones();
            } else if (metodo === '2') {
                const intA = parseFloat(await askQuestion('Ingrese el primer número (intA): '));
                const intB = parseFloat(await askQuestion('Ingrese el segundo número (intB): '));
                console.log('\n***************************');
                console.log('Opciones de operación:');
                console.log('1. Suma');
                console.log('2. Potencia');
                console.log('3. Multiplicación');
                console.log('4. División');
                console.log('***************************');
                const operacion = await askQuestion('Seleccione el número de la operación (1-4): ');

                await enviarNumerosREST(intA, intB, operacion);
            } else if (metodo === '3') {
                await obtenerOperaciones();
                const id = parseInt(await askQuestion('Ingresa el ID de la operación a editar: '));
                const intA = parseFloat(await askQuestion('Ingrese el nuevo valor para intA: '));
                const intB = parseFloat(await askQuestion('Ingrese el nuevo valor para intB: '));
                console.log('\n***************************');
                console.log('Opciones de operación:');
                console.log('1. Suma');
                console.log('2. Potencia');
                console.log('3. Multiplicación');
                console.log('4. División');
                console.log('***************************');
                const operacion = await askQuestion('Seleccione el número de la operación (1-4): ');

                await actualizarOperacion(id, intA, intB, operacion);
            } else if (metodo === '4') {
                const id = parseInt(await askQuestion('Ingrese el ID de la operación a eliminar: '));
                await eliminarOperacion(id);
            } else if (metodo === '5') {
                console.log('Saliendo...');
                break;
            }
        }
    } catch (error) {
        console.error('Ocurrió un error:', error);
    } finally {
        rl.close();
    }
}

main();
