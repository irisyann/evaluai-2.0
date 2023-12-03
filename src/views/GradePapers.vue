<template>
    <UploadMarkingScheme/>
</template>
    
<script>
import UploadMarkingScheme from "@/components/UploadMarkingScheme.vue";

export default {
    name: 'GradePapers',

    components: {
        UploadMarkingScheme,
    },

    data: () => ({
    }),

    methods: {
        clearStorage() {
            localStorage.removeItem('evaluai_generatedQuestions')
            localStorage.removeItem('evaluai_inputs')
            this.showAnswers = false;
        },
    },

    mounted() {
        window.addEventListener('evaluai_localstorage_changed', (event) => {
            this.showAnswers = event.detail.generatedQuestions !== null
        });
    },
}
</script>
    