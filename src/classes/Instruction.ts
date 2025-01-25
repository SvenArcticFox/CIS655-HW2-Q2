import { MemoryVariable } from "./MemoryVariable";
import { Register } from "./Register";

export type InstructionFunction = (returnParam: Register | MemoryVariable,
    param1: Register | MemoryVariable, param2: Register | MemoryVariable) => Register | MemoryVariable

export type RegisterToRegisterFunction = (returnParam: Register, 
    param1: Register, param2: Register) => Register | MemoryVariable;

export type MemoryToRegisterFunction = (returnRegister: Register, memoryParam: MemoryVariable) => Register;

export type RegisterToMemoryFunction = (returnMemory: MemoryVariable, registerParam: Register) => MemoryVariable;

export type InputToRegisterFunction = (returnRegister: Register, inputParam: number) => Register;

export class Instruction {
    opcode: string;
    name: string;
    operation: InstructionFunction | RegisterToRegisterFunction 
    | RegisterToMemoryFunction | MemoryToRegisterFunction | InputToRegisterFunction;

    constructor(opcode: string, name: string, 
        operation: InstructionFunction | RegisterToRegisterFunction 
        | RegisterToMemoryFunction | MemoryToRegisterFunction | InputToRegisterFunction) {
        this.opcode = opcode;
        this.name = name;
        this.operation =  operation;
    }
}