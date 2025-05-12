export class Tile {
    value: number;

    constructor(value: number) {
        this.value = value
    }

    render(): HTMLDivElement {
        const tile = document.createElement('div')
        tile.className = "tile"
        tile.textContent = this.value > 0 ? this.value.toString() : ""
        return tile
    }

}