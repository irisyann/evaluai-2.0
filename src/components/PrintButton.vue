<template>
    <v-btn @click="exportToPDF" color="primary" flat class="float-end mb-5">
        <v-icon start>mdi-printer</v-icon>
        <span>Print</span>
    </v-btn>
</template>

<script>
import html2pdf from "html2pdf.js";

export default {
    name: 'PrintButton',

    props: {
        elementName: {
            type: String,
        },
    },

    methods: {
		exportToPDF() {
			html2pdf(document.getElementById(this.elementName));
		},
    },
}
</script>