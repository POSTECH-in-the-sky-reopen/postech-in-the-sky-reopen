from parse.data import parse_tsv

def parse_effects():
    ret = []
    effect_info_table = parse_tsv(f"tools/data/effectList.tsv", 1)
    for effect_info in effect_info_table:
        info = parse_effect_info(effect_info)
        ret.append(info)
    return ret

#   enchantSuccess: number
#   equipableDrop: number
#   enchantDrop: number
#   fatigueIncrease: number
#   equipableReinforceSuccess: number
#   equipableReinforceCost: number
#   moneyEarn: number
#   coordiCost: number

def zero_check(s):
    if s == '':
        return 0
    return int(s)

def parse_effect_info(effect_info):
    name, enchantSuccess, equipableDrop, enchantDrop, fatigueIncrease, equipableReinforceSuccess, equipableReinforceCost, moneyEarn, coordiCost = effect_info
    return {
        name: {
            'enchantSuccess': zero_check(enchantSuccess), 
            'equipableDrop': zero_check(equipableDrop), 
            'enchantDrop': zero_check(enchantDrop), 
            'fatigueIncrease': zero_check(fatigueIncrease), 
            'equipableReinforceSuccess': zero_check(equipableReinforceSuccess), 
            'equipableReinforceCost': zero_check(equipableReinforceCost), 
            'moneyEarn': zero_check(moneyEarn), 
            'coordiCost': zero_check(coordiCost), 
        }
    }

def read_effects():
    _effects = parse_effects()
    return _effects

