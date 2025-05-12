export const createEmptyBoard = (size = 4):number[][] =>{
    return Array.from({length:size},()=> Array(size).fill(0))
}