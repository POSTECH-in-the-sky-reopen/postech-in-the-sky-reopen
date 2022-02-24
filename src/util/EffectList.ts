import { deepCopy } from "./DeepCopy";

export interface Effect {
    enchantSuccess: number;
    equipableDrop: number;
    enchantDrop: number;
    fatigueIncrease: number;
    equipableReinforceSuccess: number;
    equipableReinforceCost: number;
    moneyEarn: number;
    coordiCost: number;
}

export interface EffectDict {
    [details: string]: Effect;
}

const effectList: EffectDict = {
    "포카전 절대 이겨": {
        enchantSuccess: 3,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "당신을 냥집사로 임명합니다": {
        enchantSuccess: 5,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "이슬만 먹고 살아요": {
        enchantSuccess: 0,
        equipableDrop: 5,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "실눈캐는 힘을 숨기고 있다": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 5,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "새내기가 좋아하는 랜덤 게임": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 5,
        coordiCost: 0,
    },
    "조교님과 교수님도 새내기였다...": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 1,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "ㄴr는 오늘도 0ㅓ싸인고r 밤을 샌ㄷr,,,": {
        enchantSuccess: 0,
        equipableDrop: 3,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "실험은 조심히 하세요": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 3,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "휘리릭~ 대학원생으로 변-신": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 3,
        coordiCost: 0,
    },
    "폭풍의 언덕에서 먹는 짜장면은 더 맛남": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 1,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "돌발미션 보상 1": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 20,
        moneyEarn: 0,
        coordiCost: 0,
    },
    "돌발미션 보상 2": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 10,
    },
    "돌발미션 보상 3": {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 5,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    },
};

export function getEffect(name: string): Effect {
    return effectList[name];
}

export function getEffectDetail(effect: Effect): string {
    let detail = ""
    detail += effect.moneyEarn > 0 ? "골드 획득량 +" + effect.moneyEarn + "%\n" : ""
    detail += effect.fatigueIncrease > 0 ? "피로도 증가량 감소 +" + effect.fatigueIncrease + "\n" : ""
    detail += effect.equipableDrop > 0 ? "장비 드롭률 +" + effect.equipableDrop + "%\n" : ""
    detail += effect.enchantDrop > 0 ? "인챈트 드롭률 +" + effect.enchantDrop + "%\n" : ""
    detail += effect.enchantSuccess > 0 ? "인챈트 성공율 +" + effect.enchantSuccess + "%\n" : ""
    detail += effect.coordiCost > 0 ? "코디 구매 골드 할인 +" + effect.coordiCost + "%\n" : ""
    detail += effect.equipableReinforceCost > 0 ? "장비 강화 골드 할인 +" + effect.equipableReinforceCost + "%\n" : ""
    detail += effect.equipableReinforceSuccess > 0 ? "장비 강화 성공율 +" + effect.equipableReinforceSuccess + "%\n" : ""
    return deepCopy(detail)
}

export interface EffectOperation {
    (arg1: Effect, arg2: Effect): Effect;
}

export const addEffect: EffectOperation = (
    arg1: Effect,
    arg2: Effect
): Effect => {
    return {
        enchantSuccess: arg1.enchantSuccess + arg2.enchantSuccess,
        equipableDrop: arg1.equipableDrop + arg2.equipableDrop,
        enchantDrop: arg1.enchantDrop + arg2.enchantDrop,
        fatigueIncrease: arg1.fatigueIncrease + arg2.fatigueIncrease,
        equipableReinforceSuccess:
            arg1.equipableReinforceSuccess + arg2.equipableReinforceSuccess,
        equipableReinforceCost:
            arg1.equipableReinforceCost + arg2.equipableReinforceCost,
        moneyEarn: arg1.moneyEarn + arg2.moneyEarn,
        coordiCost: arg1.coordiCost + arg2.coordiCost,
    };
};

export function getGroupEffect(effectList: string[]): Effect {
    let effect: Effect = {
        enchantSuccess: 0,
        equipableDrop: 0,
        enchantDrop: 0,
        fatigueIncrease: 0,
        equipableReinforceSuccess: 0,
        equipableReinforceCost: 0,
        moneyEarn: 0,
        coordiCost: 0,
    };
    for (let elem of effectList) {
        effect = addEffect(effect, getEffect(elem));
    }
    return deepCopy(effect);
}
