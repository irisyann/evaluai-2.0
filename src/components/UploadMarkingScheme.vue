<template>
    <v-card max-width="700px" width="100%" class="mx-auto" flat style="background: transparent;">
        <v-card-title class="text-center">Grade Papers</v-card-title>

        <v-card-text class="py-5">
            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">Upload marking scheme</p>
                <p class="font-italic ml-5">Course structure, class notes, etc</p>
                <v-file-input v-model="markingSchemefileSources" accept=".pdf" chips multiple color="primary" class="my-3 ml-5" style="width: 95%">
                    <v-icon left>mdi-upload</v-icon>
                    Upload files</v-file-input >

                <v-textarea v-model="markingSchemeTextSource" variant="outlined" class="ml-5 my-3" placeholder="Or, input the marking scheme as text."></v-textarea>
            </div> 

            <v-btn :loading="loadingGenerate" @click="getInputs" block class="py-8"  color="secondary">Upload
                <v-icon end>mdi-upload</v-icon>
            </v-btn>
        </v-card-text>
    </v-card>
</template>
    
<script>
    import instance from '@/api/axios.js';
    
    export default {
        name: 'GenerateQuestions',
        data() {
            return {
                markingSchemefileSources: null,
                markingSchemeTextSource: `
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
            }
        },
    
        methods: {
            async getInputs() {
                this.loadingGenerate = true

                await instance.post('/completions', {
                    "model": "gpt-3.5-turbo-1106",
                    "messages": [
                        { "role": "user", "content": this.markingSchemeTextSource },
                    ],
                    "tools": [
                        {
                            type: "function",
                            function: {
                                name: "process_marking_scheme",
                                description: "Process the marking scheme to get the required inputs.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        'total_score': {
                                            type: "number",
                                            description: "The total score of the paper by adding all the scores of each question.",
                                        },
                                        'questions': {
                                            type: "array",
                                            description: "The list of questions",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    'question_number': {
                                                        type: "number",
                                                        description: "The number sequence of the question as it appears in the marking scheme.",
                                                    },
                                                    'question': {
                                                        type: "string",
                                                        description: "The question.",
                                                    },
                                                    'question_format': {
                                                        type: "string",
                                                        description: "The format of the question.",
                                                        enum: ["Objective", "Subjective", "Essay"],
                                                    },
                                                    'answer': {
                                                        type: "string",
                                                        description: "The correct answer or suggested answer to the question based on marking scheme.",
                                                    },
                                                    'answer_breakdown': {
                                                        type: "array",
                                                        description: "The breakdown of the suggested answer into shorter chunks, only for subjective or essay questions. This is to help grade the answer according to the breakdown. For objective questions, leave this blank.",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                'sub_answer': {
                                                                    type: "string",
                                                                    description: "A section of the full answer.",
                                                                },
                                                                'sub_score': {
                                                                    type: "number",
                                                                    description: "The score for the section of the answer.",
                                                                },
                                                            }
                                                        }
                                                    },
                                                    'full_question_score': {
                                                        type: "number",
                                                        description: "The actual full score of the question.",
                                                    },
                                                }
                                            },
                                            required: ['question', 'question_format', 'answer', 'answer_breakdown', 'full_question_score']
                                        },
                                    },
                                    
                                },
                            }
                        },
                    ],
                    "tool_choice": {
                        type: "function", 
                        function: {
                            name: "process_marking_scheme"
                        }
                    }
                }).then(response => {
                    let json_response = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments)
                    console.log(json_response)

                    localStorage.setItem('evaluai_markingScheme', JSON.stringify(json_response))

                    this.$router.push('/marking-scheme')
    
                    this.loadingGenerate = false
          
                }).catch(error => {
                    console.log(error)
                })
            }
        },

        computed: {
          
        }
    }
    
</script>
    