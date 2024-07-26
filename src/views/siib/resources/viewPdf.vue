<script setup lang="ts">
import { ref} from 'vue';
import { useDocumentaryReviewStore } from '@/stores/moduleOne/documentaryReview'
import { XIcon } from 'vue-tabler-icons'
// import VuePdfEmbed from 'vue-pdf-embed'
import VuePdfApp from 'vue3-pdf-app'
import "vue3-pdf-app/dist/icons/main.css"

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

  const panelConfiguration = ({
    secondaryToolbar: false,
    toolbar: {
      toolbarViewerLeft: {
        findbar: false,
      },
      toolbarViewerRight: {
        print: false,
        openFile: false,
        viewBookmark: false,
      },
    }
  }) as any

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
          <label class="right">
            <button @click="emit('dialog-off', { dialog: false, value: id_documento }); filePdf=null">
              <XIcon style="cursor: pointer;" class="mr-1"/>
            </button>
          </label>
        </div>
        <vue-pdf-app
          :config="panelConfiguration"
          :page-number="1"
          :pdf="filePdf"
          theme="dark"
          style="height: 100vh;">
        </vue-pdf-app>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped>
.app-header {
  padding: 10px;
  background-color: #24364E;
  color: #ffffff;
}
.right {
  float: right;
}
</style>