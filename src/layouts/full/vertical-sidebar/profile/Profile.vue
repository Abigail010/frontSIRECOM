<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
const nombres = JSON.parse(localStorage.getItem('user') || '').nombres
const authStore = useAuthStore();
</script>

<template>
    <v-sheet rounded="md" color="lightsecondary" class="px-4 py-3 ExtraBox">
        <div class="d-flex align-center hide-menu">
            <v-avatar size="40">
                <img  src="@/assets/images/misimagenes/logo.png" alt="user" height="40" />
            </v-avatar>
            <div class="ml-4">
                <h4 class="mb-n1 text-h6 textPrimary">{{ nombres }}</h4>
             
            </div>
            <div class="ml-auto">
                <v-btn variant="text" icon rounded="md" color="primary" @click="authStore.logout()">
                    <PowerIcon />

                    <v-tooltip activator="parent" location="top">Salir</v-tooltip>
                </v-btn>
            </div>
        </div>
    </v-sheet>
</template>
<style lang="scss">
.ExtraBox {
    position: relative;
    overflow: hidden;
}
.line-height-none {
    line-height: normal;
}
</style>
