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

async function obtenerOperacion() {
    const response = await fetch(`${REST_URL}`);
    const data = await response.json();
    console.log("Cálculos:" , data);
}
/*
async function actualizarOperacion(id, intA, intB, operacion) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ intA, intB, operacion })
    });
    const calculoActualizado = await response.json();
    console.log("Cálculo actualizado:", calculoActualizado);
    return calculoActualizado;
}
*/
async function eliminarOperacion(id) {
    const response = await fetch(`${REST_URL}/${id}`, {
        method: 'DELETE',
    })
    if(response.ok){
        console.log(`Operación con ID ${id} eliminada`);
    }else{
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
        for(;;){
            console.log('\n===========================');
            console.log('Selecciona una opción:');
            console.log('1. Obtener Cálculos');
            console.log('2. Agregar Cálculo');
            console.log('3. Editar Cálculo');
            console.log('4. Eliminar Cálculo');
            console.log('5. Salir');
            console.log('===========================');
            const metodo = await askQuestion('Seleccione el número del método REST (1-4): ');
            
            if (!['1', '2', '3', '4','5'].includes(metodo)) {
                console.log('Error: Debe seleccionar un método REST válido');
                rl.close();
                return;
            }

            if(metodo === '1'){
                await obtenerOperacion();
            }else if(metodo === '2'){
                const intA = await askQuestion('Ingrese el primer número (intA): ');
                const intB = await askQuestion('Ingrese el segundo número (intB): ');

                const num1 = parseFloat(intA);
                const num2 = parseFloat(intB);

                if (isNaN(num1) || isNaN(num2)) {
                    console.log('Error: Debe ingresar números válidos');
                    rl.close();
                    return;
                }
                console.log('\n***************************');
                console.log('Opciones de operación:');
                console.log('1. Suma');
                console.log('2. Potencia');
                console.log('3. Multiplicación');
                console.log('4. División');
                console.log('***************************');
                const operacion = await askQuestion('Seleccione el número de la operación (1-4): ');

                // Validar operación
                if (!['1', '2', '3', '4'].includes(operacion)) {
                    console.log('Error: Debe seleccionar una operación válida');
                    rl.close();
                    return;
                }
                const calculo = await enviarNumerosREST(num1, num2, operacion);
                await realizarOperacionSOAP(calculo.intA, calculo.intB, calculo.operacion);
            }else if(metodo === '3'){
                console.log('Método no implementado');
                /*
                const id = await askQuestion('Ingrese el ID de la operación a actualizar: ');
                const A = await askQuestion('Ingrese el primer número (intA): ');
                const B = await askQuestion('Ingrese el segundo número (intB): ');
                const op = await askQuestion('Ingrese el número de la operación (1-4): ');
                await actualizarOperacion(id, A, B, op);
                */
            }else if(metodo === '4'){
                const id = await askQuestion('Ingrese el ID de la operación a eliminar: ');
                await eliminarOperacion(id);
            }else if(metodo === '5'){
                break;
            }else{
                console.log('No se seleccionó un método válido');
            }
        }
        rl.close();
    } catch (error) {
        console.error('Ocurrió un error:', error);
        rl.close();
    }
}

main().catch(console.error);