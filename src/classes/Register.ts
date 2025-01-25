export class Register {
    binaryAddress: string;
    name: string;
    value: number;

    constructor(binaryAddress: string, name: string, value: number) {
        this.binaryAddress = binaryAddress;
        this.name = name;
        this.value = value;
    }
}