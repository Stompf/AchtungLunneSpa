import ClientPlayer = require("./ClientPlayer");
import Map = require("./map");

module Rendering {

    export function render(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, deltaTick: number, map: Map) {
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        renderMap(ctx, map, deltaTick);
        renderPlayers(ctx, players, deltaTick);

        ctx.restore();
    }

    function renderMap(ctx: CanvasRenderingContext2D, map: Map, deltaTick: number) {
        map.render(ctx, deltaTick);
    }

    function renderPlayers(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, deltaTick: number) {
        players.forEach(player => {
            player.draw(ctx, deltaTick);
        });
    }
}
export = Rendering;