import { useCallback, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Register } from './classes/Register';
import { MemoryVariable } from './classes/MemoryVariable';
import { Instruction } from './classes/Instruction';
import { Flag } from './classes/Flag';

export default function App() {

  const [previousInstructions, setPreviousInstructions] = useState([]);

  const instructionList: Instruction[] = [];

  const [registerListState, setRegisterListState] = useState([
    new Register('0001', 'R1', 0),
    new Register('0010', 'R2', 0),
    new Register('0011', 'R3', 0),
    new Register('0108', 'R4', 0),
    new Register('0101', 'R5', 0),
    new Register('0110', 'R6', 0),
  ]);

  const [memoryVarListState, setMemoryVarListState] = useState([
    new MemoryVariable('1001', 'M1', 0),
    new MemoryVariable('1010', 'M2', 0),
    new MemoryVariable('1011', 'M3', 0),
    new MemoryVariable('1100', 'M4', 0),
    new MemoryVariable('1101', 'M5', 0),
    new MemoryVariable('1110', 'M6', 0),
  ]);

  const [flagListState, setFlagListState] = useState([
    new Flag('GT'),
    new Flag('LT'),
    new Flag('EQ'),
    new Flag('ZE'),
  ]);

  instructionList.push(new Instruction('0001', 'ADD', (returnRegister: Register, param1: Register, param2: Register) => {
    returnRegister.value = param1.value + param2.value;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('0010', 'SUB', (returnRegister: Register, param1: Register, param2: Register) => {
    returnRegister.value = param1.value - param2.value;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('0011', 'MPY', (returnRegister: Register, param1: Register, param2: Register) => {
    returnRegister.value = param1.value * param2.value;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('0100', 'DIV', (returnRegister: Register, param1: Register, param2: Register) => {
    returnRegister.value = Math.floor(param1.value / param2.value);
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('0101', 'MOD', (returnRegister: Register, param1: Register, param2: Register) => {
    returnRegister.value = param1.value % param2.value;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('0110', 'LOAD', (returnRegister: Register, memoryParam: MemoryVariable) => {
    returnRegister.value = memoryParam.value;
    memoryParam.value = 0;
    return returnRegister;
  }));
  instructionList.push(new Instruction('0111', 'LOADI', (returnRegister: Register, inputParam: number) => {
    returnRegister.value = inputParam;
    return returnRegister;
  }));
  instructionList.push(new Instruction('1000', 'STORE', (returnMemory: MemoryVariable, registerParam: Register) => {
    returnMemory.value = registerParam.value;
    registerParam.value = 0;
    return returnMemory;
  }));
  instructionList.push(new Instruction('1001', 'SHIFTL', (returnRegister: Register, registerParam: Register, shiftCount: number) => {
    returnRegister.value = registerParam.value << shiftCount;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('1010', 'SHIFTR', (returnRegister: Register, registerParam: Register, shiftCount: number) => {
    returnRegister.value = registerParam.value >>> shiftCount;
    if (returnRegister.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnRegister;
  }));
  instructionList.push(new Instruction('1011', 'CMP', (param1: Register, param2: Register) => {
    const tempFlags = flagListState.slice();

    if (param1.value < param2.value) {
      tempFlags[1].status = true;
    }
    else if (param1.value > param2.value) {
      tempFlags[0].status = true;
    }
    else if (param1.value === param2.value) {
      tempFlags[2].status = true;
    }

    setFlagListState(tempFlags);
  }));
  
  const [selectedOperation, setSelectedOperation] = useState(instructionList[0].name);
  const [selectedReturnParam, setSelectedReturnParam] = useState('');
  const [selectedParam1, setSelectedParam1] = useState('');
  const [selectedParam2, setSelectedParam2] = useState('');

  const [count, setCount] = useState(0);

  const executeInstruction = useCallback(() => {
    console.log(`Operation: ${selectedOperation}. Return Param: ${selectedReturnParam}. Param 1: ${selectedParam1}. Param 2: ${selectedParam2}`);
  }, [selectedOperation, selectedReturnParam, selectedParam1, selectedParam2])

  return (
    <>
      <label htmlFor='operation' >Select Operation:</label>
      <select
        name='operation'
        value={selectedOperation}
        onChange={(e) => {
          setSelectedOperation(e.target.value);
        }}
      >
        {instructionList.map((instruction) => {
          return <option key={instruction.opcode} value={instruction.name}>{instruction.name}</option>
        })}
      </select>

      <label htmlFor='returnParam'>Select Return Parameter:</label>
      <select
        name='returnParam'
        value={selectedReturnParam}
        onChange={(e) => {
          setSelectedReturnParam(e.target.value);
        }}
      >
        <option value={''}>None</option>
        {registerListState.map((register) => (
          <option key={register.binaryAddress} value={register.name}>{register.name}</option>
        ))}
        {memoryVarListState.map((memvar) => (
          <option key={memvar.binaryAddress} value={memvar.name}>{memvar.name}</option>
        ))}
      </select>

      
      <label htmlFor='param1'>Select Parameter 1:</label>
      <select
        name='param1'
        value={selectedParam1}
        onChange={(e) => {
          setSelectedParam1(e.target.value);
        }}
      >
        <option value={''}>None</option>
        {registerListState.map((register) => (
          <option key={register.binaryAddress} value={register.name}>{register.name}</option>
        ))}
        {memoryVarListState.map((memvar) => (
          <option key={memvar.binaryAddress} value={memvar.name}>{memvar.name}</option>
        ))}
      </select>

      <label htmlFor='param2'>Select Parameter 2:</label>
      <select
        name='param2'
        value={selectedParam2}
        onChange={(e) => {
          setSelectedParam2(e.target.value);
        }}
      >
        <option value={''}>None</option>
        {registerListState.map((register) => (
          <option key={register.binaryAddress} value={register.name}>{register.name}</option>
        ))}
        {memoryVarListState.map((memvar) => (
          <option key={memvar.binaryAddress} value={memvar.name}>{memvar.name}</option>
        ))}
      </select>
      <button onClick={executeInstruction}>Execute Instruction</button>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => {setCount((count) => count + 1)}}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
