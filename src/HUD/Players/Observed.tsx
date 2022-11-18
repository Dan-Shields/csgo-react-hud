import React from "react";
import * as I from "csgogsi-socket";
import Weapon from "../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "../Indicators/Armor";
import Bomb from "../Indicators/Bomb";
import Defuse from "../Indicators/Defuse";
import "./observed.scss";
import { Bullets } from "../../assets/Icons";

interface IProps {
    player: I.Player;
}

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
    if (
        weaponOne.name === weaponTwo.name &&
        weaponOne.paintkit === weaponTwo.paintkit &&
        weaponOne.type === weaponTwo.type &&
        weaponOne.ammo_clip === weaponTwo.ammo_clip &&
        weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
        weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
        weaponOne.state === weaponTwo.state
    )
        return true;

    return false;
};

const compareWeapons = (
    weaponsObjectOne: { [key: string]: I.WeaponRaw },
    weaponsObjectTwo: { [key: string]: I.WeaponRaw }
) => {
    const weaponsOne = Object.values(weaponsObjectOne).sort(
        (a, b) => (a.name as any) - (b.name as any)
    );
    const weaponsTwo = Object.values(weaponsObjectTwo).sort(
        (a, b) => (a.name as any) - (b.name as any)
    );

    if (weaponsOne.length !== weaponsTwo.length) return false;

    return weaponsOne.every((weapon, i) =>
        compareWeapon(weapon, weaponsTwo[i])
    );
};

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
    if (
        playerOne.name === playerTwo.name &&
        playerOne.steamid === playerTwo.steamid &&
        playerOne.observer_slot === playerTwo.observer_slot &&
        playerOne.defaultName === playerTwo.defaultName &&
        playerOne.clan === playerTwo.clan &&
        playerOne.stats.kills === playerTwo.stats.kills &&
        playerOne.stats.assists === playerTwo.stats.assists &&
        playerOne.stats.deaths === playerTwo.stats.deaths &&
        playerOne.stats.mvps === playerTwo.stats.mvps &&
        playerOne.stats.score === playerTwo.stats.score &&
        playerOne.state.health === playerTwo.state.health &&
        playerOne.state.armor === playerTwo.state.armor &&
        playerOne.state.helmet === playerTwo.state.helmet &&
        playerOne.state.defusekit === playerTwo.state.defusekit &&
        playerOne.state.flashed === playerTwo.state.flashed &&
        playerOne.state.smoked === playerTwo.state.smoked &&
        playerOne.state.burning === playerTwo.state.burning &&
        playerOne.state.money === playerTwo.state.money &&
        playerOne.state.round_killhs === playerTwo.state.round_killhs &&
        playerOne.state.round_kills === playerTwo.state.round_kills &&
        playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
        playerOne.state.equip_value === playerTwo.state.equip_value &&
        playerOne.state.adr === playerTwo.state.adr &&
        playerOne.avatar === playerTwo.avatar &&
        playerOne.country === playerTwo.country &&
        playerOne.realName === playerTwo.realName &&
        compareWeapons(playerOne.weapons, playerTwo.weapons)
    )
        return true;

    return false;
};

const Player = ({ player }: IProps) => {
    const weapons = Object.values(player.weapons).map((weapon) => ({
        ...weapon,
        name: weapon.name.replace("weapon_", ""),
    }));
    const primary =
        weapons.filter(
            (weapon) =>
                !["C4", "Pistol", "Knife", "Grenade", undefined].includes(
                    weapon.type
                )
        )[0] || null;
    const secondary =
        weapons.filter((weapon) => weapon.type === "Pistol")[0] || null;
    const grenades = weapons.filter((weapon) => weapon.type === "Grenade");

    const currentWeapon = weapons.filter(
        (weapon) => weapon.state === "active"
    )[0];
    return (
        <div
            className={`player-observed ${
                player.state.health === 0 ? "dead" : ""
            }
            ${player.team.side}`}
        >
            <div className="player_data">
                <Avatar
                    steamid={player.steamid}
                    height={57}
                    width={57}
                    showSkull={false}
                    showCam={false}
                    sidePlayer={true}
                />
                <div className="dead-stats">
                    <div className="labels">
                        <div className="stat-label">K</div>
                        <div className="stat-label">A</div>
                        <div className="stat-label">D</div>
                    </div>
                    <div className="values">
                        <div className="stat-value">{player.stats.kills}</div>
                        <div className="stat-value">{player.stats.assists}</div>
                        <div className="stat-value">{player.stats.deaths}</div>
                    </div>
                </div>
                <div className="player_stats">
                    <div className="row">
                        <div className="username">
                            <div>{player.name} </div>
                            <div className="weapons">
                                <div className="grenades">
                                    {grenades.map((grenade) => [
                                        <Weapon
                                            key={`${grenade.name}-${grenade.state}`}
                                            weapon={grenade.name}
                                            active={
                                                grenade.state === "active" &&
                                                player.state.health > 0
                                            }
                                            isGrenade
                                        />,
                                        grenade.ammo_reserve === 2 ? (
                                            <Weapon
                                                key={`${grenade.name}-${grenade.state}-double`}
                                                weapon={grenade.name}
                                                active={
                                                    grenade.state ===
                                                        "active" &&
                                                    player.state.health > 0
                                                }
                                                isGrenade
                                            />
                                        ) : null,
                                    ])}
                                </div>
                                <div className="ammo">
                                    <div className="ammo_counter">
                                        {currentWeapon.ammo_clip && (
                                            <div className="ammo_clip">
                                                {(currentWeapon &&
                                                    currentWeapon.ammo_clip) ||
                                                    "-"}
                                            </div>
                                        )}
                                        {currentWeapon.ammo_reserve && (
                                            <div className="ammo_reserve">
                                                /
                                                {(currentWeapon &&
                                                    currentWeapon.ammo_reserve) ||
                                                    "-"}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ammo_icon_container">
                                        <Bullets />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`hp_bar ${
                            player.state.health <= 20 ? "low" : ""
                        }`}
                        style={{ width: `${player.state.health}%` }}
                    ></div>
                    <div className="row" style={{ maxHeight: "35px" }}>
                        <div className="health">{player.state.health}</div>

                        <div className="armor_and_utility">
                            <Bomb player={player} />
                            <Armor player={player} />
                            <Defuse player={player} />
                        </div>
                        {player.state.round_kills ? (
                            <div className="roundkills-container">
                                {new Array(player.state.round_kills)
                                    .fill(0)
                                    .map((_, i) => (
                                        <div key={i} className="roundkill" />
                                    ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

const arePropsEqual = (
    prevProps: Readonly<IProps>,
    nextProps: Readonly<IProps>
) => {
    return arePlayersEqual(prevProps.player, nextProps.player);
};

export default React.memo(Player, arePropsEqual);
