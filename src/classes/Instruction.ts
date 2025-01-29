import { MemoryVariable } from "./MemoryVariable";
import { Register } from "./Register";

export type InstructionFunction = (returnParam: Register | MemoryVariable,
    param1: Register | MemoryVariable, param2: Register | MemoryVariable) => Register | MemoryVariable | number
export type TwoParameterFunction = (returnVar: Register | MemoryVariable, 
    inputVar: Register | MemoryVariable, inputNumber: number) => Register | MemoryVariable | number;


export class Instruction {
    opcode: string;
    name: string;
    operation: InstructionFunction  | TwoParameterFunction;

    constructor(opcode: string, name: string, 
        operation: InstructionFunction | TwoParameterFunction) {
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