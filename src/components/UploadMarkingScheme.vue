<template>
    <v-card max-width="700px" width="100%" class="mx-auto" flat style="background: transparent;">
        <v-card-title class="text-center">Grade Papers</v-card-title>

        <v-card-text class="py-5">
            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">
                    <v-icon start>mdi-numeric-1-circle</v-icon>
                    Step 1: Upload marking scheme</p>
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
1. Question (5 marks):
Discuss the similarities and differences between the status of women in traditional
Malay society and their roles after independence. Provide relevant examples.
Answer:
Similarities in the status of women in traditional Malay society and after
independence include their roles as mothers and family supporters.
Differences can be seen in various educational and employment opportunities
that are now more open to women compared to traditional times.

2. Question (5 marks): 
What are the causes of World War II, and what significant effects did countries in the
Southeast Asian region experience during and after the war?
Answer:
The main causes of World War II include political and economic tensions, as
well as the hegemony of major powers. Effects in the Southeast Asian region
include the destruction of infrastructure, a shortage of economic resources,
and profound political changes such as the independence of some countries
like Indonesia and Vietnam.

3. Question (5 marks):
Assess the effectiveness of Malaysia's economic policies such as the Malaysia
Plans when evaluating the progress and constraints in the country's economic
development.
Answer:
The Malaysia Plans have brought economic progress with investments in the
industrial sector and infrastructure development. However, constraints such
as issues of economic imbalance and negative environmental effects need
attention to ensure sustainable development.

4. Question (5 marks):
To what extent have Malay arts and culture contributed to the formation of
Malaysia's identity? Provide concrete examples.
Answer:
Malay arts and culture, such as traditional dance, traditional music, and
traditional attire, have been crucial elements in shaping Malaysia's identity.
Examples include cultural diversity in food, traditional celebrations, and
architectural heritage reflecting the country's rich history. `,
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
    