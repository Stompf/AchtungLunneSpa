module Team {
    export function toString(team: SPATest.ServerCode.Team) {
        switch (team) {
            case SPATest.ServerCode.Team.RED:
                return "Team Red";
            case SPATest.ServerCode.Team.BLUE:
                return "Team Blue";
            default:
                return "undefined";
        }
    }

	export function serverToGameEntity(team: SPATest.ServerCode.Team) {
		switch (team) {
            case SPATest.ServerCode.Team.RED:
                return SPATest.ServerCode.Team.RED;
            case SPATest.ServerCode.Team.BLUE:
                return SPATest.ServerCode.Team.BLUE;
            default:
                return SPATest.ServerCode.Team.RED;
        }
	}
}
export = Team;