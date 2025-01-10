const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let datos = [
    {
        opcion: 4,
        num1: 10,
        num2: 0
    },
];

app.get("/usuarios",(req,res) => {
    if(datos[0].opcion == 1){                                // Suma
        res.json(datos[0].num1 + datos[0].num2);
    }else if(datos[0].opcion == 2){                          // Multiplicación
        res.json(datos[0].num1 * datos[0].num2);
    }else if(datos[0].opcion == 3){                          // División
        if(datos[0].num2 == 0){
            res.json("Imposible dividir");
        }else{
            res.json(datos[0].num1 / datos[0].num2);
        }
    }else if(datos[0].opcion == 4){                          // Potencia
        res.json(Math.pow(datos[0].num1,datos[0].num2));
    }else{
        res.json(datos);
    }
});

app.listen(PORT, () => {
    console.log(`El servidor se ejecuta en el http://127.0.0.1:${PORT}/usuarios`)
})