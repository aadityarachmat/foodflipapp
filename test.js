// Primitive datatypes

let score; // variable, datatype is inferred by assignment
score = 50;

let playerName = "Budi";
alert(playerName);
playerName = "Andy"; // double quotes can, but try to stick with single quotes

const pi = 3.14; // constant

console.log(score); // prints 50
console.log(typeof score); // prints number

let isLogin = true; // boolean

console.log('"'); // prints "

let Snippet = '<h1 class="header">This is a header</h1>'; // dataType = string, but in HTML

// Prompt + response

let visitor = prompt("Siapakah namamu?"); // provides a text box for the user to enter data
let greeting = "Hello " + visitor + "!";
alert(greeting);

// How to add/concatenate

let newNumber = 2;
newNumber += 8;
console.log(newNumber); // prints 10

let aString = "Hello";
let newString = aString + "Marshmellow";
console.log(newString); // prints Hello Marshmellow

let isRaining = true; // use is prefix on boolean variables
