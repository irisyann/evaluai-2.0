<template>
    <div class="d-flex justify-center mb-10">
        <v-btn color="grey" to="/marking-scheme">
            <v-icon start>mdi-chevron-left</v-icon>
            Go back to marking scheme
        </v-btn>
    </div>

    <v-card max-width="700px" width="100%" class="mx-auto" flat style="background: transparent;">
        <v-card-text class="py-5">
            <p class="pa-2 mb-10 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">
                <v-icon start>mdi-numeric-3-circle</v-icon>
                Step 3: Upload and grade student answers.</p>

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
                <v-file-input v-model="answerPapersfileSources" chips multiple color="primary" class="my-3 ml-5" style="width: 95%">
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
    import googlevisionInstance from '@/api/googlevisionInstance.js';
    import router from '@/router';
    
    export default {
        name: 'GenerateQuestions',
        data() {
            return {
                markingScheme: [],
                totalScore: 0,

                tolerance: 1,
                answerPapersfileSources: null,
                answerPapersTextSource: ``,
                extractedAnswerPapers: '',
               
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
            getBase64 (file, callback) {
                const reader = new FileReader();
                reader.addEventListener('load', () => callback(reader.result));
                reader.readAsDataURL(file);
            },

            async getInputs() {
                this.loadingGenerate = true
                let tolerance = this.toleranceLevels[this.tolerance]
                let extractedAnswersText = []
                let markingScheme = this.markingScheme

                this.answerPapersfileSources.forEach(async (file) => {
                    this.getBase64(file, function(base64Data){
                        googlevisionInstance.post('/images:annotate', {
                            "requests": [
                                {
                                    "image": {
                                        "content": base64Data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")
                                    },
                                    "features": [
                                        {
                                            "type": "TEXT_DETECTION"
                                        }
                                    ]
                                }
                            ]
                        }).then(async (response) => {
                            console.log(response)
                            extractedAnswersText.push(response.data.responses[0].textAnnotations[0].description)

                        }).catch((error) => {
                            console.log(error)
                        })
                    })
                })

                setTimeout(async () => {
                    console.log(extractedAnswersText)
                    let firstResponse = null
                    await instance.post('/completions', {
                        "model": "gpt-4",
                        "messages": [{"role": "user", "content": 
                        `Based on the following text, grade all students' answers and provide feedback with the following criteria:
                        Tolerance level (0 is lenient, 1 is moderate, 2 is strict): ${tolerance}
                        Marking Scheme: ${markingScheme}
                        Answer Papers: ${extractedAnswersText}
                        The answer papers are provided in an array. Each element in the array is a student's answer paper.
                        - Identify the student's name and the questions answered by the student. 
                        - Repeat back the student's own answer to the question.
                        - Repeat back the actual correct answer to the question.
                        - Provide feedback for every answer. If the answer is incorrect, provide the correct answer based on the marking scheme and give feedback on how to improve the answer.
                        - Give a score for every answer based on the marking scheme and calculate based on the full score of the question. For objective questions, give 0 marks for every incorrect answer. For subjective or essay questions, breakdown the student's answer and give score based on the answer breakdown in the marking scheme.
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
                                                                description: "The list of questions answered by the student.",
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
                                                                            description: "The student's own written answer to the question.",
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
                                                                    },
                                                                    required: ['question', 'actual_answer', 'student_answer', 'student_score', 'full_question_score', 'feedback']
                                                                }
                                                            },
                                                        },
                                                        required: ['questions', 'student_answer', 'score']
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

                            window.dispatchEvent(new CustomEvent('evaluai_localstorage_changed', {
                                detail: {
                                    generatedQuestions: localStorage.getItem('evaluai_gradedPapers'),
                                    inputs: localStorage.getItem('evaluai_inputs')
                                }
                            }));

                            router.push({ name: 'GradedAnswers' })
            
                        })
                    }).catch(error => {
                        console.log(error)
                    })
                }, 5000);
             
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
    