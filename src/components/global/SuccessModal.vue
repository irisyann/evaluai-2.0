<template>
    <v-dialog v-model="show">
        <v-sheet
            elevation="12"
            max-width="400"
            rounded="lg"
            width="100%"
            class="pa-4 text-center mx-auto"
        >
            <v-icon
                class="mb-3"
                :color="type"
                :icon="'mdi-' + icon"
                size="80"
            ></v-icon>
        
            <h2 class="text-h6 mb-6">
                {{ title }}
            </h2>
        
            <p class="mb-4 text-medium-emphasis text-body-2">
                {{ description }}
            </p>
        
            <v-divider class="mb-4"></v-divider>
        
            <div class="text-end">
            <v-btn
                v-if="closeButtonText"
                class="text-none"
                :color="type"
                rounded
                variant="flat"
                width="90"
                @click="show = false"
            >
                {{ closeButtonText }}
            </v-btn>
            </div>
        </v-sheet>
    </v-dialog>
</template>

<script>
export default {
    name: 'SuccessModal',
    
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        type: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
        closeButtonText: {
            type: String,
            required: false,
        },
    },

    data() {
        return {
            show: true,
        }
    },

    mounted() {
        setTimeout(() => {
            this.show = false;
        }, 2000);
    },
}
</script>