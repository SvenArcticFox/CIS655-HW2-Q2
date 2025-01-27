import { MemoryVariable } from "./MemoryVariable";
import { Register } from "./Register";

export type InstructionFunction = (returnParam: Register | MemoryVariable | number,
    param1: Register | MemoryVariable | number, param2: Register | MemoryVariable | number) => Register | MemoryVariable | number
export type RegisterToRegisterFunction = (returnParam: Register, 
    param1: Register, param2: Register) => Register;
export type MemoryToRegisterFunction = (returnRegister: Register, memoryParam: MemoryVariable) => Register;
export type RegisterToMemoryFunction = (returnMemory: MemoryVariable, registerParam: Register) => MemoryVariable;
export type InputToRegisterFunction = (returnRegister: Register, inputParam: number) => Register;
export type ShiftRegisterFunction = (returnRegister: Register, inputRegister: Register, shiftCount: number) => Register;
export type CompareRegisterFunction = (param1: Register, param2: Register) => number;


export class Instruction {
    opcode: string;
    name: string;
    operation: InstructionFunction | RegisterToRegisterFunction 
    | RegisterToMemoryFunction | MemoryToRegisterFunction 
    | InputToRegisterFunction | ShiftRegisterFunction
    | CompareRegisterFunction;

    constructor(opcode: string, name: string, 
        operation: InstructionFunction | RegisterToRegisterFunction 
        | RegisterToMemoryFunction | MemoryToRegisterFunction 
        | InputToRegisterFunction | ShiftRegisterFunction
        | CompareRegisterFunction) {
        this.opcode = opcode;
        this.name = name;
        this.operation =  operation;
    }
}

export class PreviousInstruction {
    name: string;
    hex: string;

    constructor() {
        this.name = '';
        this.hex = '';
    }
}