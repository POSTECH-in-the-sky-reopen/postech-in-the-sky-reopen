import { Log } from "src/interfaces/Log";
import { deepCopy } from "./DeepCopy";

export function messageLog(message: string) {
    return {
        LogType: "Event",
        OnlyMessage: true,
        EffectMessage: message,
    } as Log;
}

export function repairLog(supplyLog: Log[]): Log[] {
    supplyLog.push(deepCopy(messageLog("이봐! 자네, 장비를 많이 쓴 것 같군...")));
    supplyLog.push(deepCopy(messageLog("장비를 정지합니다!")));
    supplyLog.push(deepCopy(messageLog("안 돼!")));
    supplyLog.push(deepCopy(messageLog("정지하겠습니다.")));
    supplyLog.push(deepCopy(messageLog("안 되잖아?")));
    supplyLog.push(deepCopy(messageLog("어, 정..정지가 안 돼. 정지시킬 수가 없어.")));
    supplyLog.push(deepCopy(messageLog("안 돼!")));
    supplyLog.push(deepCopy(messageLog("현재 장비를 수리하여 내구도가 회복되었습니다.")));
    supplyLog.push(deepCopy(messageLog("*장비가 없을 경우 회복되지 않음*")));
    return supplyLog;
}

export function hotsixLog(supplyLog: Log[]): Log[] {
    supplyLog.push(deepCopy(messageLog("모험 피로도 긴급 패치가 적용됩니다.")))
    supplyLog.push(deepCopy(messageLog("삐용삐용삐용삐용")))
    supplyLog.push(deepCopy(messageLog("긴 급 패 치")))
    supplyLog.push(deepCopy(messageLog("긴급 패치로 피해를 볼 용사님를 위해 피로도를 회복시켜줄게!")))
    supplyLog.push(deepCopy(messageLog("피로도가 회복되었습니다.")))
    supplyLog.push(deepCopy(messageLog("*긴급 패치는 사실 없습니다.*")))
    return supplyLog;            
}

export function flexLog(supplyLog: Log[]): Log[] {
    supplyLog.push(deepCopy(messageLog("당신은 바닥에 반짝이는 무언가가 보인다.")))
    supplyLog.push(deepCopy(messageLog("당신은 천천히 다가간다.")))
    supplyLog.push(deepCopy(messageLog("당신은 그것이 몬스터가 떨어트린 돈이라는 것을 알았다.")))
    supplyLog.push(deepCopy(messageLog("당신은 그것을 몬스터에게 돌려주지 않기로 결심한다.")))
    supplyLog.push(deepCopy(messageLog("하지만 그것을 돌려줘야 한다는 것을 알기에")))
    supplyLog.push(deepCopy(messageLog("의지가 차올랐다.")))
    return supplyLog;
}

export function varianLog(supplyLog: Log[]): Log[] {
    supplyLog.push(deepCopy(messageLog("혹시 무기 복제 실험에 관심있으세요?")))
    supplyLog.push(deepCopy(messageLog("네?")))
    supplyLog.push(deepCopy(messageLog("지금 바로 해드릴게요!")))
    supplyLog.push(deepCopy(messageLog("복제 실험에 성공했다!")))
    supplyLog.push(deepCopy(messageLog("무기가 두배!")))
    supplyLog.push(deepCopy(messageLog("무기가 두배!")))
    supplyLog.push(deepCopy(messageLog("내구도가 반토막 났다. 복제된 무기가 생겼다!")))
    supplyLog.push(deepCopy(messageLog("*무기가 복사되었다.*")))
    return supplyLog;
}

export function supplyFailLog(supplyLog: Log[]): Log[] {
    supplyLog.push(deepCopy(messageLog("당신의 돈은 심각한 버그로 인해 모두 사라졌다.")))
    supplyLog.push(deepCopy(messageLog("...")))
    supplyLog.push(deepCopy(messageLog("...")))
    supplyLog.push(deepCopy(messageLog("...")))
    supplyLog.push(deepCopy(messageLog("*사실 거짓말이다.*")))
    return supplyLog;
}