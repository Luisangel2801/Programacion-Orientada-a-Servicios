const soap = require('soap');

// Cambiar dirección IP por la de la máquina que corre el servidor
const url = 'http://10.213.1.152:3000/calculator?wsdl';

const requestArgs = {
    intA: 100,
    intB: 5
};

soap.createClient(url, (err, client) => {
    if (err) throw err;

    client.Add(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la suma:', result.AddResult);
    });
    client.Sub(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la resta:', result.SubResult);
    });
    client.Mult(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la multiplicación:', result.MultResult);
    });
    client.Div(requestArgs, (err, result) => {
        if (err) throw err;
        console.log('Resultado de la división:', result.DivResult);
    });
});