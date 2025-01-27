import { useCallback, useState } from 'react';
import './App.css';
import { Register } from './classes/Register';
import { MemoryVariable } from './classes/MemoryVariable';
import { Instruction, PreviousInstruction} from './classes/Instruction';
import { Flag } from './classes/Flag';
import BinaryToHex from './functions/BinaryToHex';


export default function App() {

  const [previousInstructions, setPreviousInstructions] = useState(new Array<PreviousInstruction>);

  const instructionList: Instruction[] = [];

  const [registerListState] = useState([
    new Register('0001', 'R1', 1),
    new Register('0010', 'R2', 1),
    new Register('0011', 'R3', 0),
    new Register('0100', 'R4', 0),
    new Register('0101', 'R5', 0),
    new Register('0110', 'R6', 0),
  ]);

  const [memoryVarListState] = useState([
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

  instructionList.push(new Instruction('0001', 'ADD', (returnParam: Register, param1: Register, param2: Register) => {
    returnParam.value = param1.value + param2.value;
    if (returnParam.value === 0) {
      const tempFlags = flagListState.slice();
      tempFlags[3].status = true;
      setFlagListState(tempFlags);
    }
    return returnParam;
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
      return 1;
    }
    else if (param1.value > param2.value) {
      tempFlags[0].status = true;
      return 0;
    }
    else if (param1.value === param2.value) {
      tempFlags[2].status = true;
      return 2;
    }

    setFlagListState(tempFlags);
    return -1;
  }));
  
  const [selectedOperation, setSelectedOperation] = useState(instructionList[0].name);
  const [selectedReturnParam, setSelectedReturnParam] = useState('');
  const [selectedParam1, setSelectedParam1] = useState('');
  const [selectedParam2, setSelectedParam2] = useState('');
  const [inputParam, setInputParam] = useState('');

  const executeInstruction = useCallback(() => {

    // Make sure to call one of the set state functions
    // so that the results actually render.
    const tempFlags = flagListState.slice();

    tempFlags.forEach((flag) => flag.status = false);
    setFlagListState(tempFlags);

    const instruction = instructionList.find((instruction) => instruction.name === selectedOperation);
    const returnParam = registerListState.find((register) => register.name === selectedReturnParam);
    const param1 = registerListState.find((register) => register.name === selectedParam1);
    const param2 = registerListState.find((register) => register.name === selectedParam2);
    let previousInstruction = new PreviousInstruction();

    if (selectedOperation.toUpperCase() === 'ADD' || selectedOperation.toUpperCase() === 'SUB' 
      || selectedOperation.toUpperCase() === 'MPY' || selectedOperation.toUpperCase() === 'DIV'
      || selectedOperation.toUpperCase() === 'MOD') {
      if (selectedReturnParam.split('')[0].toUpperCase() === 'R' && selectedParam1.split('')[0].toUpperCase() === 'R'
        && selectedParam2.split('')[0].toUpperCase() === 'R') {


          if (instruction && returnParam && param1 && param2) {
              instruction.operation(returnParam, param1 as number & Register & MemoryVariable, param2 as Register & number);
              previousInstruction = {
                name: `${instruction.name} ${returnParam.name} ${param1.name} ${param2.name}`,
                hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}${BinaryToHex(param1.binaryAddress)}${BinaryToHex(param2.binaryAddress)}`
              }
          }

        }
    }
    const tempPrevInstructs = previousInstructions.slice();
    tempPrevInstructs.push(previousInstruction);
    setPreviousInstructions(tempPrevInstructs);


  }, [selectedOperation, selectedReturnParam, selectedParam1, selectedParam2, 
    inputParam, memoryVarListState, registerListState, flagListState, setFlagListState, 
    instructionList, previousInstructions, setPreviousInstructions]);

  return (
    <>
      <div>
        <label htmlFor='operation' >Operation:</label>
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

        <label htmlFor='returnParam'>Return Parameter:</label>
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

        
        <label htmlFor='param1'>Parameter 1:</label>
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

        <label htmlFor='param2'>Parameter 2:</label>
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
        <label htmlFor='inputParam'>Input Parameter:</label>
        <input 
          name='inputParam' 
          value={inputParam} 
          placeholder='Number Inputs Only'
          type='number'
          onChange={(e) => setInputParam(e.target.value)}
          >
          </input>
        <button onClick={executeInstruction}>Execute Instruction</button>
      </div>
      
      <div className='register-list-container'>
          <p className='register-list-header'>Registers</p>
          <div className='register-list-header-container'>
            <p className='register-name-header'>Name</p>
            <p className='register-address-binary-header'>Binary Address</p>
            <p className='register-address-hex-header'>Hex Address</p>
            <p className='register-value-header'>Value</p>
          </div>
          {registerListState.map((register) => (
            <div key={register.name} className='register-container'>
              <p className='register-name'>{register.name}</p>
              <p className='register-binary-address'>{register.binaryAddress}</p>
              <p className='register-hex-address'>{BinaryToHex(register.binaryAddress)}</p>
              <p className='register-value'>{register.value}</p>
            </div>
          ))}
      </div>

      <div className='memory-address-list-container'>
        <p className='memory-address-list-header'>Memory Addresses</p>
          <div className='memory-address-list-header-container'>
            <p className='memory-address-name-header'>Name</p>
            <p className='memory-address-address-binary-header'>Binary Address</p>
            <p className='memory-address-address-hex-header'>Hex Address</p>
            <p className='memory-address-value-header'>Value</p>
          </div>

          {memoryVarListState.map((memVar) => (
            <div key={memVar.name} className='memory-address-container'>
              <p className='memory-address-name'>{memVar.name}</p>
              <p className='memory-address-binary-address'>{memVar.binaryAddress}</p>
              <p className='memory-address-hex-address'>{BinaryToHex(memVar.binaryAddress)}</p>
              <p className='memory-address-value'>{memVar.value}</p>
            </div>
          ))}
      </div>

      <div className='flag-list-container'>
        <p className='flag-list-header'>Flags</p>
          <div className='flag-list-header-container'>
            <p className='flag-name-header'>Name</p>
            <p className='flag-status-header-'>status</p>
          </div>

          {flagListState.map((flag) => (
            <div key={flag.name} className='flag-container'>
              <p className='flag-name'>{flag.name}</p>
              <p className='flag-status'>{flag.status}</p>
            </div>
          ))}
      </div>

      <div className='previous-instructions-list-container'>
        <p className='previous-instructions-list-header'>Previous Instructions</p>
          <div className='previous-instructions-list-header-container'>
            <p className='previous-instructions-name-header'>Code</p>
            <p className='previous-instructions-hex-header'>Hex</p>
          </div>

          {previousInstructions.map((prevInst) => (
            <div key={Math.random()} className='previous-instruction-container'>
              <p className='previous-instruction-name'>{prevInst.name}</p>
              <p className='previous-instruction-hex'>{prevInst.hex}</p>
            </div>
          ))}
      </div>

    </>
  )
}
