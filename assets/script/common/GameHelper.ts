
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameHelper extends cc.Component 
{
    static ENCODE_LOCAL_STORAGE: boolean = true;
    static EndOfFrameTime: number = 0.012;

    /**
     * clamp value in min - max range
     * @param value number need to clamp
     * @param min minimum value
     * @param max maximum value
     */
    static ClampInRange(value: number, min: number, max: number) : number
    {
        return Math.min(max, Math.max(min, value));
    }
    /**
     * return random integer number [min, max)
     * @param min included
     * @param max exclusive
     */
    static getRndInteger (min, max) 
    {
        return Math.floor(Math.random() * (max - min) ) + min;        
    }
    /**
     * return random integer number [min, max]
     * @param min included
     * @param max included
     */
    static getRndIntegerInclusive (min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;    
    }

    /**
     * return random float number [min, max)
     * @param min included
     * @param max exclusive
     */
    static getRndFloat (min, max) 
    {
        return (Math.random() * (max - min) ) + min;        
    }

    /**
     * return random float number [min, max]
     * @param min included
     * @param max included
     */
    static getRndFloatInclusive (min, max) 
    {
        let tmpMax = max + 0.1
        return Math.max(max, (Math.random() * (tmpMax - min)) + min)
    }

    static Btoa (a: any): any {
        if (a != null && GameHelper.ENCODE_LOCAL_STORAGE) 
        {
            return btoa(a);
        }
        return a;
    }
    
    static Atob (a: any): any 
    {
        if (a != null && GameHelper.ENCODE_LOCAL_STORAGE) 
        {
            return atob(a);
        }
        return a;
    }

    /**
     * 
     * @param current 
     * @param brother 
     */
    static convertToBrotherPosAR (current: cc.Node, brother: cc.Node): cc.Vec3 {
        
        let worldPos = current.parent.convertToWorldSpaceAR(current.position);
        let localPos = brother.parent.convertToNodeSpaceAR(worldPos);
        return localPos;
    }

    
    /**
     * return millis
     * @param h 
     * @param m 
     * @param s 
     */
    static TimeSpan (h: number = 0, m: number = 0, s: number = 0): number 
    {
        let result: number = 0
        result = ((h*60 + m)*60 + s)*1000
        return result
    }

    /**
     * add padding number - exp: (n = 1, d = 2) => 1 = 01
     * @param n 
     * @param d 
     */
    static zeropad(n: number, d: number): string 
    {
		var s = (n < 0 ? "-" : "");
		if (n < 0) n = -n;
		var zeroes = d - n.toString().length;
		for (var i = 0; i < zeroes; i++)
			s += "0";
        return (s + n.toString());
    }

    /**
     * Move current object to target position
     * @param current vec2 or number
     * @param target vec2 or number
     * @param distance number
     */
    static MoveTowards(current/* : cc.Vec2|number */, target/* : cc.Vec2|number */, distance: number) 
    {
        var isVec2 = current instanceof cc.Vec2 && target instanceof cc.Vec2;
        var isVec3 = current instanceof cc.Vec3 && target instanceof cc.Vec3;
        if (isVec3)
        {
            let disFromCurToTar = current.sub(target).mag();
            if (distance >= disFromCurToTar)
                return target;
            // be careful with the case the devided number = 0
            let ratio = distance / disFromCurToTar;
            // Thales theory: tranX/(target.x - transform.x) = distance/disFromTransToTar
            var offset = (target.sub(current)).mul(ratio);
            return current.add(offset);
        }
        else if (isVec2) 
        {
            let disFromCurToTar = GameHelper.pDistance(current, target);
            if (distance >= disFromCurToTar)
                return target;
            // be careful with the case the devided number = 0
            let ratio = distance / disFromCurToTar;
            // Thales theory: tranX/(target.x - transform.x) = distance/disFromTransToTar
            return new cc.Vec2(current.x, current.y).add(new cc.Vec2((target.x - current.x) * ratio, (target.y - current.y) * ratio));
        }
        else 
        { 
            // number
            let disFromCurToTar = Math.abs(current - target);
            if (distance >= disFromCurToTar)
                return target;
            let ratio = distance / disFromCurToTar;
            return cc.misc.lerp(current, target, ratio);
        }
    }

    static MoveTowardsIncludeDistance(current/* : cc.Vec2|number */, target/* : cc.Vec2|number */, distance: number) 
    {
        let isVec2 =  current instanceof cc.Vec2 && target instanceof cc.Vec2;
        if (isVec2) 
        {
            let disFromCurToTar = GameHelper.pDistance(current, target);
            // be careful with the case the devided number = 0
            let ratio = distance / disFromCurToTar;
            // Thales theory: tranX/(target.x - transform.x) = distance/disFromTransToTar
            return new cc.Vec2(current.x, current.y).add(new cc.Vec2((target.x - current.x) * ratio, (target.y - current.y) * ratio));
        }
        else 
        { // number
            let disFromCurToTar = Math.abs(current - target);
            if (distance >= disFromCurToTar)
                return target;
            let ratio = distance / disFromCurToTar;
            return cc.misc.lerp(current, target, ratio);
        }
    }
    /**
     * return new angle by from angle to to angle
     * @param from 
     * @param to 
     * @param maxAngle 
     */
    static RotateTowards (from: number, to: number, maxAngle: number): number 
    {
        let diff = to - from;
        if (diff <= maxAngle)
            return to;

        let ratio = maxAngle / diff;
        let result = cc.misc.lerp(from, to, ratio);
        return result;
    }

    static async WaitForMiliSeconds(callBack: Function, milis: number)
    {
        return new Promise(resolve => setTimeout(() => {
            callBack && callBack();      
            resolve();
        }
        , milis));
    }

    static raycast (pos: cc.Vec2, containerNode: cc.Node): []
    {
        let ray = cc.Camera.main.getRay(pos);
        return cc.geomUtils.intersect.raycast(containerNode, ray);
    }
}