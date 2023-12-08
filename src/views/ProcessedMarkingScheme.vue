<template>
    <SuccessModal 
        title="Marking scheme processed!"
        type="success"
        icon="check-circle"
        closeButtonText="OK"
    />

    <v-card width="90%" class="mx-auto" flat style="background: transparent;">
        <v-card-text class="py-5">
            <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">
                <v-icon start>mdi-numeric-2-circle</v-icon>
                Step 2: Verify the processed marking scheme below and edit if necessary.</p>

            <v-data-table :headers="headers" :items="markingScheme" class="mb-5">
                <template v-slot:item.question_format="props" >
                    <v-chip variant="elevated" :color="questionFormatChipColor(props.item.question_format)">{{ props.item.question_format }}</v-chip>
                </template>

                <template v-slot:item.answer_breakdown="props" >
                    <v-card flat color="grey" class="rounded my-2" v-if="props.item.answer_breakdown">
                        <v-card-text>
                            <v-table style="background-color: transparent;">
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            Answer
                                        </th>
                                        <th class="text-left">
                                            Score
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr
                                    v-for="(item, i) in props.item.answer_breakdown"
                                    :key="i"
                                >
                                    <td>{{ item.sub_answer }}</td>
                                    <td>{{ item.sub_score }}</td>
                                </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>
                </template>

                <template v-slot:bottom>
                </template>
            </v-data-table>

            <v-card flat color="accent" class="text-black mb-10">
                <v-card-text>
                    Total score: <span class="font-weight-bold">{{ this.totalScore }}</span>
                </v-card-text>
            </v-card>


            <v-btn block class="py-8" color="secondary" to="/upload-student-answers">
                Next
                <v-icon end>mdi-chevron-right</v-icon>
            </v-btn>
        </v-card-text>
    </v-card>
</template>
    
<script>
import SuccessModal from '@/components/global/SuccessModal.vue';

    export default {
        name: 'ProcessedMarkingScheme',
    
        components: {
            SuccessModal
        },
     
        data() {
            return {
                markingScheme: [],
                totalScore: 0,

                headers: [
                    { title: '#', value: 'question_number', sortable: true },
                    { title: 'Question', value: 'question', sortable: true },
                    { title: 'Format', value: 'question_format', sortable: true },
                    { title: 'Answer', value: 'answer', sortable: true },
                    { title: 'Answer breakdown', value: 'answer_breakdown', sortable: false },
                    { title: 'Score', value: 'full_question_score', sortable: true },
                ],
                   
                answerBreakdownHeaders: [
                    { title: 'Answer', value: 'answer', sortable: true },
                    { title: 'Score', value: 'score', sortable: true },
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
        },
    
        mounted() {
            this.markingScheme = JSON.parse(localStorage.getItem('evaluai_markingScheme')).questions
            this.totalScore = JSON.parse(localStorage.getItem('evaluai_markingScheme')).total_score
        }
    }
    </script>
    