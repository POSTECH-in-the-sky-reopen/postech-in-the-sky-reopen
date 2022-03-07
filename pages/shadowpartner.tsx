import * as React from "react";
import { Equipments } from 'src/interfaces/Equipments';
import { EquipableItemInfo, WeaponEquipableItemInfo, CoordiItemInfo } from 'src/entity/ItemInfo';

type appearProps = {//숫자랑 단위 쪼개서 넣어야 함
    equipments: Equipments | undefined;
    width: number | 60;
    unit: string | "vw";
};

function Shadowpartner({
    equipments,
    width,
    unit,
}: appearProps) {

    let div_width = width * 0.6 + unit
    let wid = width + unit
    let imsrc = ""
    function front_hair() {
        if (equipments !== undefined && equipments !== null && equipments.Hair !== undefined && equipments.Hair?.itemInfo !== undefined) {
            return (
                "/static/코디/앞머리_" + equipments.Hair.itemInfo.name + ".png"
            )
        }
    }

    const handleImgError = () => {
        imsrc = "transparent.png"
    }


    function back_hair() {
        if (equipments !== undefined && equipments !== null && equipments.Hair !== undefined) {
            imsrc = '/static/코디/뒷머리_' + equipments.Hair.itemInfo.name + '.png'
            let files = new Image;
            files.src = imsrc;

            if (files.complete) {
                return (
                    < img src={imsrc}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
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
    }

    function overlay() {
        if (equipments !== undefined && equipments.Deco !== undefined && equipments.Deco.itemInfo !== undefined && (equipments.Deco.itemInfo as CoordiItemInfo).layers[0] === "7") {
            imsrc = '/static/코디/오버레이_' + equipments.Deco.itemInfo.name + '.png'
            let files = new Image;
            files.src = imsrc;

            if (files.complete) {
                return (
                    <img src={imsrc}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
                        }} />
                )
            }
            else {
                return (
                    ""
                )
            }
        }
        else {
            return (
                ""
            )
        }

    }

    function cape() {
        if (equipments !== undefined && equipments.Deco !== undefined && equipments.Deco.itemInfo !== undefined && (equipments.Deco.itemInfo as CoordiItemInfo).layers[0] === "1") {
            imsrc = '/static/코디/망토_' + equipments.Deco.itemInfo.name + '.png'
            let files = new Image;
            files.src = imsrc;

            if (files.complete) {
                return (
                    <img src={imsrc}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
                        }} />
                )
            }
            else {
                return (
                    ""
                )
            }
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
                }} />
            {equipments !== undefined && equipments !== null && equipments.Suit !== undefined ?
                <img src={equipments.Suit !== undefined ? '/static/코디/옷_' + equipments.Suit.itemInfo.name + '.png' : "transparent.png"}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                    }} /> : ""
            }
            {equipments !== undefined && equipments !== null && equipments.Hair !== undefined ?
                <img src={front_hair()}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                    }} /> : ""
            }
            {equipments !== undefined && equipments !== null && equipments.Face !== undefined ?
                <img src={'/static/코디/얼굴_' + equipments.Face.itemInfo.name + '.png'}
                    style={{
                        position: "absolute",
                        width: wid,
                        objectFit: "cover",
                    }} /> : <img src={'/static/코디/얼굴_기본 얼굴.png'}
                        style={{
                            position: "absolute",
                            width: wid,
                            objectFit: "cover",
                        }} />
            }
            {overlay()}
        </div>
    );
}

export default Shadowpartner;
