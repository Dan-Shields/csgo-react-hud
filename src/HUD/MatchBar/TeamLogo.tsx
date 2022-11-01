import React from "react";
import { Team } from "csgogsi-socket";
import * as I from "../../api/interfaces";
import { apiUrl } from "./../../api/api";

export default class TeamLogo extends React.Component<{
    team?: Team | I.Team | null;
    height?: number;
    width?: number;
}> {
    render() {
        const { team } = this.props;
        if (!team) return null;
        const { logo } = team;
        return (
            <div className={`logo`}>
                {logo ? (
                    <img
                        src={logo}
                        width={this.props.width}
                        height={this.props.height}
                        alt={"Team logo"}
                    />
                ) : (
                    ""
                )}
            </div>
        );
    }
}
