// ref : https://dev.to/unframework/getting-typeorm-to-work-with-next-js-and-typescript-1len
import { Connection, ConnectionOptions, getConnectionManager } from "typeorm"
import ormconfig from "./ormconfig"

let connectionReadyPromise: Promise<void> | null = null;

export const options: Record<string, ConnectionOptions> = {
  default: {
    ...ormconfig,
    synchronize: process.env.NODE_ENV !== "production",
  },
};

function entitiesChanged(prevEntities: any[], newEntities: any[]): boolean {
  if (prevEntities.length !== newEntities.length) return true;

  for (let i = 0; i < prevEntities.length; i++) {
    if (prevEntities[i] !== newEntities[i]) return true;
  }

  return false;
}

async function updateConnectionEntities(
  connection: Connection,
  entities: any[]
) {
  if (connection.options.entities === undefined || !entitiesChanged(connection.options.entities, entities)) return;

  // @ts-ignore
  connection.options.entities = entities;

  // @ts-ignore
  connection.buildMetadatas();

  if (connection.options.synchronize) {
    await connection.synchronize();
  }
}

/**
 * @see https://github.com/typeorm/typeorm/issues/6241#issuecomment-643690383
 * @param name name of the connection
 */
export default async function prepareConnection(
  name: string = "default"
): Promise<Connection> {
  const connectionManager = getConnectionManager();
  
  if (connectionManager.has(name)) {
    const connection = connectionManager.get(name);
    if (!connection.isConnected) {
      await connection.connect();
    }
    if (process.env.NODE_ENV !== "production" && ormconfig.entities) {
      await updateConnectionEntities(connection, ormconfig.entities);
    }
    
    return connection;
  }

  return await connectionManager.create({ name, ...options[name] }).connect();
}
