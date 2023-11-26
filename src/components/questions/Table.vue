<template>
    <v-container>
        <PrintButton elementName="table" />
        <v-data-table id="table"  ref="table" :headers="headers" :items="generatedQuestions" class="mb-10">
            <template v-slot:item.answer="props" >
                <div v-if="props.item.answer" >
                    {{ props.item.answer }}
                </div>
                <div v-else>
                    {{ props.item.suggested_answers }}
                </div>
            </template>

            <template v-slot:item.answer_options="props" >
                <div v-if="props.item.answer_options.length > 0" >
                    <div v-for="(option, i) in props.item.answer_options" :key="i">{{ option }}</div>
                </div>
                <div v-else>
                    -
                </div>
            </template>

            <template v-slot:item.question_format="props" >
                <v-chip variant="elevated" :color="questionFormatChipColor(props.item.question_format)">{{ props.item.question_format }}</v-chip>
            </template>

            <template v-slot:item.taxonomy_level="props" >
                <v-chip variant="elevated" :color="taxonomyChipColor(props.item.taxonomy_level)">{{ props.item.taxonomy_level }}</v-chip>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import PrintButton from '@/components/PrintButton.vue'

export default {
    name: 'Table',

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
                { title: 'Question format', value: 'question_format', sortable: true },
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
}
</script>
