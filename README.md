# CISS 655 Assignment 2 Question 2
This repository contains the code for Syracuse class CISS 655, assingment 2 question 2.
This is a react webapp that is an editor for our own custom CPU instruction set.

## Setup
1. Install the latest version of NodeJS https://nodejs.org/en/download
2. Clone this repo
3. Run `npm install` to install all dependencies.
4. Run `npm run dev` to run this web app in development mode
5. Open a web browser and go to http://localhost:5173
6. *Optional:* Run `npm run build` to build the web app to standard JavaScript so that it can be deployed on a web server.

## How to use
Select instruction, parameters, and enter an input parameter if the instruction requires it. Inputs must be numbers. Then press the `Execute Instruction` button.

## Instruction Set
| Instruction | Return Parmeter | Parameter 1 | Parameter 2| Input Parameter Required | Description | 
| ------------| -----------| ----------- | -----------| ----------- | -----------|
| ADD | Register | Register | Register | No | Adds values from two registers and returns the sum to the return register. Sets zero flag if returned value is zero. |
| SUB | Register | Register | Register | No | Subtracts values from two registers and returns the sum to the return register. Sets zero flag if returned value is zero. |
| MPY | Register | Register | Register | No | Multiplies values from two registers and returns the sum to the return register. Sets zero flag if returned value is zero. |
| DIV | Register | Register | Register | No | Performs integer division on values from two registers and returns the sum to the return register. Sets zero flag if returned value is zero. |
| MOD | Register | Register | Register | No | Calculates the remainder from dividing values from two registers and returns the sum to the return register. Sets zero flag if returned value is zero. |
| LOAD | Register | Memory Address | None | No | Loads a value from a memory address and places it in the return register. Removes value from memory address. |
| LOADI | Register | None | None | Yes | Loads a value from input and places it in the return register. This memory address is F or 1111. |
| STORE | Memory Address | Register | None | No | Stores a value from a register into a memory address. This value is removed from the register. |
| SHIFTL | Register | Register | None | Yes | Performs a bitwise shift to the left based on the specified numerical input. |
| SHIFTR | Register | Register | None | Yes | Performs a bitwise shift to the Right based on the specified numerical input. |
| CMP | None | Register | Register | No | Compares to registers and sets the appropriate flag. |

## Flags

| Name | Description                              |
|------|------------------------------------------|
| GT   | Parameter 1 is greater than parameter 2. |
| LT   | Parameter 1 is less than parameter 2.    |
| EQ   | Parameter 1 is equal to parameter 2.     |
| ZE   | Returned parameter is zero.              |

## Registers
| Name | Hex Address |
| ---- | ----------- |
| R1   | 1           |
| R2   | 2           |
| R3   | 3           |
| R4   | 4           |
| R5   | 5           |
| R6   | 6           |

## Memory Addresses
| Name | Hex Address |
| ---- | ----------- |
| M1   | 9           |
| M2   | A           |
| M3   | B           |
| M4   | C           |
| M5   | D           |
| M6   | E           |
| Input| F           |