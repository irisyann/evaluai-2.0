<template>
    <v-container>
        <PrintButton />
        <v-carousel hide-delimiter-background>
            <v-carousel-item
                v-for="(question, i) in generatedQuestions" :key="i"
            >
                <div class="flip-card mx-auto">
                    <div class="flip-card-inner">
                        <v-card color="accent" class="flip-card-front d-flex flex-column justify-center align-center">
                            <div class="mx-auto" style="max-width: 60%; width: 100%;">
                                <v-card-title class="text-center mb-5">Question {{ i+1 }}</v-card-title>
                                <v-card-text class="mx-auto">
                                    <v-chip variant="elevated" class="mb-5" :color="taxonomyChipColor(question.taxonomy_level)">Taxonomy level: {{ question.taxonomy_level }}</v-chip>
                                    <p class="ml-3 py-2 font-weight-bold">{{ question.question }}</p>
                                    <div class="ml-3" v-if="question.question_format == 'Objective'">
                                        <div v-for="(option, i) in question.answer_options" :key="i">{{ option }}</div>
                                    </div>
                                    <v-chip variant="elevated" class="mt-5 mr-5" :color="questionFormatChipColor(question.question_format)">Question format: {{ question.question_format }}</v-chip>
                                </v-card-text>
                            </div>
                        </v-card>
                        <v-card color="accent" class="pt-16 flip-card-back me-auto">
                            <div class="mx-auto" style="max-width: 60%; width: 100%;">
                                <v-card-title class="text-center mb-5">Answer</v-card-title>
                                <v-card-text class="text-center"> 
                                    <p class="py-2 font-weight-bold" v-if="question.question_format == 'Objective'">{{ question.answer }}</p>
                                    <p class="py-2 mx-auto text-justify" v-if="question.question_format !== 'Objective'">
                                        <div class="font-italic mb-2">Suggested answers: </div>
                                        {{ question.suggested_answers }}
                                    </p>
                                </v-card-text>
                            </div>
                        </v-card>
                    </div>
                </div>
            </v-carousel-item>
        </v-carousel>
    </v-container>
</template>

<script>
import PrintButton from '@/components/PrintButton.vue'

export default {
    name: 'Cards',

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

<style scoped>
.flip-card {
    background-color: transparent;
    width: 70%;
    height: 100%;
  }
  
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }
  
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .flip-card-back {
    color: white;
    transform: rotateY(180deg);
  }
</style>