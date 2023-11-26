<template>
    <v-container>
        <PrintButton />
        <v-card max-width="700px" width="100%" flat class="mx-auto pa-3 d-flex" color="accent">
            <v-card-text class="py-5 d-flex flex-wrap justify-center">
                <v-list class="pa-3 text-black" style="background-color: transparent; border-radius: 5px;">
                    <v-list-item v-for="(answer, i) in generatedQuestions" :key="i" class="mb-6">
                        <v-list-item-title class="font-weight-bold">Answer {{ i+1 }}</v-list-item-title>
                        <div v-if="answer.question_format == 'Objective'">{{ answer.answer }}</div>
                        <div v-if="answer.question_format !== 'Objective'" class="text-justify">{{ answer.suggested_answers }}</div>
                    </v-list-item>
                </v-list>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import PrintButton from '@/components/PrintButton.vue'
export default {
    name: 'Cards',

    components: {
        PrintButton,
    },

    props: {
        generatedQuestions: {
            type: Array,
            required: true,
        },
    },
    
    data() {
        return {
            
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
}
</script>