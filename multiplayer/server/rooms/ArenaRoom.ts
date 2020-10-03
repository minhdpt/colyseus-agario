import { Room, Client } from "colyseus";
import { Entity } from "./Entity";
import { State } from "./State";

interface MouseMessage {
  x: number;
  y: number;
}

export class ArenaRoom extends Room<State> {

  onCreate() {
    this.setState(new State());
    this.state.initialize();

    this.onMessage("mouse", (client, message: MouseMessage) => {
      const entity = this.state.entities[client.sessionId];
      entity.x = message.x
      entity.y = message.y
    });

    this.setSimulationInterval(() => this.state.update());
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "JOINED");
    this.state.createPlayer(client.sessionId);
  }

  onLeave(client: Client) {
    console.log(client.sessionId, "LEFT!");
    const entity = this.state.entities[client.sessionId];

    // entity may be already dead.
    if (entity) { entity.dead = true; }
  }

}
