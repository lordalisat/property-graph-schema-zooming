import {driver, auth, session, type Session} from "neo4j-driver";

export function connectDatabase(url: string, database: string, username: string, password: string): Session {
  return driver(url,
    auth.basic(username, password),
    { disableLosslessIntegers: true })
    .session({
      database: database,
      defaultAccessMode: session.READ
    });
}

export async function loadNeo4JGraph(session: Session): Promise<string> {
  const nodes = await session
    .run("MATCH (n) RETURN n")
    .then(result => {
      return result.records.map(record => {
        const node = record.get('n');
        return {
          id: node.identity.toString(),
          labels: node.labels,
          properties: node.properties,
        }
      });
    });
  const edges = await session
    .run("MATCH ()-[n]->() RETURN n")
    .then(result => {
      return result.records.map(record => {
        const edge = record.get('n');
        return {
          id: edge.identity.toString(),
          source: edge.start.toString(),
          target: edge.end.toString(),
          labels: [edge.type],
          properties: edge.properties,
        }
      });
    });
  await session.close();

  return JSON.stringify({ nodes, edges }, null, 2);
}