<template>
  <MenuView />
  <div id="page-container">
    <!-- Journey Points Section -->
    <section class="journey-section" aria-labelledby="journey-heading">
  <div class="section-header">
    <h2 id="journey-heading">Journey Map</h2>
  </div>

  <div class="journey-content">
    <!-- Map Container -->
    <div class="map-container" role="region" aria-label="Map of destinations">
      <div id="map" class="map-display"></div>
    </div>

    <!-- Right Side Controls -->
    <div class="control-panel">
      <!-- Discover Places -->
      <div class="control-card" aria-labelledby="discover-heading">
        <h3 id="discover-heading">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Discover Places
        </h3>
        <input
          type="text"
          class="search-input"
          placeholder="Search for places..."
          v-model="searchQuery"
          @input="updateMarkers"
          aria-label="Search for places"
        />
        <div class="search-results">
          <div
            class="result-item"
            v-for="place in filteredPlaces"
            :key="place.id"
            tabindex="0"
            role="button"
            @keydown.enter="focusPlace(place)"
          >
            <span class="place-name">{{ place.name }}</span>
            <button class="btn-add" @click="focusPlace(place)">Add</button>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="control-card" aria-labelledby="navigation-heading">
        <h3 id="navigation-heading">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
          Navigation Between Places
        </h3>
        <div class="route-list">
          <div
            class="route-item"
            v-for="(route, index) in routes"
            :key="route.id"
            tabindex="0"
            :aria-label="'Stop ' + (index + 1) + ': ' + (route.name || 'empty')"
          >
            <div class="route-number">{{ index + 1 }}</div>
            <input
              type="text"
              class="route-input"
              v-model="route.name"
              placeholder="Enter location"
              aria-label="'Enter name for stop ' + (index + 1)"
            />
            <button class="btn-remove" @click="routes.splice(index, 1)">×</button>
          </div>
          <button class="btn-add-route" @click="addRoute">+ Add Stop</button>
        </div>
        <button class="btn-primary" @click="calculateRoute">Calculate Route</button>
      </div>
    </div>
  </div>
</section>

  </div>
</template>

<script>
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MenuView from './MenuView.vue';

export default {

  name: "ActivityPage",

  components: { MenuView },

  data() {
    return {
      map: null,
      searchQuery: "",
      markers: [],
      accessToken:
        "pk.eyJ1IjoidGlhbm11IiwiYSI6ImNtZ2xleWhqODE3MnAybHByYzQ5aHBramUifQ.ciIc2e-ABryMv1kT40QdNg",

      // ✅ route input
      routes: [
        { id: 1, name: "", coordinates: null },
        { id: 2, name: "", coordinates: null },
      ],

      // ✅ database：Discover Places and public route
      destinationData: [
        {
          id: 1,
          name: "The Drum Youth Services",
          type: "Youth Centre",
          coordinates: [144.9425, -37.8005],
          description:
            "Provide young people with group activities, holiday outings, training, and educational support.",
        },
        {
          id: 2,
          name: "Innovation Youth Centre",
          type: "Youth Centre",
          coordinates: [144.96, -37.7],
          description:
            "Programs and activities aimed at improving social, recreational, and employment skills.",
        },
        {
          id: 3,
          name: "Aliya Youth Space",
          type: "Youth Centre",
          coordinates: [144.9942, -37.8694],
          description:
            "A safe space for teenagers and young people to carry out empowerment projects.",
        },
        {
          id: 4,
          name: "Youth Projects Ltd",
          type: "Youth Centre",
          coordinates: [144.9156, -37.706],
          description:
            "Provide outreach services including housing, education, and crisis support.",
        },
      ],
    };
  },

  computed: {
    // ✅ Discover Places searching filter logics
    filteredPlaces() {
      if (!this.searchQuery.trim()) return [];
      const query = this.searchQuery.toLowerCase();
      return this.destinationData.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.type.toLowerCase().includes(query)
      );
    },
  },

  mounted() {
    // ✅ initialize Mapbox
    mapboxgl.accessToken = this.accessToken;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/tianmu/cmglg7k0700jp01rifam2733v",
      center: [144.96, -37.81],
      zoom: 10,
    });
  },

  watch: {
    // ✅ refresh the Marker while results changing
    filteredPlaces(newPlaces) {
      this.updateMarkers(newPlaces);
    },
  },

  methods: {
    // ✅ Discover Places：update the map and marks
    updateMarkers(places) {
      this.markers.forEach((m) => m.remove());
      this.markers = [];

      places.forEach((p) => {
        const marker = new mapboxgl.Marker()
          .setLngLat(p.coordinates)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<h3>${p.name}</h3><p>${p.description}</p>`
            )
          )
          .addTo(this.map);
        this.markers.push(marker);
      });
    },

    focusPlace(place) {
      this.map.flyTo({ center: place.coordinates, zoom: 14 });
      this.updateMarkers([place]);
    },

    // ✅ Navigation Between Places:
    findCoordinates(name) {
      const found = this.destinationData.find(
        (d) => d.name.toLowerCase() === name.toLowerCase()
      );
      return found ? found.coordinates : null;
    },

    addRoute() {
      this.routes.push({ id: Date.now(), name: "", coordinates: null });
    },

    async calculateRoute() {
      console.log("🟡 Calculating route...");
      const locations = this.routes
        .map((r) => this.findCoordinates(r.name))
        .filter((coord) => coord);

      if (locations.length < 2) {
        alert("Please enter at least two valid locations.");
        return;
      }

      const coordsString = locations.map((c) => c.join(",")).join(";");
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${this.accessToken}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || !data.routes.length) {
          alert("No valid route found.");
          return;
        }

        const route = data.routes[0].geometry;

        // remove the old route
        if (this.map.getSource("route")) {
          this.map.removeLayer("route");
          this.map.removeSource("route");
        }


        this.map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: route,
          },
        });

        this.map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#8A2BE2", "line-width": 6 },
        });


        const bounds = new mapboxgl.LngLatBounds();
        route.coordinates.forEach((coord) => bounds.extend(coord));
        this.map.fitBounds(bounds, { padding: 50 });


        this.markers.forEach((m) => m.remove());
        this.markers = locations.map((coord, index) => {
          const marker = new mapboxgl.Marker({
            color: index === 0 ? "green" : index === locations.length - 1 ? "red" : "blue",
          })
            .setLngLat(coord)
            .addTo(this.map);
          return marker;
        });
      } catch (err) {
        console.error("Route calculation error:", err);
      }
    },
  },

};
</script>

<style scoped>
#app{
  padding:80px;
}

#page-container {
  min-height: 100vh;
  background-color: #80A1BA;
  padding: 20px;
  padding-top:150px;
}

/* Section Headers */
.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Journey Points Section */
.journey-section {
  margin: 30px 0;
}

.journey-content {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  align-items: start;
}

/* Map Container */
.map-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  height: 600px;
}

.map-display {
  width: 100%;
  height: 100%;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
  color: #64748b;
  font-size: 18px;
}

/* Control Panel */
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.control-card h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

/* Search Input */
.search-input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #80A1BA;
}

.search-results {
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s;
}

.result-item:hover {
  background: #f8fafc;
}

.place-name {
  font-size: 14px;
  color: #334155;
}

/* Buttons */
.btn-add {
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.btn-add {
  background: #80A1BA;
  color: white;
}

.btn-add:hover {
  background: #6b8aa3;
}

.btn-remove {
  background: #ef4444;
  color: white;
  font-size: 18px;
  padding: 2px 8px;
}

.btn-remove:hover {
  background: #dc2626;
}

/* Route List */
.route-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.route-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.route-number {
  width: 28px;
  height: 28px;
  background: #80A1BA;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.route-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
}

.route-input:focus {
  outline: none;
  border-color: #80A1BA;
}

.btn-add-route {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background: #f1f5f9;
  border: 2px dashed #cbd5e1;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-add-route:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  background: #80A1BA;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #6b8aa3;
}

/* Trip Stats */
.trip-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
}

.stat-value {
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
}

/* Travel Guide Section */
.guide-section {
  margin: 60px 0 30px 0;
  padding-top: 40px;
}

.guide-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Table Controls */
.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  stroke-width: 2;
  color: #94a3b8;
  pointer-events: none;
}

.table-search {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}

.table-search:focus {
  outline: none;
  border-color: #80A1BA;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-select {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  background: white;
}

.filter-select:focus {
  outline: none;
  border-color: #80A1BA;
}

.btn-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #80A1BA;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-filter:hover {
  background: #6b8aa3;
}

.icon-small {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Table */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.guide-table {
  width: 100%;
  border-collapse: collapse;
}

.guide-table thead {
  background: #f8fafc;
}

.guide-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.guide-table th:hover {
  background: #f1f5f9;
}

.sort-indicator {
  margin-left: 6px;
  color: #cbd5e1;
  font-size: 12px;
}

.guide-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.guide-table tbody tr:hover {
  background: #f8fafc;
}

.guide-table td {
  padding: 14px 16px;
  color: #334155;
  font-size: 14px;
}

.place-cell {
  font-weight: 500;
  color: #1e293b;
}

.type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  color: #fbbf24;
  font-size: 14px;
}

.rating-value {
  font-weight: 600;
  color: #1e293b;
}

.description-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 10px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f8fafc;
  border-color: #80A1BA;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .journey-content {
    grid-template-columns: 1fr;
  }

  .control-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .filter-controls {
    flex-direction: column;
  }

  .filter-select,
  .btn-filter {
    width: 100%;
  }
}
</style>
