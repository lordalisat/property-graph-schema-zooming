<script lang='ts'>
  import { drag, scaleOrdinal, schemeCategory10, select, zoom, zoomIdentity } from "d3";

  import { forceCenter, forceLink, forceManyBody, forceSimulation } from "d3-force"
import { onMount } from "svelte";
  import type { SimpleGraph } from "./simpleGraphEntities/simpleGraph";
  import type { SimpleGraphEdgeType } from "./simpleGraphEntities/simpleGraphEdge";
  import type { SimpleGraphNodeType } from "./simpleGraphEntities/simpleGraphNode";

  const nodeRadius = 20;

  // an array of our particles
  export let graph: SimpleGraph;

  console.log(graph);

  let svg;
  let nodes: SimpleGraphNodeType[] = [];
  let edges: SimpleGraphEdgeType[] = [];
	let transform = zoomIdentity;
	const colourScale = scaleOrdinal(schemeCategory10);
  let mLinkNum = {};

  let width = 1200
  $: height = width
  $: nodes = [...graph.nodeNodes.values(), ...graph.edgeNodes.values(), ...graph.labelNodes.values(), ...graph.propertyNodes.values()];
  $: edges = [...graph.edgeEdges, ...graph.labelEdges, ...graph.propertyEdges];

  $: console.log(nodes);
  $: console.log(edges);

  let simulation;
    onMount(() => {
      simulation = forceSimulation(nodes)
        .force("link", forceLink(edges).distance(140))
        .force("charge", forceManyBody().strength(-800))
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
        const node = simulation.find(transform.invertX(currentEvent.x), transform.invertY(currentEvent.y), nodeRadius);
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
  
  function arcPath(leftHand, d) {
    var x1 = leftHand ? d.source.x : d.target.x,
        y1 = leftHand ? d.source.y : d.target.y,
        x2 = leftHand ? d.target.x : d.source.x,
        y2 = leftHand ? d.target.y : d.source.y,
        dx = x2 - x1,
        dy = y2 - y1,
        dr = Math.sqrt(dx * dx + dy * dy),
        sweep = leftHand ? 0 : 1;
        // get the total link numbers between source and target node
        var lTotalLinkNum = mLinkNum[d.source.id + ":" + d.target.id];

        if (lTotalLinkNum > 1) {
          dr = dr/(1 + (1/lTotalLinkNum) * (d.linkIndex - 1));
        }

        return `M${x1} ${y1} A ${dr}, ${dr} 0, 0, ${sweep} ${x2}, ${y2}`;
}
</script>


<figure class="c">
  <svg bind:this={svg} {width} {height}>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="26" refY="6"
      markerWidth="13" markerHeight="13"
      orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z"/>
      </marker>
    </defs>
    {#each edges as edge}
    <g class='edge' transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
      <title>{edge.label}</title>
      <path id='{graph.type}_{edge.source.id}_{edge.target.id}_{edge.linkIndex}' d={arcPath(true, edge)} />
      <path class='invis' id='invis_{graph.type}_{edge.source.id}_{edge.target.id}_{edge.linkIndex}' d={arcPath(edge.source.x < edge.target.x, edge)} />
      <text>
        <textPath href='#invis_{graph.type}_{edge.source.id}_{edge.target.id}_{edge.linkIndex}' startOffset='50%' style="">
          {edge.label.toString()}
        </textPath>
      </text>
    </g>
    {/each}
    {#each nodes as point}
      <g class="node" transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
        <title>{point.id}</title>
        <circle r={nodeRadius} fill={colourScale(point.type.toString())} cx={point.x} cy={point.y}/>
        <text x={point.x} y={point.y}>{point.label.toString()}</text>
      </g>
	  {/each}
  </svg>
</figure>

<style>
	svg {
		float: left;
	}

  .invis {
    fill: none;
    stroke: none;
    marker-end:none;
  }

	circle {
		stroke: #fff;
    stroke-width: 1.5;
	}

  path {
    fill: none;
    stroke: #999;
    stroke-opacity: 0.6;
    marker-end:url(#arrow);
  }

  marker path{
    fill:#999;
    stroke: none;
  }

  text {
    text-anchor: middle;
    pointer-events: none;
  }

  .edge text {
    fill: #999;
  }

  .node text {
    alignment-baseline: middle;
  }

</style>