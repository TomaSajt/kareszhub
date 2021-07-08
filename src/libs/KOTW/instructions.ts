export type Instruction = RepeatInstruction | TurnRightInstruction | TurnLeftInstruction | StepInstruction | PlaceInstruction | PickUpInstruction

export type Color = 'black' | 'red' | 'green' | 'yellow' | 'blue'

export type KSNumber = number | NumberVarValue
type NumberVarValue = {
    type: 'var'
    name: string
}



type RepeatInstruction = {
    name: 'repeat'
    times: number
    children: Instruction[]
}

type TurnRightInstruction = {
    name: 'turnright'
}

type TurnLeftInstruction = {
    name: 'turnleft'
}

type StepInstruction = {
    name: 'step'
}

type PlaceInstruction = {
    name: 'place'
    color: Color
}

type PickUpInstruction = {
    name: 'pickup'
}