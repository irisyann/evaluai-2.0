<template>
    <v-container>
        <PrintButton elementName="table" />
        <v-data-table :headers="headers" :items="markingScheme" class="mb-10 mx-auto" style="max-width: 80%; width: 100%;">
            <template v-slot:item.question_format="props" >
                <v-chip variant="elevated" :color="questionFormatChipColor(props.item.question_format)">{{ props.item.question_format }}</v-chip>
            </template>

            <template v-slot:item.performance="props" >
                {{ calculateStudentsPerformance(props.item.question_number) }}
            </template>

            <template v-slot:bottom>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import PrintButton from '@/components/PrintButton.vue'

export default {
    name: 'GradesSheet',

    components: {
        PrintButton,
    },

    props: {
        generatedGrades: {
            type: Array,
            required: true,
        },

        totalScore: {
            type: Number,
            required: true,
        },

        markingScheme: {
            type: Array,
            required: true,
        },
    },
    
    data() {
        return {
            headers: [
                { title: '#', value: 'question_number', sortable: true },
                { title: 'Question', value: 'question', sortable: true },
                { title: 'Format', value: 'question_format', sortable: true },
                { title: 'Performance', value: 'performance', sortable: true },
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

        calculateScorePercentage(studentScore, questionFullScore) {
            let percentage = (studentScore / questionFullScore) * 100

            // Round to 2 decimal places
            return Math.round((percentage + Number.EPSILON) * 100) / 100
        },

        calculateStudentsPerformance(questionNumber) {
         
        }
    },
}
</script>