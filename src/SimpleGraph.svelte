<script lang='ts'>
  import { drag, pointRadial, scaleOrdinal, schemeCategory10, select, zoom, zoomIdentity } from "d3";

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

  let width = 1200
  $: height = width
  $: nodes = [...graph.nodeNodes, ...graph.edgeNodes, ...graph.labelNodes, ...graph.propertyNodes];
  $: edges = [...graph.edgeEdges, ...graph.labelEdges, ...graph.propertyEdges];

  $: console.log(nodes);
  $: console.log(edges);

  let simulation;
    onMount(() => {
      simulation = forceSimulation(nodes)
        .force("link", forceLink(edges).distance(140))
        .force("charge", forceManyBody().strength(-200))
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
</script>


<figure class="c">
  <svg bind:this={svg} {width} {height}>
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="26" refY="5"
      markerWidth="13" markerHeight="13"
      orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill='#999' style='stroke: none'/>
      </marker>
    </defs>
    {#each edges as edge}
    <g class="edge" transform='translate({transform.x} {transform.y}) scale({transform.k} {transform.k})'>
      <title>{edge.label}</title>
      <line  x1='{edge.source.x}' y1='{edge.source.y}' x2='{edge.target.x}' y2='{edge.target.y}'/>
      <path id={edge.source.id + '_' + edge.target.id} d={'M ' + edge.source.x + ' ' + edge.source.y + ' L ' + edge.target.x + ' ' + edge.target.y} />
      <text>
        <textPath href={'#' + edge.source.id + '_' + edge.target.id} startOffset='50%' style="">
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

	circle {
		stroke: #fff;
    stroke-width: 1.5;
	}

  line {
    stroke: #999;
    stroke-opacity: 0.6;
    marker-end:url(#arrow);
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