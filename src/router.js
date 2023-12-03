import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Default.vue'),
    children: [
        {
            path: 'home',
            name: 'Home',
            component: () => import('./views/Home.vue'),
        },
        {
            path: 'generate-questions',
            name: 'GenerateQuestions',
            component: () => import('./views/GenerateQuestions.vue'),
        },
        {
            path: 'new-questions',
            name: 'NewQuestionsList',
            component: () => import('./views/NewQuestionsList.vue'),
        },
        {
            path: 'grade-papers',
            name: 'GradePapers',
            component: () => import('./views/GradePapers.vue'),
        },
        {
            path: 'marking-scheme',
            name: 'ProcessedMarkingScheme',
            component: () => import('./views/ProcessedMarkingScheme.vue'),
        },
        {
            path: 'upload-student-answers',
            name: 'UploadStudentAnswers',
            component: () => import('./views/UploadStudentAnswers.vue'),
        },
        {
            path: 'graded-answers',
            name: 'GradedAnswers',
            component: () => import('./views/GradedAnswers.vue'),
        },
    ]
  },  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.afterEach((to, from) => {
    if (to.name === from.name) return;

    // if (from.name === 'GenerateQuestions') {
    //     localStorage.removeItem('evaluai_generate_questions')
    //     localStorage.removeItem('evaluai_inputs')
    // }
})

export default router
