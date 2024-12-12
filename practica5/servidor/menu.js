const readline = require('readline');
const { getAllOperations } = require("./src/controllers/operationController");

// Crear interfaz de lectura
const rl = readline.createInterface({
 input: process.stdin,
 output: process.stdout,
});

// Preguntar al usuario
const askQuestion = (query) => {
 return new Promise((resolve) => rl.question(query, (answer) => resolve(answer.trim())));
};

// Opciones del menú principal
const menuOpts = [
 { value: '1', name: '1. Agregar operación' },
 { value: '2', name: '2. Editar operación' },
 { value: '3', name: '3. Borrar operación' },
 { value: '4', name: '4. Buscar operación' },
 { value: '5', name: '5. Ordenar operaciones' },
 { value: '0', name: '0. Salir' },
];

// Mostrar menú principal
const inquirerMenu = async () => {
 console.clear();
 console.log('========================');
 console.log(' Seleccione una opción ');
 console.log('========================\n');

 menuOpts.forEach((opt) => console.log(opt.name));
 console.log('');

 const option = await askQuestion('Seleccione una opción: ');
 return option;
};

// Pausa
const pause = async () => {
 await askQuestion('\nPresiona ENTER para continuar\n');
};

// Mostrar lista de operaciones para seleccionar
const showOperationList = async (operations) => {
 console.log('\nLista de operaciones:\n');
 operations.forEach((operation, index) => {
   console.log(`${index + 1}. ${operation.operacion} (ID: ${operation.id})`);
 });
 console.log('');

 const selectedIndex = await askQuestion('Selecciona el número de la operación: ');
 const index = parseInt(selectedIndex, 10) - 1;

 if (index >= 0 && index < operations.length) {
   return operations[index];
 }

 console.log('Selección inválida.');
 return null;
};

// Seleccionar operación
const selectOperation = async () => {
 console.clear();
 console.log('========================');
 console.log(' Lista de operaciones ');
 console.log('========================\n');

 const operations = await getAllOperations();

 if (operations.length > 0) {
   const selectedOperation = await showOperationList(operations);
   return selectedOperation;
 } else {
   console.log('No hay operaciones disponibles.');
   return null;
 }
};

// Leer entrada del usuario
const readInput = async (message, required = true) => {
 let value;
 do {
   value = await askQuestion(`${message}: `);
   if (required && value.length === 0) {
     console.log('Por favor ingresa un valor válido.');
   }
 } while (required && value.length === 0);

 return value;
};

// Confirmar acción
const confirm = async (message) => {
 const response = await askQuestion(`${message} (s/n): `);
 return response.toLowerCase() === 's';
};

// Elegir criterio de ordenamiento
const chooseSortCriteria = async () => {
 const sortOptions = [
   { value: 'operacion', name: '1. Nombre de Operación' },
   { value: 'intA', name: '2. Intervalo A' },
   { value: 'intB', name: '3. Intervalo B' },
   { value: 'id', name: '4. ID' },
 ];

 console.log('\nSelecciona el criterio de ordenamiento:\n');
 sortOptions.forEach((opt, index) => {
   console.log(`${index + 1}. ${opt.name}`);
 });

 const selectedIndex = await askQuestion('Selecciona una opción: ');
 const index = parseInt(selectedIndex, 10) - 1;

 if (index >= 0 && index < sortOptions.length) {
   return sortOptions[index].value;
 }

 console.log('Selección inválida.');
 return 'operacion'; // Valor predeterminado
};

module.exports = {
 inquirerMenu,
 pause,
 showOperationList,
 selectOperation,
 readInput,
 confirm,
 chooseSortCriteria
};