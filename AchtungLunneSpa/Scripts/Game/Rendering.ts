import ClientPlayer = require("./ClientPlayer");
import ClientMap = require("./ClientMap");

module Rendering {

    export function render(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, deltaTick: number, map: ClientMap) {
        ctx.save();
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		
        renderMap(ctx, map, deltaTick);
        renderPlayers(ctx, players, deltaTick);

        ctx.restore();
    }

    function renderMap(ctx: CanvasRenderingContext2D, map: ClientMap, deltaTick: number) {
		if (map != null) {
			map.render(ctx, deltaTick);
		}
    }

    function renderPlayers(ctx: CanvasRenderingContext2D, players: Array<ClientPlayer>, deltaTick: number) {
        players.forEach(player => {
            player.draw(ctx, deltaTick);
        });
    }
}
export = Rendering;