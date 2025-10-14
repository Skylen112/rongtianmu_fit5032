<template>
  <section class="intro-section">
    <h1>Overview</h1>
    <span>Our company established in 2025...</span>
  </section>

  <section class="contact-section">
    <div class="control-panel">
      <div class="control-card">
        <h3></h3>
      </div>
    </div>
    <div class="table-container">
      <DataTable :value="staff" paginator :rows="5" :rowsPerPageOptions="[5,10,20,50]" tableStyle="min-width: 50rem">
        <template #header>
          <div class="table-header">
            <span class="table-title">Contact</span>
          </div>
        </template>
        <Column field="Employee ID" sortable header="Employee ID"></Column>
        <Column field="Name" sortable header="Name"></Column>
        <Column field="Email" sortable header="Email"></Column>
        <Column field="Phone" sortable header="Phone"></Column>
        <template #footer>In total there are {{ staff.length }} staff.</template>
      </DataTable>
    </div>
  </section>

  <section>
    <h1 class="social-section">Mockaroo</h1>
  </section>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed } from 'vue';

import ContactData from '../assets/Contact.json';

const staff = computed(() => ContactData.map(item => ({ ...item })));
</script>

<style scoped>
.flex {
  border: 1px solid blue;
}

/* Global Page Styles */
body {
  margin: 0;
  padding: 0;
  background-color: #80A1BA;
}

/* Introduction Section */
.intro-section {
  background: linear-gradient(135deg, #80A1BA 0%, #6b8aa3 100%);
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

.intro-container {
  max-width: 1200px;
  margin: 0 auto;
}

.intro-content {
  background: white;
  border-radius: 16px;
  padding: 50px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  position: relative;
  margin-bottom: 40px;
}

.intro-title {
  font-size: 42px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

.intro-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 80px;
  height: 4px;
  background: #80A1BA;
  border-radius: 2px;
}

.intro-text {
  color: #475569;
  font-size: 16px;
  line-height: 1.8;
  max-width: 900px;
}

.intro-text p {
  margin-bottom: 20px;
}

.intro-text p:last-child {
  margin-bottom: 0;
}

/* Decorative Elements */
.decorative-elements {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.deco-1 {
  width: 200px;
  height: 200px;
  background: #80A1BA;
  top: -50px;
  right: -50px;
}

.deco-2 {
  width: 150px;
  height: 150px;
  background: #6b8aa3;
  bottom: 50px;
  right: 100px;
}

.deco-line {
  position: absolute;
  width: 300px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #80A1BA, transparent);
  top: 50%;
  right: 0;
  opacity: 0.2;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #80A1BA;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Contact Section */
.contact-section {
  padding: 60px 20px;
  /* min-width:800px; */
  /* max-width: 1400px; */
  margin: 0 auto;
}

.section-title {
  color: white;
  font-size: 36px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  align-items: start;
}

/* Contact Table */
.table-container {
  margin: 2rem auto;
  text-align: left;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  /* min-width: 400px; */
  /* max-width: 1200px; */
  width: 1200px;
  padding: 1rem;
  border: 1px solid green;
  display: block;       /* 确保 block */
  min-height: 400px;    /* ⚠️ 关键，避免高度为0 */
}

.contact-table table {
  width: 100%;
  border-collapse: collapse;
}

.contact-table thead {
  background: #f8fafc;
}

.contact-table th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  border-bottom: 2px solid #e2e8f0;
}

.contact-table tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}

.contact-table tbody tr:hover {
  background: #f8fafc;
}

.contact-table td {
  padding: 16px;
  color: #334155;
  font-size: 14px;
}

.contact-table a {
  color: #80A1BA;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-table a:hover {
  color: #6b8aa3;
  text-decoration: underline;
}

/* Control Panel */
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .contact-table {
    overflow-x: auto;
  }

  .contact-table table {
    min-width: 600px;
  }
}
</style>
