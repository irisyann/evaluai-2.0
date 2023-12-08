<template>
    <v-container>
        <div class="mx-auto" style="max-width: 80%; width: 100%;">
            <v-data-table :headers="headers" :items="markingScheme" class="mb-16 mx-auto">
                <template v-slot:item.question_format="props" >
                    <v-chip variant="elevated" :color="questionFormatChipColor(props.item.question_format)">{{ props.item.question_format }}</v-chip>
                </template>
    
                <template v-slot:item.performance="props" >
                    {{ calculateStudentsPerformance(props.item.question_number) }}%
                </template>
    
                <template v-slot:bottom>
                </template>
            </v-data-table>
            
            <div class="d-flex align-top justify-space-between mb-10">
                <v-card style="background-color: transparent">
                    <v-card-title>Performance of students by question</v-card-title>
                    <v-card-text>
                        <canvas id="performanceByQuestionsChart"></canvas>
                    </v-card-text>
                </v-card>
                <v-card style="background-color: transparent">
                    <v-card-title>Grades performance</v-card-title>
                    <v-card-text>
                        <canvas id="gradesPerformanceChart"></canvas>
                    </v-card-text>
                </v-card>
            </div>

            <v-card class="mb-10" style="background-color: transparent">
                <v-card-title>Past performance analysis</v-card-title>
                <v-card-text>
                    <canvas id="pastPerformanceAnalysisChart"></canvas>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script>
import PrintButton from '@/components/PrintButton.vue'
import Chart from 'chart.js/auto'

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
            let question = this.markingScheme.find(question => question.question_number == questionNumber)
            
            let studentTotalScore = 0
            let questionTotalScore = question.full_question_score

            this.generatedGrades.forEach(student => {
                let studentScore= student.questions[questionNumber - 1].student_score
                if (studentScore) {
                    studentTotalScore += studentScore
                }
            })

            return (studentTotalScore / this.generatedGrades.length) / questionTotalScore * 100
        },
    },

    computed: {
        getAllQuestionsScorePercentage() {
            let arr = []

            if (!this.markingScheme) {
                return arr
            }

            for (let i = 0; i < this.markingScheme.length; i++) {
                arr.push(this.calculateStudentsPerformance(i+1))
            }

            return arr
        }
    },

    mounted() {
        let questions = []
        let questionScorePercentages = []

        if (this.markingScheme) {
            for (let i = 0; i < this.markingScheme.length; i++) {
                questions.push("Question " + (i+1))
                questionScorePercentages.push(this.calculateStudentsPerformance(i+1))
            }
        }

        const ctx = document.getElementById('performanceByQuestionsChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: questions,
                datasets: [{
                    label: 'Score percentage',
                    data: questionScorePercentages,
                    borderWidth: 1
                }]
            },
        });

        const ctx2 = document.getElementById('gradesPerformanceChart');
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['A', 'B', 'C', 'D', 'E', 'F'],
                datasets: [{
                    label: 'Grade percentage',
                    data: [80, 20],
                }]
            },
        });

        const ctx3 = document.getElementById('pastPerformanceAnalysisChart');
        new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
                datasets: [{
                    label: 'Overall average score',
                    data: [80, 60, 70, 90, 80, 70],
                }]
            },
        });
    }
}
</script>