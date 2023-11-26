<template>
    <div v-if="showAnswers" class="d-flex justify-center mb-10">
        <v-btn color="secondary" @click="clearStorage">Generate new questions</v-btn>
    </div>

    <SuccessModal 
        v-if="showAnswers"
        title="Questions generated!"
        type="success"
        icon="check-circle"
        closeButtonText="OK"
    />

    <QuestionsForm v-if="!showAnswers" />
    <QuestionsList v-if="showAnswers" />

</template>
    
<script>
import QuestionsForm from "@/components/QuestionsForm.vue";
import QuestionsList from '@/components/QuestionsList.vue';
import SuccessModal from '@/components/global/SuccessModal.vue';

export default {
    name: 'GenerateQuestions',

    components: {
        QuestionsForm,
        QuestionsList,
        SuccessModal,
    },

    data: () => ({
        showAnswers: true,
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
    