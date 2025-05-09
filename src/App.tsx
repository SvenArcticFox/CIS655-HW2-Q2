import { useCallback, useMemo, useState } from 'react';
import './App.css';
import { Register } from './classes/Register';
import { MemoryVariable } from './classes/MemoryVariable';
import { Instruction, PreviousInstruction} from './classes/Instruction';
import { Flag } from './classes/Flag';
import BinaryToHex from './functions/BinaryToHex';


export default function App() {
  // Store previous instructions here
  const [previousInstructions, setPreviousInstructions] = useState(new Array<PreviousInstruction>);

  // Create Registers
  const [registerListState] = useState([
    new Register('0001', 'R1', 1),
    new Register('0010', 'R2', 1),
    new Register('0011', 'R3', 0),
    new Register('0100', 'R4', 0),
    new Register('0101', 'R5', 0),
    new Register('0110', 'R6', 0),
  ]);
  // Create Memory addresses
  const [memoryVarListState] = useState([
    new MemoryVariable('1001', 'M1', 0),
    new MemoryVariable('1010', 'M2', 0),
    new MemoryVariable('1011', 'M3', 0),
    new MemoryVariable('1100', 'M4', 0),
    new MemoryVariable('1101', 'M5', 0),
    new MemoryVariable('1110', 'M6', 0),
  ]);
  // Create Flags
  const [flagListState, setFlagListState] = useState([
    new Flag('GT'),
    new Flag('LT'),
    new Flag('EQ'),
    new Flag('ZE'),
  ]);
  // Add instructions to the instruction list
  const instructionList = useMemo(() => [
    new Instruction('0001', 'ADD', (returnParam: Register, param1: Register, param2: Register) => {
      returnParam.value = param1.value + param2.value;
      if (returnParam.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnParam;
    }),
    new Instruction('0010', 'SUB', (returnRegister: Register, param1: Register, param2: Register) => {
      returnRegister.value = param1.value - param2.value;
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('0011', 'MPY', (returnRegister: Register, param1: Register, param2: Register) => {
      returnRegister.value = param1.value * param2.value;
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('0100', 'DIV', (returnRegister: Register, param1: Register, param2: Register) => {
      returnRegister.value = Math.floor(param1.value / param2.value);
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('0101', 'MOD', (returnRegister: Register, param1: Register, param2: Register) => {
      returnRegister.value = param1.value % param2.value;
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('0110', 'LOAD', (returnRegister: Register, memoryParam: MemoryVariable, input?: number) => {
      // keep linter happy
      input = 0
      returnRegister.value = memoryParam.value;
      memoryParam.value = input;
      return returnRegister;
    }),
    new Instruction('0111', 'LOADI', (returnRegister: Register, inputVar: Register | MemoryVariable, inputParam: number) => {
      // keep linter happy
      inputVar = new Register('', '' , inputParam);
      returnRegister.value = inputVar.value;
      return returnRegister;
    }),
    new Instruction('1000', 'STORE', (returnMemory: MemoryVariable, registerParam: Register, input?: number) => {
      // keep linter happy
      input = 0;
      returnMemory.value = registerParam.value;
      registerParam.value = input;
      return returnMemory;
    }),
    new Instruction('1001', 'SHIFTL', (returnRegister: Register, registerParam: Register, shiftCount: number) => {
      returnRegister.value = registerParam.value << shiftCount;
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('1010', 'SHIFTR', (returnRegister: Register, registerParam: Register, shiftCount: number) => {
      returnRegister.value = registerParam.value >>> shiftCount;
      if (returnRegister.value === 0) {
        const tempFlags = flagListState.slice();
        tempFlags[3].status = true;
        setFlagListState(tempFlags);
      }
      return returnRegister;
    }),
    new Instruction('1011', 'CMP', (param1: Register, param2: Register, input: number) => {
      const tempFlags = flagListState.slice();
  
      if (param1.value < param2.value) {
        tempFlags[1].status = true;
        input = 1;
      }
      else if (param1.value > param2.value) {
        tempFlags[0].status = true;
        input = 0;
      }
      else if (param1.value === param2.value) {
        tempFlags[2].status = true;
        input = 2
      }
  
      setFlagListState(tempFlags);
      input = -1
      return input;
    })

  ], [flagListState]);
  
  const [selectedOperation, setSelectedOperation] = useState(instructionList[0].name);
  const [selectedReturnParam, setSelectedReturnParam] = useState('');
  const [selectedParam1, setSelectedParam1] = useState('');
  const [selectedParam2, setSelectedParam2] = useState('');
  const [inputParam, setInputParam] = useState('');
  const [error, setError] = useState('');

  const executeInstruction = useCallback(() => {

    // Make sure to call one of the set state functions
    // so that the results actually render.
    const tempFlags = flagListState.slice();

    tempFlags.forEach((flag) => flag.status = false);
    setFlagListState(tempFlags);

    const instruction = instructionList.find((instruction) => instruction.name === selectedOperation);
    let returnParam = registerListState.find((register) => register.name === selectedReturnParam);
    if (returnParam === undefined) {
      returnParam = memoryVarListState.find((memVar) => memVar.name === selectedReturnParam); 
    }
    let param1 = registerListState.find((register) => register.name === selectedParam1);
    if (param1 === undefined) {
      param1 = memoryVarListState.find((memVar) => memVar.name === selectedParam1);
    }
    let param2 = registerListState.find((register) => register.name === selectedParam2);
    if (param2 === undefined) {
      param2 = memoryVarListState.find((memVar) => memVar.name === selectedParam2);
    }

    let previousInstruction = new PreviousInstruction();
    // Arithmetic Operations
    if (instruction?.name.toUpperCase() === 'ADD' || instruction?.name.toUpperCase() === 'SUB' 
      || instruction?.name.toUpperCase() === 'MPY' || instruction?.name.toUpperCase() === 'DIV'
      || instruction?.name.toUpperCase() === 'MOD') {
      if (returnParam?.name.split('')[0].toUpperCase() === 'R' && param1?.name.split('')[0].toUpperCase() === 'R'
        && param2?.name.split('')[0].toUpperCase() === 'R') {
          if (instruction && returnParam && param1 && param2) {
              // type casting used to keep linter happy
              instruction.operation(returnParam, param1, param2 as Register & number);
              previousInstruction = {
                name: `${instruction.name} ${returnParam.name} ${param1.name} ${param2.name}`,
                hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}${BinaryToHex(param1.binaryAddress)}${BinaryToHex(param2.binaryAddress)}`,
              }
          }
      }
      // Error handling
      else {
        // If return param is not a register
        if (returnParam?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as return parameter. Select a register for the return parameter.');
        }
        // If param1 is not a register
        else if (param1?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as parameter 1. Select a register for parameter 1.');
        }
         // If param2 is not a register
        else if (param2?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as parameter 2. Select a register for parameter 2.');
        }
        return;
      }
    }
    // Shift operations
    else if (instruction?.name.toUpperCase() === 'SHIFTL' || instruction?.name.toUpperCase() === 'SHIFTR') {
      if (returnParam?.name[0].toUpperCase() === 'R' && param1?.name[0].toUpperCase() === 'R' 
          && inputParam !== '') {
        if (instruction && returnParam && param1 && inputParam) {
          const numberInput = parseInt(inputParam);
          // type casting used to keep linter happy
          instruction.operation(returnParam, param1, numberInput as number & Register);
          previousInstruction = {
            name: `${instruction.name} ${returnParam.name} ${param1.name} ${inputParam}`,
            // Have address F at the end to represent the input address as the second parameter
            hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}${BinaryToHex(param1.binaryAddress)}F`,
          }
        }
      }
      // Error handling
      else {
         // If return param is not a register
        if (returnParam?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as return parameter. Select a register for the return parameter.');
        }
         // If param1 is not a register
        else if (param1?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as parameter 1. Select a register for parameter 1.');
        }
        // If input param is blank or not a number (number controlled through HTML)
        else if (inputParam === '') {
          setError('No number input parameter. Enter a number as the input parameter.');
        }
        return;
      }
    }
    // Compare Operation
    else if (instruction?.name.toUpperCase() === 'CMP') {
      if (param1?.name[0].toUpperCase() === 'R' && param2?.name[0].toUpperCase() === 'R') {
        if (instruction && param1 && param2) {
          // type casting and useless parameter added to keep linter happy
          instruction.operation(param1, param2, 0 as Register & number);
          previousInstruction = {
            name: `${instruction.name} ${param1.name} ${param2.name}`,
            hex: `0x${BinaryToHex(instruction.opcode)}0${BinaryToHex(param1.binaryAddress)}${BinaryToHex(param2.binaryAddress)}`,
          }
        }
      }
      // Error handling
      else {
         // If param1 is not a register
        if (param1?.name.toUpperCase() !== 'R') {
          setError('Register not selected as parameter 1. Select a register for parameter 1.');
        }
         // If param2 is not a register
        else if (param2?.name.toUpperCase() !== 'R') {
          setError('Register not selected as parameter 2. Select a register for parameter 2.');
        }
        return;
      }
    }
    // LOAD from input operation
    else if (instruction?.name.toUpperCase() === 'LOADI') {
      if (returnParam?.name[0].toUpperCase() === 'R' && inputParam !== '') {
        if (instruction && returnParam) {
          // type casting and useless parameter added to keep linter happy
          instruction.operation(returnParam, new Register('', '', 0), parseInt(inputParam) as Register & number);
          previousInstruction = {
            name: `${instruction.name} ${returnParam.name} ${inputParam}`,
            hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}F0`,
          }
        }
      }
      // Error handling
      else {
         // If return param is not a register
        if (returnParam?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as return parameter. Select a register for the return parameter.');
        }
         // If input param is blank or not a number (number controlled through HTML)
        else if (inputParam === '') {
          setError('No number input parameter. Enter a number as the input parameter.');
        }
        return;
      }
    }
    // Load from memory operation
    else if (instruction?.name.toUpperCase() === 'LOAD') {
      if (returnParam?.name[0].toUpperCase() === 'R' && param1?.name[0].toUpperCase() === 'M') {
        if (instruction && returnParam && param1) {
          // type casting and useless parameter added to keep linter happy
          instruction.operation(returnParam, param1, 0 as Register & number);
          previousInstruction = {
            name: `${instruction.name} ${returnParam.name} ${param1.name}`,
            hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}${BinaryToHex(param1.binaryAddress)}0`,
          }
        }
      }
      // Error handling
      else {
        // If return param is not a register
        if (returnParam?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as return parameter. Select a register for the return parameter.');
        }
        // If param1 is not a memory address
        else if (param1?.name[0].toUpperCase() !== 'M') {
          setError('Memory address not selected as parameter 1. Select a memory address for parameter 1.');
        }
        return;
      }
    }
    // store from register to memory operation
    else if (instruction?.name.toUpperCase() === 'STORE') {
      if (returnParam?.name[0].toUpperCase() === 'M' && param1?.name[0].toUpperCase() === 'R') {
        if (instruction && returnParam && param1) {
          // type casting and useless parameter added to keep linter happy
          instruction.operation(returnParam, param1, 0 as Register & number);
          previousInstruction = {
            name: `${instruction.name} ${returnParam.name} ${param1.name}`,
            hex: `0x${BinaryToHex(instruction.opcode)}${BinaryToHex(returnParam.binaryAddress)}${BinaryToHex(param1.binaryAddress)}0`,
          }
        }
      }
      // Error handling
      else {
        // If return param is not a memory address
        if (returnParam?.name[0].toUpperCase() !== 'M') {
          setError('Memory address not selected as return parameter. Select a memory address for the return parameter.');
        }
        // If param1 is not a register
        else if (param1?.name[0].toUpperCase() !== 'R') {
          setError('Register not selected as parameter 1. Select a register for parameter 1.');
        }
        return;
      }
    }
    // If instruction is not elected
    else {
      setError('No instruction selected');
      return;
    }
    const tempPrevInstructs = previousInstructions.slice();
    tempPrevInstructs.push(previousInstruction);
    setError('');
    setPreviousInstructions(tempPrevInstructs);


  }, [selectedOperation, selectedReturnParam, selectedParam1, selectedParam2, 
    inputParam, memoryVarListState, registerListState, flagListState, setFlagListState, 
    instructionList, previousInstructions, setPreviousInstructions]);

  return (
    <>
      <div className='instruction-bar'>
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

      {error !== '' ? <div className='error-container'>
        <p className='error-text'>Error: {error}</p>
      </div> : <></>}

      <div className='information-container'>
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
              <div className='memory-address-container'>
                <p className='memory-address-name'>Input</p>
                <p className='memory-address-binary-address'>1111</p>
                <p className='memory-address-hex-address'>{BinaryToHex('1111')}</p>
                <p className='memory-address-value'>{inputParam}</p>
              </div>
        </div>

        <div className='flag-list-container'>
          <p className='flag-list-header'>Flags</p>
            <div className='flag-list-header-container'>
              <p className='flag-name-header'>Name</p>
              <p className='flag-status-header-'>Status</p>
            </div>

            {flagListState.map((flag) => (
              <div key={flag.name} className='flag-container'>
                <p className='flag-name'>{flag.name}</p>
                <p className='flag-status'>{flag.status ? '1' : '0'}</p>
              </div>
            ))}
        </div>
      </div>

    </>
  )
}
