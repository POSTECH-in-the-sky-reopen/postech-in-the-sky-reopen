import * as React from "react";
import { Equipments } from 'src/interfaces/Equipments';
import { EquipableItemInfo, WeaponEquipableItemInfo, CoordiItemInfo } from 'src/entity/ItemInfo';
import Shadowpartner from './shadowpartner';

type appearProps = {//숫자랑 단위 쪼개서 넣어야 함
    equipments: Equipments | undefined;
    width: number | 60;
    unit: string | "vw";
};

function Profile2({
    equipments,
    width,
    unit,
}: appearProps) {

    let div_width = width * 0.6 + unit
    let wid = width + unit
    let acc_wid = width * 0.5 + unit
    let acc_left = width * 0.6 + unit
    let acc_top = width * 0.05 + unit
    let imsrc = ""
    function front_hair() {
        if (equipments !== undefined && equipments !== null && equipments.Hair !== undefined && equipments.Hair?.itemInfo !== undefined) {
            return (
                "/static/코디/앞머리_" + equipments.Hair.itemInfo.name + ".png"
            )
        }
    }

    const handleImgError = () => {
        imsrc = "/static/transparent.png"
    }


    function back_hair() {
        if (equipments !== undefined && equipments !== null && equipments.Hair !== undefined && (equipments.Hair.itemInfo as CoordiItemInfo).layers.length === 2) {
            return (
                < img src={"/static/코디/뒷머리_" + equipments.Hair.itemInfo.name + ".png"}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '1',
                    }}
                    onError={handleImgError} />
            )
        }
        else {
            return (
                ""
            )
        }
    }

    function overlay() {
        if (equipments !== undefined && equipments.Deco !== undefined && equipments.Deco.itemInfo !== undefined && (equipments.Deco.itemInfo as CoordiItemInfo).layers[0] === "7") {
            return (
                <img src={"/static/코디/오버레이_" + equipments.Deco.itemInfo.name + ".png"}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '8',
                    }} />
            )
        }
        else {
            return (
                ""
            )
        }

    }

    function cape() {
        if (equipments !== undefined && equipments.Deco !== undefined && equipments.Deco.itemInfo !== undefined && (equipments.Deco.itemInfo as CoordiItemInfo).layers[0] === "1") {
            return (
                <img src={'/static/코디/망토_' + equipments.Deco.itemInfo.name + '.png'}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '2',
                    }} />
            )
        }
        else {
            return (
                ""
            )
        }
    }


    return (
        <div
            style={{//사진이 들어갈 자리
                width: div_width,
                overflow: "hidden"
            }}
        >
            {back_hair()}
            {cape()}
            <img src="/static/틀.png"
                style={{
                    width: wid,
                    objectFit: "cover",
                    position: "absolute",
                    zIndex: '3',
                }} />
            {equipments !== undefined && equipments.Suit !== undefined ?
                <img src={'/static/코디/옷_' + equipments.Suit.itemInfo.name + '.png'}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '4',
                    }} /> :
                <img src="/static/코디/옷_기본 옷.png"
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '4',
                    }} />
            }
            {equipments !== undefined && equipments !== null && equipments.Weapon !== undefined ?
                equipments.Weapon.itemInfo.name === '동명이인 두명' ?
                    <div
                        style={{
                            width: wid,
                            zIndex: '-1',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                width: wid,
                                objectFit: 'cover',
                                left: '10%',
                                filter: 'brightness(0%)',
                            }}
                        >
                            <Shadowpartner
                                equipments={equipments}
                                width={100}
                                unit={"%"} />
                        </div>
                        <div
                            style={{
                                position: 'absolute',
                                width: wid,
                                objectFit: 'cover',
                                left: '-10%',
                                filter: 'brightness(0%)',
                            }}
                        >
                            <Shadowpartner
                                equipments={equipments}
                                width={100}
                                unit={"%"} />
                        </div>
                    </div> :
                    <img src={'/static/무기/' + equipments.Weapon.itemInfo.name + '.png'}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
                            zIndex: '5',
                        }} /> : ""
            }
            {equipments !== undefined && equipments !== null && equipments.Hair !== undefined ?
                <img src={front_hair()}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '6',
                    }} /> : ""
            }
            {equipments !== undefined && equipments !== null && equipments.Face !== undefined ?
                <img src={'/static/코디/얼굴_' + equipments.Face.itemInfo.name + '.png'}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                        zIndex: '7',
                    }} /> : <img src={'/static/코디/얼굴_기본 얼굴.png'}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
                            zIndex: '7',
                        }} />
            }
            {equipments !== undefined && equipments !== null && equipments.Accessory !== undefined ?
                <div className='item-box-acc-profile'
                    style={{ position: "absolute", backgroundColor: "transparent", width: acc_wid, top: acc_top, left: acc_left }}>
                    <img src={'/static/장신구/' + equipments.Accessory.itemInfo.name + '.png'}
                        className='item-img-box'
                        style={{
                            objectFit: "contain",
                            backgroundColor: "transparent",
                            width: acc_wid
                        }} /></div> : ""
            }
            {overlay()}
        </div>
    );
}

export default Profile2;
