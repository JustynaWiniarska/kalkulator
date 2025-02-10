<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'

let rocznik = ref('')
let cenaNetto = ref('')
let cenaBrutto = ref('')
let showYearDisclaimer = ref(false)

const verifyValue = () => {
  const year = parseInt(rocznik.value)
  if (year < 2020) {
    showYearDisclaimer.value = true
  } else {
    showYearDisclaimer.value = false
  }
}

let showPriceDisclaimer = computed(() => {
    return parseInt(cenaNetto.value) > 400000
})

watch(cenaNetto, (newValue) => {
  if (newValue && !isNaN(parseInt(newValue))) {
    cenaBrutto.value = calculateBrutto(parseFloat(newValue)).toFixed(2)
  }
})

watch(cenaBrutto, (newValue) => {
  if (newValue && !isNaN(parseInt(newValue))) {
    cenaNetto.value = calculateNetto(parseFloat(newValue)).toFixed(2)
  }
})

const calculateBrutto = (netto: number) => {
  return netto * (1 + 0.23)
}

const calculateNetto = (brutto: number) => {
  return brutto / (1 + 0.23)
}

</script>

<template>
  <div class="max-w-xl m-auto my-20 font-serif tracking-wide">
    <h1 class="font-bold text-2xl mb-6">Kalkulator OC/AC</h1>
    <p class="text-lg">Poniższy kalkulator służy do obliczenia rocznej składki ubezpieczenia OC/AC na podstawie wieku samochodu i jego wartości.</p>

      <!-- kalkulator -->
      <div class="my-10">
        <div class="mb-4">
            <Label for="rocznik">Rocznik</Label>
            <Input 
              id="rocznik"
              v-model="rocznik"
              type="number"
              @blur="verifyValue"
            />
          </div>
          <div v-if="showYearDisclaimer" class="mb-6 text-red-700">
            Samochodów starszych od 5 lat nie obsługujemy.
        </div>
        <!-- ceny -->
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <Label for="cena-netto">Cena netto</Label>
            <Input 
              id="cena-netto"
              v-model="cenaNetto"
              type="number" />
          </div>
          <div class="mb-4">
            <Label for="cena-brutto">Cena brutto</Label>
            <Input 
              id="cena-brutto"
              v-model="cenaBrutto"
              type="number" 
            />
          </div>
        </div>
        <div v-if="showPriceDisclaimer" class="mb-6 text-red-700">
          Dla samochodów powyżej 400000 zł netto składki nie szacujemy, ponieważ potrzebne jest dokładne wyliczenie składki u ubezpieczyciela.
        </div>
      </div>


  </div>
</template>
