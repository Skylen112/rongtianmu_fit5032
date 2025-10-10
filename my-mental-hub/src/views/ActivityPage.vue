<template>
  <div class="page-container">
    <MenuView />

    <!-- Journey Points Section -->
    <section class="journey-section">
      <div class="section-header">
        <h2>Journey Points</h2>
      </div>

      <div class="journey-content">
        <!-- Map Container -->
        <div class="map-container">
          <div id="map" class="map-display">
            <!-- 地图将在这里加载 -->
            <div class="map-placeholder">
              <div id="map" class="map-display"></div>
            </div>
          </div>
        </div>

        <!-- Right Side Controls -->
        <div class="control-panel">
          <!-- Search Places -->
          <div class="control-card">
            <h3>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Searching Places of Interest
            </h3>
            <input
              type="text"
              class="search-input"
              placeholder="Search for places..."
              v-model="searchQuery"
            />
            <div class="search-results">
              <!-- 搜索结果列表 -->
              <div class="result-item" v-for="place in filteredPlaces" :key="place.id">
                <span class="place-name">{{ place.name }}</span>
                <button class="btn-add">Add</button>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="control-card">
            <h3>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 11l19-9-9 19-2-8-8-2z"/>
              </svg>
              Navigation Between Places
            </h3>
            <div class="route-list">
              <div class="route-item" v-for="(route, index) in routes" :key="index">
                <div class="route-number">{{ index + 1 }}</div>
                <input
                  type="text"
                  class="route-input"
                  v-model="route.name"
                  placeholder="Enter location"
                />
                <button class="btn-remove">×</button>
              </div>
              <button class="btn-add-route" @click="addRoute">+ Add Stop</button>
            </div>
            <button class="btn-primary">Calculate Route</button>
          </div>

          <!-- Trip Information -->
          <div class="control-card">
            <h3>
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              Trip Information
            </h3>
            <div class="trip-stats">
              <div class="stat-item">
                <span class="stat-label">Total Distance</span>
                <span class="stat-value">0 km</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Estimated Time</span>
                <span class="stat-value">0 hrs</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Total Stops</span>
                <span class="stat-value">{{ routes.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Travel Guide Section -->
    <section class="guide-section">
      <div class="section-header">
        <h2>Travel Guide</h2>
      </div>

      <div class="guide-content">
        <!-- Search and Filter Controls -->
        <div class="table-controls">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              class="table-search"
              placeholder="Search in guide..."
              v-model="tableSearch"
            />
          </div>

          <div class="filter-controls">
            <select class="filter-select" v-model="sortBy">
              <option value="">Sort by...</option>
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
            <button class="btn-filter">
              <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
              Filter
            </button>
          </div>
        </div>

        <!-- Data Table -->
        <div class="table-wrapper">
          <table class="guide-table">
            <thead>
              <tr>
                <th @click="sortTable('name')">
                  Place Name
                  <span class="sort-indicator">↕</span>
                </th>
                <th @click="sortTable('type')">
                  Type
                  <span class="sort-indicator">↕</span>
                </th>
                <th @click="sortTable('rating')">
                  Rating
                  <span class="sort-indicator">↕</span>
                </th>
                <th @click="sortTable('distance')">
                  Distance
                  <span class="sort-indicator">↕</span>
                </th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredGuideData" :key="item.id">
                <td class="place-cell">{{ item.name }}</td>
                <td>
                  <span class="type-badge">{{ item.type }}</span>
                </td>
                <td>
                  <div class="rating">
                    <span class="stars">★★★★☆</span>
                    <span class="rating-value">{{ item.rating }}</span>
                  </div>
                </td>
                <td>{{ item.distance }}</td>
                <td class="description-cell">{{ item.description }}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="View">👁️</button>
                    <button class="btn-icon" title="Add to trip">➕</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'TravelPage',
  data() {
    return {
      map: null, // 存放 Mapbox 实例
      searchQuery: '',
      tableSearch: '',
      sortBy: '',
      routes: [
        { id: 1, name: '' },
        { id: 2, name: '' }
      ],
      filteredPlaces: [
        { id: 1, name: 'Sample Place 1' },
        { id: 2, name: 'Sample Place 2' }
      ],
      guideData: [
        {
          id: 1,
          name: 'Sample Destination',
          type: 'Attraction',
          rating: 4.5,
          distance: '2.5 km',
          description: 'A beautiful place to visit'
        }
      ]
    };
  },
  computed: {
    filteredGuideData() {
      if (!this.tableSearch) return this.guideData;
      const query = this.tableSearch.toLowerCase();
      return this.guideData.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    addRoute() {
      this.routes.push({
        id: Date.now(),
        name: ''
      });
    },
    sortTable(column) {
      console.log('Sorting by:', column);
      // 实现排序逻辑
    }
  },
  mounted() {
    // 初始化 Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoidGlhbm11IiwiYSI6ImNtZ2xleWhqODE3MnAybHByYzQ5aHBramUifQ.ciIc2e-ABryMv1kT40QdNg';

    this.map = new mapboxgl.Map({
      container: 'map', // template 中 div 的 id
      style: 'mapbox://styles/tianmu/cmglg7k0700jp01rifam2733v',
      center: [-74.5, 40],
      zoom: 9
    });

    // 移除占位元素
    const placeholder = document.querySelector('#map .map-placeholder');
    if (placeholder) placeholder.remove();

    // 添加测试 Marker
    new mapboxgl.Marker()
      .setLngLat([-74.5, 40])
      .setPopup(new mapboxgl.Popup().setHTML("<h3>Hello Mapbox!</h3>"))
      .addTo(this.map);
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #80A1BA;
  padding: 20px;
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
.btn-add, .btn-remove {
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
