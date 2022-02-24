import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    OneToOne,
    Column,
} from "typeorm";
import { Player } from "./Player";

export const ACHIEVE = { CONDITION: 0 , NAME: 1, HONORED: 2, DETAIL: 3 }

export const LEVEL_ACHIEVE = [
    [0, "", "",""],
    [2, "나는야 자랑스러운 포스텍의 새내기 용사", "새내기 용사","2레벨 달성"],
    [17, "후훗 저는 1지역을 마스터했습니다", "1지역 정복자","17레벨 달성"],
    [35, "아닛! 내가 2지역을 해치웠다니!", "2지역 정복자","35레벨 달성"],
    [52, "3지역은 너무 이지하다", "3지역 정복자","52레벨 달성"],
    [69, "자, 이제 한 지역 남았다", "4지역 정복자","69레벨 달성"],
    [
        78,
        "78레벨 달성한 사람만 엘리베이터 탈 수 있대",
        "78 엘리베이터 자격증 보유자",
        "78레벨 달성"
    ],
    [85, "모든 지역을 개척한 나, 제법 멋질지도", "천공의 섬 정복자","85레벨 달성"],
];

// SOCI, SENS, CALC, LOGC, MEMR, NONE
export const SOCI_ACHIEVE = [
    [0, "", "",""],
    [5, "새내기 중 날 모르는 사람은 없겠지?", "핵인싸","친화 속성 장비 아이템 5종류 획득"],
    [10, "포스텍은 전부 제가 접수합니다", "친화를 지배하는 자","친화 속성 장비 아이템 10종류 획득"],
]

export const SENS_ACHIEVE = [
    [0, "", "",""],
    [5, "이과 감성도 감성이긴 하지", "감성충만","감성 속성 장비 아이템 5종류 획득"],
    [10, "새벽 감성에,,,취한다,,,", "감성을 지배하는 자","감성 속성 장비 아이템 10종류 획득"]
]

export const CALC_ACHIEVE = [
    [0, "", "",""],
    [5, "어릴 적부터 난 계산을 했어. 천재였지", "인간계산기","계산 속성 장비 아이템 5종류 획득"],
    [10, "공학용 계산기 따위는 필요 없어", "계산을 지배하는 자","계산 속성 장비 아이템 10종류 획득"],
]

export const LOGC_ACHIEVE = [
    [0, "", "",""],
    [5, "위-잉 전자두뇌 풀가동 중", "컴퓨터 두뇌","논리 속성 장비 아이템 5종류획득"],
    [10, "내가 컴퓨터이고 컴퓨터가 나이다", "논리를 지배하는 자","논리 속성 장비 아이템 10종류 획득"],
]

export const MEMR_ACHIEVE = [
    [0, "", "",""],
    [5, "파이 백 자리는 우습지ㅋㅋ", "암기의 달인","암기 속성 장비 아이템 5종류 획득"],
    [10, "분반 친구들 이름은 진작 다 외웠다구", "암기를 지배하는 자","암기 속성 장비 아이템 10종류 획득"],
]

export const ITEM_ACHIEVE = [
    SOCI_ACHIEVE, SENS_ACHIEVE, CALC_ACHIEVE, LOGC_ACHIEVE, MEMR_ACHIEVE
]

export const MONEYUSED_ACHIEVE = [
    [0, "", "",""],
    [3000, "코디에 제법 진심인 편", "진심코디","3,000골드 이상 소모"],
    [5000, "이 구역의 패션왕이 탄생했다", "패션왕","5,000골드 이상 소모"],
    [10000, "엔드 컨텐츠는 역시 코디지", "코디 없이 못 살아","10,000골드 이상 소모"],
]

export const CLOUDTOWERFLOOR_ACHIEVE = [
    [0, "", "",""],
    [1, "응애 나 구름탑 새내기", "입문 등반가","최고 기록 1층 이상"],
    [8, "영차영차 곧 올라갑니다", "초보 등반가","최고 기록 8층 이상"],
    [16, "16층 공기 달다 달아", "노련한 등반가","최고 기록 16층 이상"],
    [24, "24층이라니 너무 높아서 어지러워요", "마스터 등반가","최고 기록 24층 이상"],
    [32, "40층까지 단 여덟 걸음", "등반에 통달한 자","최고 기록 32층 이상"],
    [40, "나는 이미 구름 위에 있도다", "신선","최고 기록 40층"],
]

@Entity()
export class Honored extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne((type) => Player, (player) => player.honored)
    player: Player;

    @Column("int", {
        default: 0,
    })
    level: number;

    @Column("simple-array")
    items: number[]

    @Column("int", {
        default: 0,
    })
    moneyUsed: number;

    @Column("int", {
        default: 0,
    })
    cloudTowerFloor: number;

    @Column("int", {
        default: 0,
    })
    honoredInd: number;

    @Column("simple-array")
    names: string[];
}
