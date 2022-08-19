<script lang='ts'>
  import App from "App.svelte";
import { drag, json, scaleOrdinal, schemeCategory10, select, zoom, zoomIdentity } from "d3";

  import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force"
  import type { PropertyGraphElement } from "propertyGraphEntities/propertyGraphElement";
  import { onMount } from "svelte";
  import type { PropertyGraph } from "./propertyGraphEntities/propertyGraph";

  interface Edge {
    source: PropertyGraphElement,
    target: PropertyGraphElement,
    directional: boolean,
    linkIndex?: number,
  }

  // an array of our particles
  export let graph: PropertyGraph;

  console.log(graph);

  let svg;
  let nodes: PropertyGraphElement[] = [];
  let edges: Edge[] = [];
	let transform = zoomIdentity;
  let mLinkNum = {};

  let width = 1200
  $: height = width
  $: nodes = [...graph.nodes.values(), ...graph.edges.values()];
  $: nodes.forEach((node) => node.setPrintOptions());
  $: edges = [...graph.edges.values()].flatMap((edge) => {
    return [
      {
        source: graph.nodes.get(edge.sourceNode),
        target: edge,
        directional: false,
      },
      {
        source: edge,
        target: graph.nodes.get(edge.targetNode),
        directional: edge.isDirected,
      }
    ]
  });

  $: console.log(nodes);
  $: console.log(edges);

  let simulation;
    onMount(() => {
      simulation = forceSimulation(nodes)
        .force("link", forceLink(edges).distance(140))
        .force("charge", forceManyBody().strength(-1200))
        .force("center", forceCenter(width / 2, height / 2))
        .on('tick', simulationUpdate);

      select(svg)
        .call(drag()
          .container(svg)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
        .call(zoom()
          .scaleExtent([1 / 10, 8])
          .on('zoom', zoomed));
    });

  function simulationUpdate () {
    simulation.tick();
    nodes = [...nodes];
    edges = [...edges];
    setLinkIndexAndNum(edges);
  }

  function zoomed(currentEvent) {
      transform = currentEvent.transform;
      simulationUpdate();
  }

	function dragsubject(currentEvent) {
        const node = simulation.find(transform.invertX(currentEvent.x), transform.invertY(currentEvent.y), 20);
        if (node) {
            node.x = transform.applyX(node.x);
            node.y = transform.applyY(node.y);
        }
        return node;
	}

  function dragstarted(currentEvent) {
      if (!currentEvent.active) simulation.alphaTarget(0.3).restart();
      currentEvent.subject.fx = transform.invertX(currentEvent.subject.x);
      currentEvent.subject.fy = transform.invertY(currentEvent.subject.y);
  }

  function dragged(currentEvent) {
      currentEvent.subject.fx = transform.invertX(currentEvent.x);
      currentEvent.subject.fy = transform.invertY(currentEvent.y);
  }

  function dragended(currentEvent) {
      if (!currentEvent.active) simulation.alphaTarget(0);
      currentEvent.subject.fx = null;
      currentEvent.subject.fy = null;
  }

	function resize() {
		({ width, height } = svg.getBoundingClientRect());
	}

  // sort the links by source, then target
  function sortEdges(edges) {								
    edges.sort(function(a,b) {
      if (a.source > b.source) 
      {
          return 1;
      }
      else if (a.source < b.source) 
      {
          return -1;
      }
      else 
      {
          if (a.target > b.target) 
          {
              return 1;
          }
          if (a.target < b.target) 
          {
              return -1;
          }
          else 
          {
              return 0;
          }
      }
    });
  }
    
  //any links with duplicate source and target get an incremented 'linknum'
  function setLinkIndexAndNum(edges)
  {
    sortEdges(edges);
    for (var i = 0; i < edges.length; i++) {
      if (i != 0 &&
        edges[i].source == edges[i-1].source &&
        edges[i].target == edges[i-1].target) 
      {
        edges[i].linkIndex = edges[i-1].linkIndex + 1;
      }
      else 
      {
        edges[i].linkIndex = 1;
      }
      // save the total number of links between two nodes
      mLinkNum[edges[i].source.id + ':' + edges[i].target.id] = edges[i].linkIndex;
    }
  }
  
  function arcPath(d) {
    const xSmaller = d.source.x < (d.target.x - (.5 * d.target.width));
    const ySmaller = d.source.y < (d.target.y - (.5 *  d.target.height));
    const xGreater = d.source.x > (d.target.x + (.5 * d.target.width));
    const yGreater = d.source.y > (d.target.y + (.5 *  d.target.height));
    let x1, x2, y1, y2: number;
    if (xSmaller && ySmaller) {
      x1 = d.source.x;
      y1 = d.source.y + (.5 * d.source.height);
      x2 = d.target.x - (.5 * d.target.width);
      y2 = d.target.y;
    }
    else if (xSmaller && yGreater) {
      x1 = d.source.x + (.5 * d.source.width);
      y1 = d.source.y;
      x2 = d.target.x;
      y2 = d.target.y + (.5 * d.target.height);
    }
    else if (xSmaller) {
      x1 = d.source.x + (.5 * d.source.width);
      y1 = d.source.y;
      x2 = d.target.x - (.5 * d.target.width);
      y2 = d.target.y;
    }
    else if (xGreater && ySmaller) {
      x1 = d.source.x - (.5 * d.source.width);
      y1 = d.source.y;
      x2 = d.target.x;
      y2 = d.target.y - (.5 * d.target.height);
    }
    else if (xGreater && yGreater) {
      x1 = d.source.x;
      y1 = d.source.y - (.5 * d.source.height);
      x2 = d.target.x + (.5 * d.target.width);
      y2 = d.target.y;
    }
    else if (xGreater) {
      x1 = d.source.x - (.5 * d.source.width);
      y1 = d.source.y;
      x2 = d.target.x + (.5 * d.target.width);
      y2 = d.target.y;
    }
    else if (ySmaller) {
      x1 = d.source.x;
      y1 = d.source.y + (.5 * d.source.height);
      x2 = d.target.x;
      y2 = d.target.y - (.5 * d.target.height);
    }
    else {
      x1 = d.source.x;
      y1 = d.source.y - (.5 * d.source.height);
      x2 = d.target.x;
      y2 = d.target.y + (.5 * d.target.height);

    }
    var dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy);
        // get the total link numbers between source and target node
        var lTotalLinkNum = mLinkNum[d.source.id + ":" + d.target.id];

        if (lTotalLinkNum > 1) {
          dr = dr/(1 + (1/lTotalLinkNum) * (d.linkIndex - 1));
        }

        return `M${x1} ${y1} A ${dr}, ${dr} 0, 0, 0 ${x2}, ${y2}`;
}
</script>


<figure class="c">
  <svg bind:this={svg} {width} {height}>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
      markerWidth="13" markerHeight="13"
      orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill='#999' style='stroke: none'/>
      </marker>
    </defs>
    {#each edges as edge}
    <g class="edge" transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
      <path id='{edge.source.id}_{edge.target.id}_{edge.linkIndex}' d={arcPath(edge)} marker-end={edge.directional ? 'url(#arrow)' : null}/>
    </g>
    {/each}
    {#each nodes as point}
      <g class="node" transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
        <title>{point.id}</title>
        <rect x={point.x - (.5 * point.width)} y={point.y - (.5 * point.height)} width={point.width} height={point.height} />
        <foreignObject x={point.x - (.5 * point.width)} y={point.y - (.5 * point.height)} width={point.width} height={point.height}>
          <pre>{point.stringRepres}</pre>
        </foreignObject>
      </g>
	  {/each}
  </svg>
</figure>

<style>
	svg {
		float: left;
    font-family: monospace;
	}

  path {
    fill: none;
    stroke: #999;
    stroke-opacity: 0.6;
  }

  marker path{
    fill:#999;
    fill-opacity: 0.6;
    stroke: none;
  }

  rect {
    fill: none;
    stroke: #999;
    stroke-opacity: 0.6;
  }
  
  pre {
    text-align: left;
    white-space: pre-line;
    margin: 0;
    color: #999;
  }

</style>