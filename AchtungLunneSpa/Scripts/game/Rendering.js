define(["require", "exports"], function (require, exports) {
    var Rendering;
    (function (Rendering) {
        function render(ctx, players, deltaTick, map) {
            ctx.save();
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderMap(ctx, map, deltaTick);
            renderPlayers(ctx, players, deltaTick);
            ctx.restore();
        }
        Rendering.render = render;
        function renderMap(ctx, map, deltaTick) {
            map.render(ctx, deltaTick);
        }
        function renderPlayers(ctx, players, deltaTick) {
            players.forEach(function (player) {
                player.draw(ctx, deltaTick);
            });
        }
    })(Rendering || (Rendering = {}));
    return Rendering;
});
//# sourceMappingURL=Rendering.js.map