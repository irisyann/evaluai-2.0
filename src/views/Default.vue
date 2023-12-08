<template>
    <v-card style="background-color: transparent;">
        <v-layout style="min-height: 100vh !important;">
            <v-navigation-drawer color="primary" style="position: fixed;">
                <v-list>
                    <v-list-item
                        prepend-avatar="../assets/logo.webp"
                        style="height: 100px"
                    >
                        <v-list-item-title class="text-h5 font-weight-bold">
                            Evalu.AI
                        </v-list-item-title>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list nav>
                    <v-list-item v-for="(nav, i) in navList" :key="i" :prepend-icon="nav.icon" :to="nav.value" style="height: 60px">
                        <v-list-item-title class="text-body-1">
                            {{ nav.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-main class="my-10">
                <router-view />
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>

export default {
    name: 'Home',

    data: () => ({
        navList: [
            {
                icon: 'mdi-file-plus',
                title: 'Generate Questions',
                value: '/generate-questions'
            },
            {
                icon: 'mdi-note-text-outline',
                title: 'Marking Scheme',
                value: '/grade-papers'
            },
            {
                icon: 'mdi-file-check',
                title: 'Grade Papers',
                value: '/upload-student-answers'
            },
            {
                icon: 'mdi-chart-bar',
                title: 'Analysis',
                value: '/graded-answers'
            },
        ]
    }),

    computed: {
 
    },
}
</script>