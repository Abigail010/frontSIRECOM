<script setup lang="ts">
import { ref} from 'vue';
import { useDocumentaryReviewStore } from '@/stores/moduleOne/documentaryReview'
import VuePdfEmbed from 'vue-pdf-embed'

  const documentaryReviewStore = useDocumentaryReviewStore()
  const props = defineProps(['id_file', 'dialog'])
  const filePdf = ref<any>('')
  const isLoading= ref(true)
  const page = ref<any>(1)
  const pageCount = ref(1)
  const pdfRef = ref<any>(null)
  const emit = defineEmits(['dialog-off']);

  const id_documento = ref(null)
  
  const pdfFile = async (id_file:any) => {
    id_documento.value = id_file
    const response = await documentaryReviewStore.getPdfFile(id_file)
    const blob = new Blob([response.data])
    const objectUrl = URL.createObjectURL(blob);
    setTimeout(() => {
      filePdf.value = objectUrl
      page.value = 1
    }, 100);
  }

  const handleDocumentRender = () => {
    // pdfRef.value.pageCount ES LA CANTIDAD TOTAL DE HOJAS DEL DOCUMENTO
    // pdfRef.value.page ES EL NUMERO DE PAGINA ACTUAL 
    isLoading.value = false
    pageCount.value = pdfRef.value.pageCount
  }

  
  const showModal = async (id:any) => {
    await pdfFile(id)
  };

  defineExpose({ showModal });
</script>

<template>
  <div class="text-center">
    <v-dialog
      v-model="props.dialog"
      width="1000"
      height="1000"
      persistent
    >
      <v-card>
        <div class="app-header">
          <template v-if="isLoading">
            Cargando...
          </template>

          <template v-else>
            <span >
              <button :disabled="page <= 1" @click="page--">❮</button>
              {{ page }} / {{ pageCount }}
              <button :disabled="page >= pageCount" @click="page++">❯</button>
            </span>
            <label class="right">
              <button @click="emit('dialog-off', { dialog: false, value: id_documento })">X</button>
            </label>
          </template>
        </div>
        <div class="app-content">
          <vue-pdf-embed
            ref="pdfRef"
            :source="filePdf"
            :page="page"
            @rendered="handleDocumentRender"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
.vue-pdf-embed > div {
  margin-bottom: 8px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
}

.app-header {
  padding: 16px;
  box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  background-color: #555;
  color: #ddd;
}

.app-content {
  padding: 24px 16px;
}
.right {
  float: right;
}
.body {
  margin: 0;
  padding: 0;
  background-color: #ccc;
}
</style>