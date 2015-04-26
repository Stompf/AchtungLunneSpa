import collections = require('../collections');

class NetworkHandler {

    localNetworkPlayers: collections.Dictionary<string, collections.Dictionary<number, SPATest.ServerCode.SendUpdateGameEntity>>; 

    constructor() {
        this.localNetworkPlayers = new collections.Dictionary<string, collections.Dictionary<number, SPATest.ServerCode.SendUpdateGameEntity>>();
    }

    addUpdate(update: SPATest.ServerCode.SendUpdateGameEntity) {
        if (update == null) {
            return;
        }

        if (!this.localNetworkPlayers.containsKey(update.player.connectionId)){
            this.localNetworkPlayers.setValue(update.player.connectionId, new collections.Dictionary<number, SPATest.ServerCode.SendUpdateGameEntity>());
        }
        this.localNetworkPlayers.getValue(update.player.connectionId).setValue(update.frame, update);
    }

    checkUpdateFromServer(player: SPATest.ServerCode.Player) {
        if (player == null || !this.localNetworkPlayers.containsKey(player.connectionId)) {
            return true;
        }
        var updates = this.localNetworkPlayers.getValue(player.connectionId);
        var sentUpdate = this.localNetworkPlayers.getValue(player.connectionId).getValue(player.latestFrameUpdate);
        if (sentUpdate != null) {
            if (sentUpdate.player.position.x !== player.position.x || sentUpdate.player.position.y !== player.position.y) {
                return false;
            }
            var newDic = new collections.Dictionary<number, SPATest.ServerCode.SendUpdateGameEntity>();
            for (var i = updates.keys().indexOf(sentUpdate.frame); i < updates.size(); i++) {
                newDic.setValue(updates.keys()[i], updates.getValue(updates.keys()[i]));
            }
            this.localNetworkPlayers.setValue(player.connectionId, newDic);

        }
        return true;
    }
}
export = NetworkHandler;