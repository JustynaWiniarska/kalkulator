<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'
import Switch from '@/components/ui/Switch.vue'
import Button from '@/components/ui/Button.vue'

let rocznik = ref(0)
let cenaNetto = ref(0)
let cenaBrutto = ref(0)
let showYearDisclaimer = ref(false)
let isGPSchecked = ref(true)
let skladkaOC = ref(0)
let showResult = ref(false)

const currentYear = new Date().getFullYear()

const verifyYear = () => {
  const carYear = rocznik.value
  const limitYear = currentYear - 5
  if (carYear < limitYear) {
    showYearDisclaimer.value = true
  } else {
    showYearDisclaimer.value = false
  }
}

let showPriceDisclaimer = computed(() => {
    return cenaNetto.value > 400000
})

watch(cenaNetto, (newVal) => {
  if (newVal) {
    cenaBrutto.value = calculateBrutto(newVal)
  }
})

watch(cenaBrutto, (newValue) => {
  if (newValue) {
    cenaNetto.value = calculateNetto(newValue)
  }
})

const calculateBrutto = (netto: number) => {
  return netto * (1 + 0.23)
}

const calculateNetto = (brutto: number) => {
  return brutto / (1 + 0.23)
}

const obliczWspolczynnik = (netVal: number, year: number) => {
  const newCar: boolean  = year === currentYear || year === currentYear - 1

  let rate: number | undefined
  if (netVal < 40000) rate = 8
  if (netVal < 100000) rate = 5
  if (netVal < 200000) rate = 4
  if (netVal <= 400000) rate = 2

  if (rate !== undefined && !newCar) rate += 1
  return rate ?? null
}

const calculateInsurance = (netValue: number, year: number) => {
  netValue = cenaNetto.value
  year = rocznik.value
  const wspolczynnink = obliczWspolczynnik(netValue, year)
  if (wspolczynnink !== null) {
    skladkaOC.value = (wspolczynnink/100) * netValue
    
  }
  if (skladkaOC.value !== 0) {
    showResult.value = true
  }
}
</script>

<template>
  <div class="max-w-xl m-auto my-20 font-serif tracking-wide p-8">
    <h1 class="font-bold text-2xl mb-6">Kalkulator OC/AC</h1>
    <p class="text-lg">Poniższy kalkulator służy do obliczenia rocznej składki ubezpieczenia OC/AC na podstawie wieku samochodu i jego wartości.</p>
      <div class="mt-10 mb-6">
        <div class="mb-4">
            <Label for="rocznik">Rocznik</Label>
            <Input 
              id="rocznik"
              v-model="rocznik"
              type="number"
              min="1950"
              max="2025"
              @blur="verifyYear"
            />
          </div>
          <div v-if="showYearDisclaimer" class="mb-6 text-red-700">
            Samochodów starszych niż 5 lat nie obsługujemy.
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <Label for="cena-netto">Cena netto</Label>
            <Input 
              id="cena-netto"
              v-model="cenaNetto"
              type="number"
            />
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
        <div class="flex items-center space-x-2 mt-4">
          <Switch 
            id="nadajnik-gps" 
            class="mr-2"
            v-model:checked="isGPSchecked"
          />
          <Label for="nadajnik-gps">Pakiet Drive+</Label>
        </div>
        <Button
          @click="calculateInsurance"
        >
          Oblicz składkę OC/AC
        </Button>
      </div>
      <div v-if="showResult">
        <p class="text-xl">Skladka OC/AC wynosi: <span class="font-bold">{{ skladkaOC }} zł</span>.</p>
      </div>
  </div>
</template>
