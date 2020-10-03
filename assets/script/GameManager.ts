import { Room, Client } from "colyseus.js"
import Constants from "./common/Constants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component
{
    private client: Client = null
    private room: Room = null
    private entities: { [id: string]: cc.Node } = {}
    private currentPlayerEntity: cc.Node

    onLoad()
    {

    }

    init()
    {
        this.client = new Client(Constants.END_POINT)
    }
}