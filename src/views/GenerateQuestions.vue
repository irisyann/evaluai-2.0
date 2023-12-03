<template>
    <v-card max-width="700px" width="100%" class="mx-auto" flat style="background: transparent;">
        <v-card-title class="text-center">Generate Questions</v-card-title>

        <v-card-text class="py-5">
            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">1) Education Level</p>
                <v-radio-group v-model="educationLevel">
                    <v-radio v-for="(level, i) in educationLevels" :key="i" :label="level" :value="level" color="primary" :rules="[rules.required]"></v-radio>
                </v-radio-group>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">2) Topic and Subject</p>
                <v-text-field v-model="topic" variant="outlined" class="ml-5" style="width: 95%" :rules="[rules.required]"></v-text-field>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">3) Number of questions</p>
                <v-text-field v-model="numQuestions" variant="outlined" class="ml-5" style="width: 15%;" :rules="[rules.required]"></v-text-field>
            </div>
            
            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">4) Question category</p>
                <v-btn-toggle
                    v-model="questionType"
                    group
                    color="primary"
                    class="ml-5 mb-2"
                    :rules="[rules.required]"
                >
                    <v-btn v-for="(type, i) in questionTypes" :key="i" :value="type" class="mr-4 rounded-lg">
                        {{ type }}
                    </v-btn>
                </v-btn-toggle>
            </div>
            
            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">5) Total score</p>
                <v-text-field v-model="totalScore" class="ml-5" variant="outlined" style="width: 15%;"></v-text-field>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-3 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">6) Difficulty</p>
                <v-slider
                    v-model="difficulty"
                    :ticks="difficultyLevels"
                    :max="2"
                    step="1"
                    show-ticks="always"
                    tick-size="3"
                    color="primary"
                    class="ml-5"
                ></v-slider>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">7) Taxonomy level</p>
                <div class="d-flex flex-column ml-5">
                    <div v-for="(level, i) in taxonomyLevels" :key="i">
                        <v-sheet
                            border="md"
                            class="pa-1 text-white rounded mb-2"
                            color="#141518"
                        >
                            <v-checkbox 
                                v-model="taxonomyLevel"
                                :label="level.text"
                                :value="level.value"
                                hide-details="true"
                            ></v-checkbox>
                            <div class="ml-10">
                                <v-chip v-for="(keyword, j) in level.keywords" :key="j" size="small" class="mr-1 mb-1">{{ keyword }}</v-chip>
                            </div>
                        </v-sheet>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">8) Question format</p>
                <v-btn-toggle
                    v-model="questionStyle"
                    group
                    color="primary"
                    class="ml-5 mb-2"
                    multiple
                    :rules="[rules.required]"
                >
                    <v-btn class="mr-4 rounded-lg" value="Objective">
                        Objective
                    </v-btn>
        
                    <v-btn class="mr-4 rounded-lg" value="Subjective">
                        Subjective
                    </v-btn>
        
                    <v-btn class="mr-4 rounded-lg" value="Essay">
                        Essay
                    </v-btn>
                </v-btn-toggle>
            </div>

            <div class="mb-6">
                <p class="pa-2 mb-2 font-weight-bold" style="background-color:  #48505B; border-radius: 5px;">9) Upload relevant sources</p>
                <p class="font-italic ml-5">Course structure, class notes, etc</p>
                <v-file-input v-model="fileSources" accept=".pdf" chips multiple color="primary" class="my-3 ml-5" style="width: 95%">
                    <v-icon left>mdi-upload</v-icon>
                    Upload files</v-file-input >

                <v-textarea v-model="textSource" variant="outlined" class="ml-5 my-3" placeholder="Input any relevant info to help us generate better questions."></v-textarea>
            </div> 

            <v-btn :loading="loadingGenerate" @click="getInputs" class="py-8" block color="secondary">Generate questions</v-btn>
        </v-card-text>
    </v-card>
</template>
    
<script>
    import instance from '@/api/axios.js';
    
    export default {
        name: 'GenerateQuestions',
        data() {
            return {
                educationLevel: 'Undergraduate',
                topic: 'History',
                numQuestions: 3,
                questionType: ['Exam'],
                totalScore: 100,
                difficulty: 2,
                taxonomyLevel: ['Understand', 'Apply', 'Analyse'],
                questionStyle: ['Objective', 'Subjective', 'Essay'],
                fileSources: null,
                textSource: `Course Description:
This course provides an overview of Malaysian history, focusing on the major political, social, cultural, and economic developments that have shaped the nation. Students will explore the pre-colonial, colonial, and post-independence eras, examining key events, figures, and issues that have defined Malaysia's history. The course will also discuss the diverse cultures and ethnicities that make up the Malaysian population.

Course Schedule:

Introduction to Malaysian History
Understanding the geographic and cultural diversity of Malaysia.
Overview of pre-colonial Malay states.
Early trade and cultural exchanges.

Colonial Period
The arrival of Portuguese, Dutch, and British.
Impact of colonization on Malaysian society.
Rise of nationalism and the struggle for independence.

Road to Independence
Post-World War II developments.
The role of key figures, including Tunku Abdul Rahman.
Achieving independence in 1957.

Formation of Malaysia
The formation of Malaysia in 1963.
Singapore's separation.
Confrontation with Indonesia.

Malaysia in the Modern Era
Economic development and industrialization.
Cultural diversity and social challenges.
The role of Malaysia in Southeast Asia and the global context.

Contemporary Issues
Discussing contemporary issues and challenges facing Malaysia.
Examining the role of multiculturalism and national identity.
Malaysia's path into the future.
In-class presentations and discussions.
                `,
                loadingGenerate: false,
                rules: {
                    required: value => !!value || 'Required.',
                },
    
                educationLevels: [
                    'Primary',
                    'Secondary',
                    'Pre-university/College',
                    'Undergraduate',
                    'Postgraduate',
                ],
                questionTypes: [
                    'Practice',
                    'Quiz',
                    'Exam',
                ],
                taxonomyLevels: [
                    {
                        text: 'Remember',
                        value: 'Remember',
                        keywords: ['Define', 'List', 'State', 'Duplicate', 'Memorize', 'Repeat']
                    },
                    {
                        text: 'Understand',
                        value: 'Understand',
                        keywords: ['Classify', 'Describe', 'Discuss', 'Explain', 'Identify', 'Locate', 'Recognise', 'Report', 'Select', 'Translate']
                    },
                    {
                        text: 'Apply',
                        value: 'Apply',
                        keywords: ['Execute', 'Implement', 'Solve', 'Use', 'Demonstrate', 'Interpret', 'Operate', 'Schedule', 'Sketch']
                    },
                    {
                        text: 'Analyse',
                        value: 'Analyse',
                        keywords: ['Differentiate', 'Organize', 'Relate', 'Compare', 'Contrast', 'Distinguish', 'Examine', 'Experiment', 'Question', 'Test']
                    },
                    {
                        text: 'Evaluate',
                        value: 'Evaluate',
                        keywords: ['Appraise', 'Argue', 'Defend', 'Judge', 'Select', 'Support', 'Value', 'Evaluate', 'Choose', 'Compare', 'Rate', 'Revise', 'Recommend', 'Estimate', 'Measure', 'Conclude']
                    },
                    {
                        text: 'Create',
                        value: 'Create',
                        keywords: ['Design', 'Construct', 'Develop', 'Formulate', 'Author', 'Investigate', 'Build', 'Devise', 'Produce', 'Plan', 'Invent', 'Compose', 'Generate', 'Hypothesize', 'Combine']
                    }
                ],
                difficultyLevels: {
                    0: 'Easy',
                    1: 'Medium',
                    2: 'Hard',
                },
            }
        },
    
        methods: {
            async getInputs() {
                this.loadingGenerate = true
    
                this.difficulty = this.difficultyLevels[this.difficulty]

                let firstResponse = null
                await instance.post('/completions', {
                    "model": "gpt-4",
                    "messages": [{"role": "user", "content": 
                    `Based on the following text, generate questions with the following criteria:
                    Education level: ${this.educationLevel} 
                    Topic: ${this.topic} 
                    Number of questions: ${this.numQuestions} 
                    Type of questions: ${this.questionType}
                    Total score: ${this.totalScore} points (these points should be distributed appropriately based on number of questions)
                    Taxonomy level: ${this.taxonomyLevel}
                    Questions should be generated with the taxonomy keywords: ${this.taxonomyLevelKeywords}
                    Style: ${this.questionStyle} 
                    Difficulty level: ${this.difficulty}.
                    Additional sources: ${this.fileSources} ${this.textSource}
                    If additional sources are provided, only generate academic questions. Do not generate questions outside of the topic.
                    For Objective questions, provide answer options. 
                    For Subjective questions, generate suggested answers below the question.
                    Every question should have a score. All scores should add up to the total score.
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
                                    name: "generate_questions",
                                    description: "Get a list of questions based on the body of the input text.",
                                    parameters: {
                                        type: "object",
                                        properties: {
                                            'questions': {
                                                type: "array",
                                                description: "The list of questions.",
                                                items: {
                                                    type: "object",
                                                    properties: {
                                                        'question': {
                                                            type: "string",
                                                            description: "The question.",
                                                        },
                                                        'answer': {
                                                            type: "string",
                                                            description: "The answer to the question.",
                                                        },
                                                        'answer_options': {
                                                            type: "array",
                                                            description: "The answer options to the question if question type is Objective. This should be an array of strings with the answer string included after the letter. Leave blank if question type is Subjective or Essay.",
                                                            items: {
                                                                type: "string",
                                                            }
                                                        },
                                                        'suggested_answers': {
                                                            type: "string",
                                                            description: "The suggested answers to the question if question type is Subjective or Essay. Leave blank if question type is Objective.",
                                                        },
                                                        'score': {
                                                            type: "number",
                                                            description: "The score of the question.",
                                                        },
                                                        'question_format': {
                                                            type: "string",
                                                            description: "The format of the question.",
                                                            enum: ["Objective", "Subjective", "Essay"],
                                                        },
                                                        'taxonomy_level': {
                                                            type: "string",
                                                            description: "The taxonomy level of the question.",
                                                            enum: ["Remember", "Understand", "Apply", "Analyse", "Evaluate", "Create"],
                                                        },
                                                        
                                                    },
                                                    required: ['question', 'answer', 'answer_options', 'suggested_answers', 'score', 'question_format', 'taxonomy_level']
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
                                name: "generate_questions"
                            }
                        }
                    }).then(response => {
                        let json_response = JSON.parse(response.data.choices[0].message.tool_calls[0].function.arguments)
                        console.log(json_response)

                        localStorage.setItem('evaluai_generatedQuestions', JSON.stringify(json_response))
                        localStorage.setItem('evaluai_inputs', JSON.stringify({
                            educationLevel: this.educationLevel,
                            topic: this.topic,
                            numQuestions: this.numQuestions,
                            questionType: this.questionType,
                            totalScore: this.totalScore,
                            taxonomyLevel: this.taxonomyLevel,
                            questionStyle: this.questionStyle,
                            difficulty: this.difficulty,
                            fileSources: this.fileSources,
                            textSource: this.textSource,
                        }))
        
                        this.loadingGenerate = false

                        this.$router.push('/new-questions')
                    })
                }).catch(error => {
                    console.log(error)
                })
            }
        },

        computed: {
            taxonomyLevelKeywords() {
                let keywords = []
                this.taxonomyLevel.forEach(selectedTaxonomy => {
                    keywords.push(this.taxonomyLevels.find(taxonomy => taxonomy.value === selectedTaxonomy).keywords)
                })
            }
        }
    }
    
</script>
    