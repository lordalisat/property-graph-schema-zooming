import neo4j from "neo4j-driver";

const driver = neo4j.driver("neo4j+s://demo.neo4jlabs.com",
neo4j.auth.basic('movies', 'movies'),
{ disableLosslessIntegers: true });

export async function getData(): Promise<string> {
  const session = driver.session({
    database: 'movies',
    defaultAccessMode: neo4j.session.READ
  });
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
    })
    .catch(error => {
      console.log(error)
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
    })
    .catch(error => {
      console.log(error)
    });
  await session.close();

  return JSON.stringify({ nodes, edges }, null, 2);
}