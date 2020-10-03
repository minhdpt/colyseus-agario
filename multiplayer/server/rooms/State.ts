import { Schema, type, MapSchema } from "@colyseus/schema";

import { Entity } from "./Entity";
import { Player } from "./Player";

const WORLD_SIZE = 2000;
export const DEFAULT_PLAYER_RADIUS = 10;

export class State extends Schema {

  width = 1080;
  height = 700;

  @type({ map: Entity })
  entities = new MapSchema<Entity>();

  initialize () {

  }


  createPlayer (sessionId: string) {
    console.log('sessionId ' + sessionId)
    this.entities[sessionId] = new Player(
      50,
      50
    );
  }

  update() {
    const deadEntities: string[] = [];
    for (const sessionId in this.entities) {
      const entity = this.entities[sessionId];

      if (entity.dead) {
        deadEntities.push(sessionId);
        continue;
      }
    }

    // delete all dead entities
    deadEntities.forEach(entityId => delete this.entities[entityId]);
  }
}