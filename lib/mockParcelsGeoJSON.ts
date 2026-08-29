import { FeatureCollection } from "geojson";

export const MOCK_PARCELS_GEOJSON: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "UP-PARCEL-001",
      properties: {
        ulpin: "UP0603002100482",
        ownerName: "Ramesh K.",
        area: "4,820 sq m",
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        declaredValue: "₹31.0 Lakh",
        expectedValue: "₹42.0 - ₹48.0 Lakh",
        anomalyScore: 62,
        flagged: true,
        status: "pending",
        project: "Eastern Freight Connectivity Corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.930, 26.850],
            [80.945, 26.852],
            [80.942, 26.840],
            [80.928, 26.838],
            [80.930, 26.850]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "UP-PARCEL-002",
      properties: {
        ulpin: "UP0603002100483",
        ownerName: "Sunita D.",
        area: "3,200 sq m",
        landType: "Agricultural",
        irrigationStatus: "Rain-fed",
        declaredValue: "₹28.0 Lakh",
        expectedValue: "₹26.0 - ₹31.0 Lakh",
        anomalyScore: 18,
        flagged: false,
        status: "compensated",
        project: "Eastern Freight Connectivity Corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.948, 26.853],
            [80.962, 26.855],
            [80.959, 26.843],
            [80.945, 26.841],
            [80.948, 26.853]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "UP-PARCEL-003",
      properties: {
        ulpin: "UP0603002100556",
        ownerName: "Mohan L.",
        area: "6,140 sq m",
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        declaredValue: "₹52.0 Lakh",
        expectedValue: "₹48.0 - ₹55.0 Lakh",
        anomalyScore: 22,
        flagged: false,
        status: "acquired",
        project: "Eastern Freight Connectivity Corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [80.932, 26.835],
            [80.946, 26.837],
            [80.944, 26.825],
            [80.930, 26.823],
            [80.932, 26.835]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "RJ-PARCEL-001",
      properties: {
        ulpin: "RJ0802110492812",
        ownerName: "Bhairav Singh",
        area: "7,840 sq m",
        landType: "Barren / Semi-arid",
        irrigationStatus: "Rain-fed",
        declaredValue: "₹18.5 Lakh",
        expectedValue: "₹24.0 - ₹28.0 Lakh",
        anomalyScore: 58,
        flagged: true,
        status: "pending",
        project: "Western Dedicated Freight Corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [74.870, 26.920],
            [74.890, 26.925],
            [74.885, 26.905],
            [74.865, 26.900],
            [74.870, 26.920]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "MH-PARCEL-001",
      properties: {
        ulpin: "MH1209843920184",
        ownerName: "Ananda Patil",
        area: "5,400 sq m",
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        declaredValue: "₹65.0 Lakh",
        expectedValue: "₹60.0 - ₹70.0 Lakh",
        anomalyScore: 12,
        flagged: false,
        status: "acquired",
        project: "Mumbai-Nagpur Super Communication Expressway"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.690, 19.760],
            [75.710, 19.765],
            [75.705, 19.745],
            [75.685, 19.740],
            [75.690, 19.760]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "KA-PARCEL-001",
      properties: {
        ulpin: "KA1920834720914",
        ownerName: "K. Gowda",
        area: "3,950 sq m",
        landType: "Agricultural",
        irrigationStatus: "Irrigated",
        declaredValue: "₹45.0 Lakh",
        expectedValue: "₹42.0 - ₹49.0 Lakh",
        anomalyScore: 15,
        flagged: false,
        status: "compensated",
        project: "Bangalore-Chennai Expressway corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.710, 14.530],
            [75.725, 14.532],
            [75.722, 14.518],
            [75.708, 14.516],
            [75.710, 14.530]
          ]
        ]
      }
    },
    {
      type: "Feature",
      id: "MP-PARCEL-001",
      properties: {
        ulpin: "MP2204918239014",
        ownerName: "Shivraj S.",
        area: "8,200 sq m",
        landType: "Agricultural",
        irrigationStatus: "Rain-fed",
        declaredValue: "₹22.0 Lakh",
        expectedValue: "₹38.0 - ₹44.0 Lakh",
        anomalyScore: 78,
        flagged: true,
        status: "disputed",
        project: "Narmada Valley Express Corridor"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.395, 23.270],
            [77.415, 23.272],
            [77.412, 23.258],
            [77.392, 23.256],
            [77.395, 23.270]
          ]
        ]
      }
    }
  ]
};
