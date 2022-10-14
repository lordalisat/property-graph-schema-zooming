<script lang="ts">
  import { drag, select, zoom, zoomIdentity } from "d3";

  import {
    forceCenter,
    forceLink,
    forceManyBody,
    forceSimulation,
  } from "d3-force";
  import type { PropertyGraphElement } from "propertyGraphEntities/propertyGraphElement";
  import type { PropertyGraphNode } from "propertyGraphEntities/propertyGraphNode";
  import { onDestroy, onMount } from "svelte";
  import type { Readable } from "svelte/store";
  import type { PropertyGraph } from "propertyGraphEntities/propertyGraph";
  import { elementType } from "types/propertyGraph/elementType";

  interface Edge {
    source: PropertyGraphElement;
    target: PropertyGraphElement;
    directional: boolean;
    linkIndex?: number;
  }

  // an array of our particles
  export let graph: Readable<PropertyGraph>;

  let svg;
  let width;
  let height;
  let nodes: PropertyGraphElement[] = [];
  let edges: Edge[] = [];
  let transform = zoomIdentity;
  let mLinkNum = {};
  const simulation = forceSimulation();

  const unsubscribe = graph.subscribe((graph) => {
    simulation.stop();
    nodes = [...graph.nodes.values(), ...graph.edges.values()];
    nodes.forEach((node) => node.setPrintOptions());
    edges = [...graph.edges.values()].flatMap((edge) => {
      return [
        {
          source: edge.isDirected ? graph.nodes.get(edge.sourceNode) : edge,
          target: edge.isDirected ? edge : graph.nodes.get(edge.sourceNode),
          directional: edge.isDirected,
        },
        {
          source: edge,
          target: graph.nodes.get(edge.targetNode),
          directional: edge.isDirected,
        },
      ];
    });
    setLinkIndexAndNum(edges);
    simulation
      .nodes(nodes)
      .force("link", forceLink(edges).distance(250))
      .force("charge", forceManyBody().strength(-1200))
      .on("tick", simulationUpdate);
    simulation.alpha(1).restart();
  });
  $: simulation.force("center", forceCenter(width / 2, height / 2)).restart();

  // $: console.log(nodes);
  // $: console.log(edges);

  onMount(() => {
    select(svg)
      .call(
        drag()
          .container(svg)
          .subject(dragsubject)
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .call(
        zoom()
          .scaleExtent([1 / 10, 8])
          .on("zoom", zoomed)
      );
  });

  onDestroy(() => {
    simulation.stop();
    unsubscribe();
  });

  function simulationUpdate() {
    simulation.tick();
    nodes = [...nodes];
    edges = [...edges];
  }

  function zoomed(currentEvent) {
    transform = currentEvent.transform;
    simulationUpdate();
  }

  function dragsubject(currentEvent) {
    const nodes = simulation.nodes();
    const node = nodes.filter((node: PropertyGraphNode) => {
      return (
        node.x - 0.5 * node.width < transform.invertX(currentEvent.x) &&
        node.x + 0.5 * node.width > transform.invertX(currentEvent.x) &&
        node.y - 0.5 * node.height < transform.invertY(currentEvent.y) &&
        node.y + 0.5 * node.height > transform.invertY(currentEvent.y)
      );
    })[0];
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

  // sort the links by source, then target
  function sortEdges(edges) {
    edges.sort(function (a, b) {
      if (a.source > b.source) {
        return 1;
      } else if (a.source < b.source) {
        return -1;
      } else {
        if (a.target > b.target) {
          return 1;
        }
        if (a.target < b.target) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }

  //any links with duplicate source and target get an incremented 'linknum'
  function setLinkIndexAndNum(edges) {
    sortEdges(edges);
    for (var i = 0; i < edges.length; i++) {
      if (
        i != 0 &&
        edges[i].source == edges[i - 1].source &&
        edges[i].target == edges[i - 1].target
      ) {
        edges[i].linkIndex = edges[i - 1].linkIndex + 1;
      } else {
        edges[i].linkIndex = 1;
      }
      // save the total number of links between two nodes
      mLinkNum[edges[i].source.id + ":" + edges[i].target.id] =
        edges[i].linkIndex;
    }
  }

  function arcPath(d) {
    const xSmaller = d.source.x < d.target.x - 0.5 * d.target.width;
    const ySmaller = d.source.y < d.target.y - 0.5 * d.target.height;
    const xGreater = d.source.x > d.target.x + 0.5 * d.target.width;
    const yGreater = d.source.y > d.target.y + 0.5 * d.target.height;
    let x1, x2, y1, y2: number;
    if (xSmaller && ySmaller) {
      x1 = d.source.x;
      y1 = d.source.y + 0.5 * d.source.height;
      x2 = d.target.x - 0.5 * d.target.width;
      y2 = d.target.y;
    } else if (xSmaller && yGreater) {
      x1 = d.source.x + 0.5 * d.source.width;
      y1 = d.source.y;
      x2 = d.target.x;
      y2 = d.target.y + 0.5 * d.target.height;
    } else if (xSmaller) {
      x1 = d.source.x + 0.5 * d.source.width;
      y1 = d.source.y;
      x2 = d.target.x - 0.5 * d.target.width;
      y2 = d.target.y;
    } else if (xGreater && ySmaller) {
      x1 = d.source.x - 0.5 * d.source.width;
      y1 = d.source.y;
      x2 = d.target.x;
      y2 = d.target.y - 0.5 * d.target.height;
    } else if (xGreater && yGreater) {
      x1 = d.source.x;
      y1 = d.source.y - 0.5 * d.source.height;
      x2 = d.target.x + 0.5 * d.target.width;
      y2 = d.target.y;
    } else if (xGreater) {
      x1 = d.source.x - 0.5 * d.source.width;
      y1 = d.source.y;
      x2 = d.target.x + 0.5 * d.target.width;
      y2 = d.target.y;
    } else if (ySmaller) {
      x1 = d.source.x;
      y1 = d.source.y + 0.5 * d.source.height;
      x2 = d.target.x;
      y2 = d.target.y - 0.5 * d.target.height;
    } else {
      x1 = d.source.x;
      y1 = d.source.y - 0.5 * d.source.height;
      x2 = d.target.x;
      y2 = d.target.y + 0.5 * d.target.height;
    }
    var dx = x2 - x1,
      dy = y2 - y1,
      dr = Math.sqrt(dx * dx + dy * dy);
    // get the total link numbers between source and target node
    var lTotalLinkNum = mLinkNum[d.source.id + ":" + d.target.id];

    if (lTotalLinkNum > 1) {
      dr = dr / (1 + (1 / lTotalLinkNum) * (d.linkIndex - 1));
    }

    return `M${x1} ${y1} A ${dr}, ${dr} 0, 0, 0 ${x2}, ${y2}`;
  }
</script>

<figure bind:clientHeight={height} bind:clientWidth={width}>
  <svg bind:this={svg} {width} {height} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker
        id="prop_arrow"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="13"
        markerHeight="13"
        orient="auto-start-reverse"
      >
        <path
          class="fill-black dark:fill-gray-200 stroke-0"
          d="M 0 0 L 10 5 L 0 10 z"
        />
      </marker>
      <marker
        id="prop_dot"
        viewBox="0 0 10 10"
        refX="10"
        refY="5"
        markerWidth="13"
        markerHeight="13"
        orient="auto-start-reverse"
      >
        <circle 
          class="fill-black dark:fill-gray-200 stroke-0"
          cx="5" cy="5" r="5"
        />
      </marker>
    </defs>
    {#each edges as edge}
      <g
        class="edge"
        transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
      >
        <path
          class="stroke-black dark:stroke-gray-200"
          id="{edge.source.id}_{edge.target.id}_{edge.linkIndex}"
          d={arcPath(edge)}
          marker-end={edge.directional ? "url(#prop_arrow)" : "url(#prop_dot)"}
        />
      </g>
    {/each}
    {#each nodes as point}
      <g
        class="node"
        transform="translate({transform.x} {transform.y}) scale({transform.k} {transform.k})"
      >
        <title>{point.id}</title>
        <rect
          class="stroke-black dark:stroke-gray-200"
          stroke-dasharray={point.type === elementType.edge ? "5,3" : null}
          x={point.x - 0.5 * point.width}
          y={point.y - 0.5 * point.height}
          width={point.width}
          height={point.height}
        />
        <foreignObject
          x={point.x - 0.5 * point.width}
          y={point.y - 0.5 * point.height}
          width={point.width}
          height={point.height}
        >
          {@html `<pre class="text-black dark:text-gray-200">${point.stringRepres}<pre>`}
        </foreignObject>
      </g>
    {/each}
  </svg>
</figure>

<style>
  figure {
    width: 100%;
    height: 100%;
    margin: 0;
  }

  svg {
    font-family: monospace;
  }

  .edge path {
    fill: none;
  }

  rect {
    fill: none;
  }
  
  pre {
    text-align: left;
    white-space: pre-line;
  }
</style>
