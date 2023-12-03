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

<v-container>
    <v-tabs
        v-model="tab"
        color="primary"
        align-tabs="center"
        class="mb-10"
    >
        <v-tab :value="1">Table</v-tab>
        <v-tab :value="2">Flash cards</v-tab>
        <v-tab :value="3">Questions sheet</v-tab>
        <v-tab :value="4">Answers sheet</v-tab>
    </v-tabs>

    <v-window v-model="tab">
        <v-window-item :value="1">
            <QuestionsTable :generatedQuestions="generatedQuestions" />
        </v-window-item>

        <v-window-item :value="2">
            <QuestionsFlashcards :generatedQuestions="generatedQuestions" />
        </v-window-item>

        <v-window-item :value="3">
            <QuestionsSheet :generatedQuestions="generatedQuestions" />
        </v-window-item>

        <v-window-item :value="4">
            <AnswerSheet :generatedQuestions="generatedQuestions" />
        </v-window-item>
    </v-window>
</v-container>
</template>

<script>
import QuestionsTable from '@/components/questions/Table.vue'
import QuestionsFlashcards from '@/components/questions/Cards.vue'
import QuestionsSheet from '@/components/questions/QuestionsSheet.vue'
import AnswerSheet from '@/components/questions/AnswerSheet.vue'
import SuccessModal from '@/components/global/SuccessModal.vue';

export default {
    name: 'QuestionsList',

    components: {
        QuestionsTable,
        QuestionsFlashcards,
        QuestionsSheet,
        AnswerSheet,
        SuccessModal,
    },
    
    data() {
        return {
            tab: 1,

            generatedQuestions: [],

            headers: [
                { title: 'Taxonomy level', value: 'taxonomy_level', sortable: true },
                {
                    title: 'Question',
                    align: 'start',
                    value: 'question',
                    width: '25%',
                },
                { title: 'Answer', value: 'answer', width: '35%' },
                { title: 'Answer options', value: 'answer_options', width: '20%' },
                { title: 'Question format', value: 'question_format' },
            ],
            
        }
    },

    methods: {
        questionFormatChipColor(questionFormat) {
            if (questionFormat == 'Objective') {
                return 'teal-darken-2'
            } else if (questionFormat == 'Subjective') {
                return 'pink-darken-1'
            } else {
                return 'orange-darken-2'
            }
        },

        taxonomyChipColor(level) {
            switch (level) {
                case 'Remember':
                    return 'purple-lighten-2'
                case 'Understand':
                    return 'purple-lighten-1'
                case 'Apply':
                    return 'purple-darken-1'
                case 'Analyse':
                    return 'purple-darken-2'
                case 'Evaluate':
                    return 'purple-darken-3'
                case 'Create':
                    return 'purple-darken-4'
                default:
                    return 'grey'
            }
        },
    },

    mounted() {
        this.generatedQuestions = JSON.parse(localStorage.getItem('evaluai_generatedQuestions')).questions
        this.inputs = JSON.parse(localStorage.getItem('evaluai_inputs'))
    }
}
</script>
