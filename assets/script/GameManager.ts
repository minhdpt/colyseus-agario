import { Room, Client } from "colyseus.js"
import Constants from "./common/Constants"
import {State} from "../../multiplayer/server/rooms/State"
import { setegid } from "process";

const {ccclass, property} = cc._decorator;
export const lerp = (a: number, b: number, t: number) => (b - a) * t + a

@ccclass
export default class GameManager extends cc.Component
{
    @property(cc.Prefab)
    playerPreb: cc.Prefab = null

    @property(cc.Node)
    playerParentNode: cc.Node = null

    @property(cc.Node)
    canvasNode: cc.Node = null

    private client: Client = null
    private room: Room<State> = null
    private entities: { [id: string]: cc.Node } = {}
    private currentPlayerEntity: cc.Node
    private _interpolation: boolean = !true

    async onLoad()
    {
        this.registerEvents()
        await this.init()
    }

    async init()
    {
        this.client = new Client(Constants.END_POINT)
        this.room = await this.client.joinOrCreate<State>("arena")
        this.room.state.entities.onAdd = (entity, sessionId: string) => {
            const color = (entity.radius < 10) ? 0xff0000 : 0xFFFF0B;
            let playerNode: cc.Node = cc.instantiate(this.playerPreb)
            playerNode.setParent(this.playerParentNode)
            this.entities[sessionId] = playerNode

            if(sessionId === this.room.sessionId)
            {
                this.currentPlayerEntity = playerNode
            }

            entity.onChange = (changes) => {
                const color = (entity.radius < 10) ? 0xff0000 : 0xFFFF0B;

                const playerNode = this.entities[sessionId];

                // set x/y directly if interpolation is turned off
                if (!this._interpolation) {
                    playerNode.x = entity.x;
                    playerNode.y = entity.y;
                }
            }
        }        

        this.room.state.entities.onRemove = (_, sessionId: string) => {
            this.entities[sessionId].removeFromParent()
            this.entities[sessionId].destroy()            
            this.entities[sessionId].destroy()
            delete this.entities[sessionId]
        };
    }

    update(dt: number)
    {
        if (this._interpolation)
        {
            for (let id in this.entities) {
                this.entities[id].x = lerp(this.entities[id].x, this.room.state.entities[id].x, 0.2);
                this.entities[id].y = lerp(this.entities[id].y, this.room.state.entities[id].y, 0.2);
            }
        }
    }

    registerEvents()
    {
        this.canvasNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.canvasNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.canvasNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }
    
    unRegisterEvents()
    {
        this.canvasNode.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.canvasNode.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.canvasNode.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)        
    }


    private onTouchStart(event: cc.Event.EventTouch)
    {
        let touchLoc = event.touch.getLocation();
        let newPos = this.node.convertToNodeSpaceAR(touchLoc)
        this.room.send('mouse', { x: newPos.x, y: newPos.y });
    }

    private onTouchMove(event: cc.Event.EventTouch)
    {

    }

    private onTouchEnd(event: cc.Event.EventTouch)
    {

    }

    onDestroy()
    {
        this.unRegisterEvents()
    }
}