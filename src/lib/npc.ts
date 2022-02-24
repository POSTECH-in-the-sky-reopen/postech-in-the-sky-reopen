import { NpcLog } from "src/interfaces/Log";
import { gachaMultiple } from "./random";

export const npc = [
    {
        name: "제작자 김준서",
        statement:
            "방학 때 무엇을 해야할지 모르시겠다구요? 교양 학점을 낭낭하게 채울 수 있는 타대 학점교류를 추천합니다! 다양한 학교에서 더 다양한 수업을 들을 수 있답니다.",
    },
    {
        name: "제작자 이지은",
        statement:
            "방학 동안 세탁소에 침구를 맡길 수 있습니다! 창고에 보관하거나 집에 보내는 대신 세탁소를 이용하는 것도 좋아요!",
    },  
    {
        name: "제작자 양승원",
        statement:
            "hemos.postech.ac.kr에서 Adobe, Microsoft Office 등의 프로그램을 무료(!)로 다운로드할 수 있습니다! Windows도 다운로드 가능하답니다.",
    },
    {
        name: "제작자 이채린",
        statement:
            "POVIS>전자게시>Student Notice Board에 각종 장학금, 근로 모집 등의 정보가 올라오니 잘 확인하시면 좋은 기회를 얻을 수 있습니다!",
    },
    {
        name: "제작자 정유진",
        statement:
            "단기유학 한 학기는 너무 길다고 느끼는 당신을 위해 여름방학 동안 해외 대학에 교환학생으로 갈 수 있는 Summer Session이 있답니다!",
    },
    {
        name: "제작자 황윤하",
        statement:
            "버거킹 어플에서 얻을 수 있는 쿠폰으로 훨씬 저렴한 가격에 버거킹을 이용할 수 있답니다!",
    },
    {
        name: "제작자 황주원",
        statement:
            "학교 인근의 많은 음식점에서 공대 할인 서비스를 제공하니, 미리 알아두고 방문합시다!",
    }
];

export function getNpcLog(): NpcLog[] {
    let i = gachaMultiple(Array(npc.length).fill(1));
    return [
        {
            name: npc[i].name,
            EffectMessage: npc[i].statement,
            OnlyMessage: false,
        } as NpcLog,
    ];
}
