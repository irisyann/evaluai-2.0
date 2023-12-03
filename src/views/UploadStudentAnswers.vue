<template>
    <div class="d-flex justify-center mb-10">
        <v-btn color="grey">
            <v-icon start>mdi-chevron-left</v-icon>
            Go back to marking scheme
        </v-btn>
    </div>

    <v-card max-width="700px" width="100%" class="mx-auto" flat style="background: transparent;">
        <v-card-title class="text-center">Upload student answers</v-card-title>

        <v-card-text class="py-5">
            <div class="mb-6">
                <p class="pa-2 mb-3 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">Marking tolerance</p>
                <v-slider
                    v-model="tolerance"
                    :ticks="toleranceLevels"
                    :max="2"
                    step="1"
                    show-ticks="always"
                    tick-size="3"
                    color="primary"
                    class="ml-5"
                ></v-slider>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">Upload student answer papers</p>
                <v-file-input v-model="answerPapersfileSources" accept=".pdf" chips multiple color="primary" class="my-3 ml-5" style="width: 95%">
                    <v-icon left>mdi-upload</v-icon>
                    Upload files</v-file-input >

                <v-textarea v-model="answerPapersTextSource" variant="outlined" class="ml-5 my-3" placeholder="Or, input the answer as text."></v-textarea>
            </div> 

            <v-btn :loading="loadingGenerate" @click="getInputs" block class="py-8" color="secondary">Grade Papers</v-btn>
        </v-card-text>
    </v-card>
</template>
    
<script>
    import instance from '@/api/axios.js';
    
    export default {
        name: 'GenerateQuestions',
        data() {
            return {
                markingScheme: [],
                totalScore: 0,

                tolerance: 1,
                answerPapersfileSources: null,
                answerPapersTextSource: `
Student name: Brendan

Which process is responsible for the formation of gametes in humans? (1 mark)
A) Mitosis
B) Meiosis
C) Binary fission
D) Budding
Answer: B) Meiosis

2) What is the primary function of mitochondria in a cell? (1 mark)
A) Synthesizing proteins
B) Producing energy (ATP)
C) Storing genetic information
D) Modifying and packaging proteins
Answer: A) Synthesizing proteins

3) Explain the process of photosynthesis and its significance in the plant kingdom. (4 marks)
Suggested Answer: Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. Chlorophyll in plant cells absorbs light energy, which is used to convert carbon dioxide and water into glucose, releasing oxygen as a byproduct. 

4) Describe the mechanisms of genetic inheritance and the impact of genetic variations on species survival. (6 marks)
Suggested Answer: I don't know

Student name: Dharshaan

Which process is responsible for the formation of gametes in humans? (1 mark)
A) Mitosis
B) Meiosis
C) Binary fission
D) Budding
Answer: A

2) What is the primary function of mitochondria in a cell? (1 mark)
A) Synthesizing proteins
B) Producing energy (ATP)
C) Storing genetic information
D) Modifying and packaging proteins
Answer: B

3) Explain the process of photosynthesis and its significance in the plant kingdom. (4 marks)
Suggested Answer: Photosynthesis is eating photos

4) Describe the mechanisms of genetic inheritance and the impact of genetic variations on species survival. (6 marks)
Suggested Answer: Weeweoo

Student name: Pei Yin

Which process is responsible for the formation of gametes in humans? (1 mark)
A) Mitosis
B) Meiosis
C) Binary fission
D) Budding
Answer: B) Meiosis

2) What is the primary function of mitochondria in a cell? (1 mark)
A) Synthesizing proteins
B) Producing energy (ATP)
C) Storing genetic information
D) Modifying and packaging proteins
Answer: B) Producing energy (ATP)

3) Explain the process of photosynthesis and its significance in the plant kingdom. (4 marks)
Suggested Answer: Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. Chlorophyll in plant cells absorbs light energy, which is used to convert carbon dioxide and water into glucose, releasing oxygen as a byproduct. It's vital as it's the primary way plants produce food (glucose) and oxygen, which sustains life on Earth.

4) Describe the mechanisms of genetic inheritance and the impact of genetic variations on species survival. (6 marks)
Suggested Answer: Genetic inheritance involves the passing of traits from parents to offspring through DNA. It occurs through processes like meiosis and fertilization. Genetic variations, caused by mutations or recombination, contribute to biodiversity. These variations allow species to adapt to changing environments, aiding in survival by providing a wider range of traits that might be advantageous in different conditions. However, some variations can also lead to genetic disorders or reduced fitness in certain environments.
                `,
               
                loadingGenerate: false,
                rules: {
                    required: value => !!value || 'Required.',
                },

                toleranceLevels: {
                    0: 'Lenient',
                    1: 'Moderate',
                    2: 'Strict',
                },
            }
        },
    
        methods: {
            async getInputs() {
                this.loadingGenerate = true
    
                this.tolerance = this.toleranceLevels[this.tolerance]

                let firstResponse = null
                await instance.post('/completions', {
                    "model": "gpt-4",
                    "messages": [{"role": "user", "content": 
                    `Based on the following text, grade answers and provide feedback with the following criteria:
                    Tolerance level (0 is lenient, 1 is moderate, 2 is strict): ${this.tolerance}
                    Marking Scheme: ${this.markingScheme}
                    Answer Papers: ${this.answerPapersTextSource}
                    Identify the student's name and the questions answered by the student.
                    Provide feedback for every answer. If the answer is incorrect, provide the correct answer based on the marking scheme and give feedback on how to improve the answer.
                    Give a score for every answer based on the marking scheme and calculate based on the full score of the question. For objective questions, give 0 marks for every incorrect answer. For subjective or essay questions, breakdown the student's answer and give score based on the answer breakdown in the marking scheme.
                    `}],
                    "temperature": 0.7
                }).then(async response => {

                    firstResponse = response.data.choices[0].message.content
                    console.log(firstResponse)

                    await instance.post('/completions', {
                        "model": "gpt-3.5-turbo-1106",
                        "messages": [
                            { "role": "user", "content": firstResponse },
                        ],
                        "tools": [
                            {
                                type: "function",
                                function: {
                                    name: "grade_papers",
                                    description: "Get the graded feedback based on the body of the input text.",
                                    parameters: {
                                        type: "object",
                                        properties: {
                                            'students': {
                                                type: "array",
                                                description: "The list of students with their scores and answer feedbacks.",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        'student_name': {
                                                            type: "string",
                                                            description: "The name of the student.",
                                                        },
                                                        'score': {
                                                            type: "number",
                                                            description: "The total score obtained by the student.",
                                                        },
                                                        'questions': {
                                                            type: "array",
                                                            description: "The list of questions answered by the student..",
                                                            items: {
                                                                type: "object",
                                                                properties: {
                                                                    'question': {
                                                                        type: "string",
                                                                        description: "The question.",
                                                                    },
                                                                    'actual_answer': {
                                                                        type: "string",
                                                                        description: "The actual correct answer or suggested answer to the question based on marking scheme.",
                                                                    },
                                                                    'student_answer': {
                                                                        type: "string",
                                                                        description: "The student's answer to the question.",
                                                                    },
                                                                    'student_score': {
                                                                        type: "number",
                                                                        description: "The score obtained by the student for the question.",
                                                                    },
                                                                    'full_question_score': {
                                                                        type: "number",
                                                                        description: "The actual full score of the question.",
                                                                    },
                                                                    'feedback': {
                                                                        type: "string",
                                                                        description: "Generated feedback for the student's answer to the question based on the marking scheme.",
                                                                    },
                                                                }
                                                            }
                                                        },
                                                    },
                                                    required: ['question', 'answer', 'student_answer', 'score', 'feedback']
                                                }
                                            },
                                        }
                                    },
                                }
                            },
                        ],
                        "tool_choice": {
                            type: "function", 
                            function: {
                                name: "grade_papers"
                            }
                        }
                    }).then(response => {
                        let json_response = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments)
                        console.log(json_response)

                        localStorage.setItem('evaluai_gradedPapers', JSON.stringify(json_response))
                        localStorage.setItem('evaluai_inputs', JSON.stringify({
                            topic: this.topic,
                            tolerance: this.tolerance,
                            markingSchemefileSources: this.markingSchemefileSources,
                            answerPapersfileSources: this.answerPapersfileSources,
                            answerPapersTextSource: this.answerPapersTextSource,
                            markingSchemeTextSource: this.markingSchemeTextSource,
                        }))

                        window.dispatchEvent(new CustomEvent('evaluai_localstorage_changed', {
                            detail: {
                                generatedQuestions: localStorage.getItem('evaluai_gradedPapers'),
                                inputs: localStorage.getItem('evaluai_inputs')
                            }
                        }));
        
                        this.loadingGenerate = false

                        this.$router.push({ name: 'GradedAnswers' })
                    })
                }).catch(error => {
                    console.log(error)
                })
            }
        },

        computed: {
          
        },

        mounted() {
            this.markingScheme = JSON.parse(localStorage.getItem('evaluai_markingScheme')).questions
            this.totalScore = JSON.parse(localStorage.getItem('evaluai_markingScheme')).total_score
        }
    }
    
</script>
    