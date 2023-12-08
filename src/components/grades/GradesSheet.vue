<template>
    <v-container>
        <v-card v-for="(student, j) in generatedGrades" :key="j" color="accent" class="py-5 mx-auto mb-5">
            <v-card-text class="mx-auto d-flex">
                <v-sheet class="rounded pa-5 d-flex flex-column justify-center mr-3">
                    <div class="mb-2">
                        Name: <div class="font-weight-bold">{{ student.student_name }}</div>
                    </div>
                    <div class="mb-2">
                        Total score: <div class="font-weight-bold">{{ student.score }}/{{ totalScore }}</div>
                    </div>
                    <div class="mb-2">
                        Percentage: <div class="font-weight-bold">{{ calculateScorePercentage(student.score) }}%</div>
                    </div>
                </v-sheet>
                <v-carousel hide-delimiter-background height="100%">
                    <v-carousel-item  v-for="(question, i) in student.questions" :key="i">
                        <v-card class="pa-5 px-16">
                            <v-card-title class="text-center">Question {{ i+1 }}</v-card-title>
                            <v-card-text>
                                <p class="py-2 font-weight-bold">{{ question.question }}</p>

                                <v-sheet color="grey-lighten-2" class="rounded pa-3 mb-3">
                                    <div>
                                        Student answer
                                    </div>
                                    <div class="font-weight-bold">{{ question.student_answer }}</div>
                                </v-sheet>
                                <v-sheet color="grey-darken-1" class="rounded pa-3 font-italic mb-8">
                                    <div>
                                        Actual answer
                                    </div>
                                    <div class="font-weight-bold">{{ question.actual_answer }}</div>
                                </v-sheet>
                                <v-sheet color="secondary" class="rounded pa-3">
                                    <div class="mb-3">
                                        <span class="mr-2">
                                            Score: 
                                        </span>
                                        <span class="font-weight-bold">{{ question.student_score }} / {{ question.full_question_score }}</span>
                                    </div>
                                    <div class="py-2 font-weight-bold">{{ question.feedback }}</div>
                                </v-sheet>
                            </v-card-text>
                        </v-card>
                    </v-carousel-item>
                </v-carousel>
            </v-card-text>
        </v-card>
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
    },
    
    data() {
        return {
            scorePercentage: 0,
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

        calculateScorePercentage(studentTotalScore) {
            let percentage = (studentTotalScore / this.totalScore) * 100

            // Round to 2 decimal places
            return Math.round((percentage + Number.EPSILON) * 100) / 100
        },
    },
}
</script>
