<template>
  <Toast />

  <main>
    <!-- Introduction -->
    <section class="intro-section">
      <MenuView />
      <h1>Overview</h1>
      <p>About Us:
Founded in 2025 and based in Melbourne, our platform is dedicated to supporting the mental health and personal growth of young Australians. We recognize that adolescence can be a challenging time filled with uncertainty, stress, and significant life transitions. That's why we've created a safe, supportive online community specifically designed to help teenagers navigate these formative years.
Our platform offers a comprehensive range of resources tailored to the unique needs of Australian youth. Through our interactive features, young people can access professional guidance, evidence-based mental health information, and practical tools for building emotional resilience. We facilitate meaningful peer connections, allowing teenagers to share experiences and support one another in a moderated, secure environment.
Beyond digital resources, our Activity feature helps users discover local youth centers and programs throughout Australia, connecting online support with real-world community engagement. We believe every young person deserves access to quality mental health support and the opportunity to thrive. Our mission is to empower Australian adolescents with the resources, connections, and confidence they need to overcome challenges and reach their full potential.</p>
    </section>

    <!-- Contact Section -->
    <section class="contact-section" aria-labelledby="contact-title">
      <h2 id="contact-title" class="visually-hidden">Contact Section</h2>

      <div class="control-panel">
        <div class="control-card">
          <Button
            label="Export CSV"
            icon="pi pi-download"
            @click="exportToCSV"
            class="p-mb-2"
            aria-label="Download staff contacts CSV"
          >
            Download the .csv
          </Button>
        </div>
      </div>

      <div class="table-container">
        <DataTable
          ref="staffTableRef"
          :value="staff"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5,10,20,50]"
          tableStyle="min-width: 50rem"
          exportFilename="staff-contacts"
          aria-label="Staff Contacts Table"
        >
          <template #header>
            <div class="table-header">
              <span class="table-title">Contact</span>
            </div>
          </template>
          <Column field="Employee ID" sortable header="Employee ID" />
          <Column field="Name" sortable header="Name" />
          <Column field="Email" sortable header="Email" />
          <Column field="Phone" sortable header="Phone" />
          <template #footer>
            <span>In total there are {{ staff.length }} staff.</span>
          </template>
        </DataTable>
      </div>
    </section>

    <!-- Booking Section -->
    <section class="booking-section" aria-labelledby="booking-title">
      <h2 id="booking-title">Book a counselling appointment with our mentor</h2>

      <div class="booking-container">
        <DataTable
          :value="mentors"
          ref="mentorTableRef"
          :filters="filters"
          tableStyle="min-width: 50rem"
          class="p-datatable-sm small-font-table booking-table"
          emptyMessage="No mentors available."
          v-if="mentors.length > 0"
          :key="mentors.length + (hoveredSlot?.slot || '')"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5,10,20,50]"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown"
          aria-label="Mentor Booking Table"
        >
          <template #header>
            <div class="flex justify-between">
              <IconField>
                <InputIcon iconPosition="right">
                  <i class="pi pi-search" aria-hidden="true" />
                </InputIcon>
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Search mentors..."
                  aria-label="Search mentors"
                />
              </IconField>
            </div>
          </template>

          <!-- Mentor Column -->
          <Column field="name" header="Mentor" sortable>
            <template #body="{ data }">
              {{ data.name }}
            </template>
          </Column>

          <!-- Time Slots -->
          <Column
            v-for="slot in timeSlots"
            :key="slot"
            :header="slot"
            bodyClass="text-center"
          >
            <template #body="{ data }">
              <span
                role="button"
                :aria-label="`${slot} for ${data.name}: ${isAvailable(data, slot) ? 'Available' : 'Booked'}`"
                tabindex="0"
                @click="selectCell(data.employeeId, slot)"
                @keydown.enter="selectCell(data.employeeId, slot)"
                @mouseover="hoverCell(data.employeeId, slot)"
                @mouseleave="leaveCell"
                :class="getCellClass(data.employeeId, slot)"
                :style="getCellStyle(data.employeeId, slot)"
                class="w-full h-full flex items-center justify-center cursor-pointer p-1 border rounded text-sm"
              >
                {{ isAvailable(data, slot) ? 'Available' : 'Booked' }}
              </span>
            </template>
          </Column>
        </DataTable>

        <!-- Booking Button -->
        <Button
          v-if="selectedSlot"
          :label="`Confirm Booking for ${selectedSlotText}`"
          @click="confirmBooking"
          class="mt-3"
          severity="success"
          aria-label="Confirm selected booking slot"
        />

        <!-- Confirmation Dialog -->
        <Dialog
          v-model:visible="showConfirm"
          header="Confirm Booking"
          :modal="true"
          :style="'width: 30rem;'"
          aria-modal="true"
        >
          <p>Booking Confirm: {{ selectedSlotText }}</p>
          <template #footer>
            <Button label="Cancel" @click="cancelBooking" severity="secondary" />
            <Button label="Confirm" @click="submitBooking" />
          </template>
        </Dialog>
      </div>
    </section>
  </main>
</template>

<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { ref, computed, onMounted, nextTick } from 'vue';
import { db } from './firebase';
import { runTransaction, serverTimestamp, addDoc, getDocs, collection, doc , arrayUnion } from 'firebase/firestore';
import Dialog from 'primevue/dialog';
import MenuView from './MenuView.vue'
import { auth } from './firebase';

import ContactData from '../assets/Contact.json';

// Staff Contact Table
const staff = computed(() => ContactData.map(item => ({ ...item })));
const toast = useToast();
const staffTableRef = ref(null);

onMounted(() => {
  console.log('Loading local staff data...');
  staff.value = loadLocalStaff();
  console.log('Staff loaded:', staff.value.length, 'items');
  // mentor data
  console.log('Loading mentor timetable data...');
  mentors.value = loadData();
  console.log('Mentors loaded:', mentors.value.length, 'items');
});

// exportToCSV and loadLocalStaff functions
const exportToCSV = () => {
  console.log('Export button clicked! Staff length:', staff.value.length);

  const dt = staffTableRef.value;
  if (dt && staff.value.length > 0 && dt.exportCSV) {
    dt.exportCSV({ selectionOnly: false });
    toast.add({ severity: 'success', summary: 'Success', detail: 'CSV downloaded! Check your downloads folder.' });
  } else {
    console.error('Export failed - DataTable or data missing');
    toast.add({ severity: 'error', summary: 'Error', detail: 'No data or table not ready. Refresh page.' });
  }
};

const loadLocalStaff = () => {
  try {
    const saved = localStorage.getItem('staff');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('Loaded from localStorage:', parsed.length, 'items');
      return parsed;
    } else {
      console.log('No saved staff data, returning empty array');
      return [];
    }
  } catch (error) {
    console.error('Error loading staff from localStorage:', error);
    toast.add({ severity: 'error', summary: 'Load Error', detail: 'Data corrupted, starting fresh.' });
    return [];
  }
};

// Booking Session
const mentors = ref([]);  // Fetch timetable data
const selectedSlot = ref(null);  // { employeeId, slot }
const hoveredSlot = ref(null);
const showConfirm = ref(false);
const mentorTableRef = ref(null);
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
const filters = ref();
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';


// loadData from Firestore
const loadData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timetables'));
     mentors.value = querySnapshot.docs.map(docSnapshot => {
      const data = docSnapshot.data();
      // Ensure freeTime is an array
      let freeTime = data.freeTime;
      if (freeTime && !Array.isArray(freeTime)) {
        freeTime = Object.values(freeTime);
      }
      return {
        employeeId: data.employeeId,
        ...data,
        freeTime: freeTime || []
      };
    });
    console.log('Loaded mentors:', mentors.value);
  } catch (error) {
    console.error('loading failed:', error);
  }
};

// timeSlots computed
const timeSlots = computed(() => {
  const allSlots = new Set();
  mentors.value.forEach(mentor => {
    mentor.freeTime?.forEach(slotObj => {
      allSlots.add(`${slotObj.start}-${slotObj.end}`);
    });
  });
  return Array.from(allSlots).sort();
});

let hoverTimeout = null;

// hoverCell
const hoverCell = (id, slot) => {
  console.log('hoverCell called:', id, slot);

  if (!id || !slot) return;  // guard clause

  if (hoverTimeout) clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    hoveredSlot.value = { id, slot };
    console.log('Hovered updated:', hoveredSlot.value);
  }, 50);
};

const leaveCell = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  hoveredSlot.value = null;
  console.log('Hover cleared');
};

// check the availability of a slot
const isAvailable = (mentor, slot) => {
  if (!mentor || !Array.isArray(mentor.freeTime)) return false;
  const slotObj = mentor.freeTime.find(s => `${s.start}-${s.end}` === slot);
  return slotObj?.status === 'available';
};

// cell class（Using snapshot，avoid reactive dependencies)
const getCellClass = (employeeId, slot) => {
  if (!employeeId || !slot) return 'bg-gray-200 text-gray-500 p-1 border rounded text-sm cursor-default';

  const mentor = mentors.value.find(m => m.employeeId === employeeId);
  if (!mentor) return 'bg-gray-200 text-gray-500 p-1 border rounded text-sm cursor-default';

  const isAvail = isAvailable(mentor, slot);
  const isSelected = selectedSlot.value?.employeeId === employeeId && selectedSlot.value?.slot === slot;
  const isHovered = hoveredSlot.value?.employeeId === employeeId && hoveredSlot.value?.slot === slot;

  const baseClass = 'w-full h-full flex items-center justify-center cursor-pointer p-1 border rounded text-sm';
  const statusClass = isAvail ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const selectedClass = isSelected ? 'bg-blue-200 border-blue-400 ring-2 ring-blue-300' : '';
  const hoveredClass = isHovered ? 'bg-yellow-100 scale-105' : '';

  return `${baseClass} ${statusClass} ${selectedClass} ${hoveredClass}`;
};

// getCellStyle
const getCellStyle = (employeeId, slot) => {
  if (!employeeId || !slot) return {};
  const mentor = mentors.value.find(m => m.employeeId === employeeId);
  if (!mentor) return {};

  const isAvail = isAvailable(mentor, slot);
  const isHovered = hoveredSlot.value?.employeeId === employeeId && hoveredSlot.value?.slot === slot;

  return {
    backgroundColor: isAvail ? '#d4edda' : '#f8d7da',
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
  };
};

const selectCell = (employeeId, slot) => {
  console.log('selectCell called:', employeeId, slot);

  if (!employeeId || !slot) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Invalid slot.' });
    return;
  }

  const mentor = mentors.value.find(m => m.employeeId === employeeId);
  if (!mentor) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Mentor not found.' });
    return;
  }

  if (isAvailable(mentor, slot)) {
    selectedSlot.value = { employeeId, slot };
    console.log('Slot selected:', selectedSlot.value);
    toast.add({ severity: 'info', summary: 'Selected', detail: 'Ready to confirm.' });

    confirmBooking();
  } else {
    toast.add({ severity: 'warn', summary: 'Unavailable', detail: 'This slot is booked.' });
  }
};

const submitBooking = async () => {
  if (!selectedSlot.value) return;
  const user = auth.currentUser;
  if (!user) {
    toast.add({ severity: 'warn', summary: 'Not signed in', detail: 'Please login to book.' });
    return;
  }

  const mentor = mentors.value.find(m => m.employeeId === selectedSlot.value.employeeId);
  if (!mentor) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Mentor not found.' });
    return;
  }

  const freeTimeArray = Array.isArray(mentor.freeTime) ? mentor.freeTime : Object.values(mentor.freeTime || []);
  const slotIndex = freeTimeArray.findIndex(s => `${s.start}-${s.end}` === selectedSlot.value.slot);
  if (slotIndex === -1) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Selected slot not found.' });
    return;
  }

  const mentorDocRef = doc(db, 'timetables', mentor.employeeId);  // 假设 employeeId 是文档 ID
  const userDocRef = doc(db, 'users', user.uid);

  try {
    await runTransaction(db, async (transaction) => {
      const mentorSnap = await transaction.get(mentorDocRef);
      if (!mentorSnap.exists()) throw new Error('Mentor not found (transaction).');

      let ft = mentorSnap.data().freeTime || [];
      if (!Array.isArray(ft)) ft = Object.values(ft);

      const idx = ft.findIndex(s => `${s.start}-${s.end}` === selectedSlot.value.slot);
      if (idx === -1) throw new Error('Slot not found (transaction).');
      if (ft[idx].status === 'booked') throw new Error('Slot already booked.');

      const newFreeTime = ft.map((s, i) => (i === idx ? { ...s, status: 'booked' } : s));
      transaction.update(mentorDocRef, { freeTime: newFreeTime });

      // create booking doc - 直接用这个，删除 newBookingRef
      const tempBookingRef = doc(collection(db, 'bookings'));
      transaction.set(tempBookingRef, {
        userId: user.uid,
        mentorId: mentor.employeeId,
        start: ft[idx].start,
        end: ft[idx].end,
        slot: `${ft[idx].start}-${ft[idx].end}`,
        status: 'confirmed',
        createdAt: serverTimestamp()
      });

      transaction.set(userDocRef, { bookings: arrayUnion(tempBookingRef.id) }, { merge: true });
    });

    toast.add({ severity: 'success', summary: 'Booked', detail: 'Your booking was created.' });
    showConfirm.value = false;
    selectedSlot.value = null;
    await nextTick();
    await loadData();
  } catch (e) {
    console.error('Booking failed:', e);
    toast.add({ severity: 'error', summary: 'Booking failed', detail: e.message || 'Try again' });
  }
};

const confirmBooking = () => {
  if (selectedSlot.value) {
    showConfirm.value = true;
    console.log('Dialog opened');
  }
};

// cancelBooking
const cancelBooking = () => {
  showConfirm.value = false;
  selectedSlot.value = null;
  toast.add({ severity: 'info', summary: 'Cancelled', detail: 'Booking cancelled.' });
};


// selected slot text
const selectedSlotText = computed(() => {
  if (!selectedSlot.value) return '';
  const mentor = mentors.value.find(m => m.employeeId === selectedSlot.value.employeeId);
  return `${mentor?.name || 'Mentor'} - ${selectedSlot.value.slot}`;
});

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
  };
};
initFilters();
// Initializing loading
onMounted(loadData);

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
  /* top:120px; */
  /* background: linear-gradient(135deg, #80A1BA 0%, #6b8aa3 100%); */
  margin-top: 18px;
  margin-bottom: 8px;
  padding: 60px 20px;
  position: relative;
  overflow: hidden;
}

/* Contact Section */
.contact-section {
  padding: 60px 20px;
  /* min-width:800px; */
  /* max-width: 1400px; */
  margin: 0 auto;
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
  width: 1200px;
  padding: 1rem;
  border: 1px solid green;
  display: block;
  min-height: 400px;
  margin-top: 15px;
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
  gap: 12px;
  margin-top:-50px;
  overflow: visible;
}

.control-card {
  border-radius: 12px;
  padding-top: 6px;
  margin-top: -42px;
  position: relative;
  z-index: 3;
}

.hovered { background: #f0f0f0; }

.booking-section {
  padding: 60px 20px;
  background: #80A1BA;
}

.booking-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-height: 400px;
  overflow: auto;
  border-radius: 12px;
}

.booking-table {
  width: 100% !important;
  min-height: 300px;
}

.booking-table :deep(.p-datatable-tbody > tr) {
  min-height: 40px;
}

.booking-table :deep(.p-datatable-tbody > tr > td) {
  padding: 8px;
  font-size: 0.9rem;
}

mentor-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

iconfield {
  display: flex;
  align-items: center;
  position: relative;
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
