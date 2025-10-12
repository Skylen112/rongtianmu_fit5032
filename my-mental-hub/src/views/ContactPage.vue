<template>
  <section class="intro-section">
    <h1 class>Overview</h1>
    <span>Our company establised in 2025...</span>
  </section>

  <section class="contact-section">
    <div class="table-container">
      <DataTable :value="staff" tableStyle="width: 100%; max-width:800px">
        <template #header>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xl font-bold">Contact</span>
            <Button icon="pi pi-refresh" rounded raised @click="refreshTable"></Button>
          </div>
        </template>
        <Column field="Employee ID" header="Employee ID"></Column>
        <Column field="Name" header="Name"></Column>
        <Column field="Email" header="Email"></Column>
        <Column field="Phone" header="Phone"></Column>
        <template #footer>In total there are {{ staff ? staff.length :0 }} staff. </template>
      </DataTable>
    </div>

    <div class="control-panel">
      <div class="control-card">
        <h3>

        </h3>
      </div>
      <div class="control-card">
        <h3>

        </h3>
      </div>
      <div class="control-card">
        <h3>

        </h3>
      </div>
    </div>
  </section>

  <section>
    <h1 class="social-section">Mockaroo</h1>
  </section>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import {ref, onMounted } from 'vue';
import Button from 'primevue/button';

import ContactData from '../assets/Contact.json'

// import the componets
const staff = ref([])


onMounted(() => {
  staff.value = ContactData
})

const refreshTable = () => {
  staff.value = [...ContactData]
}
</script>


<style scoped>
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
  min-width:800px;
  max-width: 1400px;
  margin: 0 auto;
  border: 1px solid red;
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
  min-width: 400px;
  max-width: 1200px;
  padding: 1rem;
  border: 1px solid green;

  display: block;       /* 确保 block */
  min-height: 400px;    /* ⚠️ 关键，避免高度为0 */
}

.subsection-title {
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
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

.dept-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dept-icon {
  font-size: 20px;
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

.control-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e293b;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 18px;
}

.icon {
  width: 22px;
  height: 22px;
  stroke-width: 2;
  color: #80A1BA;
}

.info-content {
  color: #475569;
  font-size: 14px;
  line-height: 1.7;
}

.address-text {
  margin-bottom: 16px;
  line-height: 1.8;
}

.link-button {
  display: inline-flex;
  align-items: center;
  color: #80A1BA;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.link-button:hover {
  color: #6b8aa3;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hours-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.day {
  font-weight: 500;
  color: #334155;
}

.time {
  color: #64748b;
}

.emergency-text {
  margin-bottom: 16px;
}

.emergency-number {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #fee2e2;
  border-radius: 8px;
  margin-bottom: 12px;
}

.emergency-icon {
  font-size: 24px;
}

.emergency-phone {
  font-size: 20px;
  font-weight: 700;
  color: #dc2626;
}

.emergency-note {
  text-align: center;
  font-size: 13px;
  color: #64748b;
  font-style: italic;
}

/* Social Section */
.social-section {
  padding: 60px 20px 80px;
  background: #80A1BA;
}

.social-container {
  max-width: 900px;
  margin: 0 auto;
}

.social-title {
  color: white;
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
}

.attribution-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 30px;
  align-items: flex-start;
  margin-bottom: 40px;
}

.mockaroo-logo {
  flex-shrink: 0;
}

.mockaroo-logo svg {
  width: 80px;
  height: 80px;
  color: #80A1BA;
  stroke-width: 1.5;
}

.attribution-content h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}

.attribution-content p {
  color: #475569;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 20px;
}

.attribution-links {
  display: flex;
  gap: 16px;
}

.attribution-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #80A1BA;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

.attribution-link:hover {
  background: #6b8aa3;
}

.link-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Social Links */
.social-links {
  text-align: center;
  margin-top: 50px;
}

.social-links-title {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.social-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #80A1BA;
  transition: all 0.3s;
  text-decoration: none;
}

.social-icon svg {
  width: 24px;
  height: 24px;
}

.social-icon:hover {
  background: #6b8aa3;
  color: white;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .contact-layout {
    grid-template-columns: 1fr;
  }

  .control-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .intro-content {
    padding: 30px;
  }

  .intro-title {
    font-size: 32px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .attribution-card {
    flex-direction: column;
    text-align: center;
  }

  .mockaroo-logo {
    margin: 0 auto;
  }

  .control-panel {
    grid-template-columns: 1fr;
  }
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
