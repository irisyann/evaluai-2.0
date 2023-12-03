<template>
    <v-container>
        <v-tabs
            v-model="tab"
            color="primary"
            align-tabs="center"
            class="mb-10"
        >
            <v-tab :value="1">Grades</v-tab>
            <v-tab :value="2">Performance</v-tab>
        </v-tabs>
    
        <v-window v-model="tab">
            <v-window-item :value="1">
                <GradesSheet :generatedGrades="generatedGrades" :totalScore="totalScore" />
            </v-window-item>
    
            <v-window-item :value="2">
                <GradesTable :generatedGrades="generatedGrades" :markingScheme="markingScheme"  :totalScore="totalScore"/>
            </v-window-item>
        </v-window>
    </v-container>
    </template>
    
    <script>
    import GradesTable from '@/components/grades/Table.vue'
    import GradesSheet from '@/components/grades/GradesSheet.vue'
    
    export default {
        name: 'GradesList',
    
        components: {
            GradesTable,
            GradesSheet,
        },
     
        data() {
            return {
                tab: 1,
    
                generatedGrades: [],
                totalScore: 0,
            }
        },
    
        methods: {
        },
    
        mounted() {
            this.generatedGrades = JSON.parse(localStorage.getItem('evaluai_gradedPapers')).students
            this.totalScore = JSON.parse(localStorage.getItem('evaluai_markingScheme')).total_score
            this.markingScheme = JSON.parse(localStorage.getItem('evaluai_markingScheme')).questions
            this.inputs = JSON.parse(localStorage.getItem('evaluai_inputs'))
        }
    }
    </script>
    