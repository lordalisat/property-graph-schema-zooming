export const data = `{
  "nodes": [
    {
      "id": "n1",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Alic"
      }
    },
    {
      "id": "n2",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Bob"
      }
    },
    {
      "id": "n3",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "Charlie"
      }
    },
    {
      "id": "n4",
      "labels": [
        "Person"
      ],
      "properties": {
        "name": "David"
      }
    },
    {
      "id": "n5",
      "labels": [
        "Club"
      ],
      "properties": {
        "name": "Graffiti Club"
      }
    },
    {
      "id": "n6",
      "labels": [
        "Club"
      ],
      "properties": {
        "name": "Horse Club"
      }
    },
    {
      "id": "n7",
      "labels": [
        "City"
      ],
      "properties": {
        "name": "Eindhoven"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "n1",
      "target": "n2",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e2",
      "source": "n1",
      "target": "n3",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e3",
      "source": "n3",
      "target": "n1",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e4",
      "source": "n1",
      "target": "n2",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e5",
      "source": "n1",
      "target": "n4",
      "isDirected": true,
      "labels": [
        "follows"
      ],
      "properties": {}
    },
    {
      "id": "e6",
      "source": "n1",
      "target": "n5",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e7",
      "source": "n1",
      "target": "n6",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e8",
      "source": "n3",
      "target": "n6",
      "isDirected": true,
      "labels": [
        "memberOf"
      ],
      "properties": {}
    },
    {
      "id": "e9",
      "source": "n1",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    },
    {
      "id": "e10",
      "source": "n3",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    },
    {
      "id": "e11",
      "source": "n4",
      "target": "n7",
      "isDirected": true,
      "labels": [
        "livesIn"
      ],
      "properties": {}
    }
  ]
}`

export const workloadData = `[
  {
    "label":"Person",
    "occurence":1
  },
  {
    "label":"Club",
    "occurence":0.5
  },
  {
    "label":"follows",
    "occurence":1
  },
  {
    "label":"Random",
    "occurence":0.8
  }
]`;