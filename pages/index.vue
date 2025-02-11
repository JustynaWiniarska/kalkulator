<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'
import Switch from '@/components/ui/Switch.vue'
import Button from '@/components/ui/Button.vue'

let rocznik = ref(0)
let cenaNetto = ref(0)
let cenaBrutto = ref(0)
let showInputDisclaimer = ref(false)
let showYearDisclaimer = ref(false)
let isGPSchecked = ref(true)
let skladkaOC = ref(0)
let showResult = ref(false)
let rata = ref(null)
let wysokoscRaty = ref(0)
let showDividedAnount = ref(false)

const currentYear = new Date().getFullYear()
const limitYear = currentYear - 5

const verifyYear = () => {
  showInputDisclaimer.value = false
  showYearDisclaimer.value = false
  if (!rocznik.value || rocznik.value > currentYear || rocznik.value < 1900) {
    showInputDisclaimer.value = true
    return
  }
  if (rocznik.value < limitYear) {
    showYearDisclaimer.value = true
  }
}

const showPriceDisclaimer = computed(() => cenaNetto.value !== null && cenaNetto.value > 400000)

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
  const result = netto * (1 + 0.23)
  return Number(result.toFixed())
}

const calculateNetto = (brutto: number) => {
  const result =  brutto / (1 + 0.23)
  return Number(result.toFixed())
}

const calculateInsurance = async () => {
  if (!rocznik.value || !cenaNetto.value || rocznik.value < limitYear) return

  try {
    const response = await $fetch<{ result: number }>('api/calculations', {
    method: 'POST',
    body: {
      netValue: cenaNetto.value,
      year: rocznik.value,
      isGPSchecked: isGPSchecked.value
    }
  })

  skladkaOC.value = Number(response.result.toFixed())
  showResult.value = true
  showDividedAnount.value = false
  rata.value = null
  }
  catch (e) {
    console.error(e)
  }
}

const calculateDividedPayment = () => {
  const payment = skladkaOC.value + 200
  wysokoscRaty.value = 0

  if (rata.value === 'cztery-raty') {
    const result = (payment * 1.04) / 4
    wysokoscRaty.value = Number(result.toFixed())
  }
  if (rata.value === 'dwie-raty') {
    const result = (payment * 1.02) / 2
    console.log('result', result)
    wysokoscRaty.value = Number(result.toFixed())
  }
  showDividedAnount.value = true
}
</script>

<template>
  <div class="max-w-xl m-auto my-6 font-serif tracking-wide p-8">
    <h1 class="font-bold text-2xl mb-6">Kalkulator OC/AC</h1>
    <p class="text-lg">Poniższy kalkulator służy do obliczenia rocznej składki ubezpieczenia OC/AC na podstawie wieku samochodu i jego wartości.</p>
      <div class="mt-10 mb-6">
        <div class="mb-4">
          <Label for="rocznik">Rocznik</Label>
          <Input 
            id="rocznik"
            v-model="rocznik"
            type="number"
            @blur="verifyYear"
          />
        </div>  
        <div class="mb-6">
          <p class="text-red-700" v-if="showInputDisclaimer">Proszę wpisać poprawny rocznik.</p>
          <p class="text-red-700" v-if="showYearDisclaimer">Samochodów starszych niż 5 lat nie obsługujemy.</p>
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
        <p class="text-xl">Roczna skladka OC/AC wynosi: <span class="font-bold">{{ skladkaOC }} zł</span>.</p>
        <div class="mt-6 mb-4">
          <p class="text-lg">Czy chcesz rozłożyć składkę na raty?</p>
          <p class="text-md">* Jeśli tak, to zaznacz ilość rat poniżej.</p>
        </div>
        <form>
          <div class="flex items-center space-x-4">
            <label>
              <input type="radio" name="option" value="dwie-raty" v-model="rata" @change="calculateDividedPayment" />
              2 Raty
            </label>
            <label>
              <input type="radio" name="option" value="cztery-raty" v-model="rata" @change="calculateDividedPayment" />
              4 Raty
            </label>
          </div>
        </form>
        <p 
          class="text-xl mt-6"
          v-if="showDividedAnount"
        >Przy rozłożeniu składki na raty, jedna rata wynosić będzie <span class="font-bold">{{ wysokoscRaty }} zł</span>.</p>
      </div>
  </div>
</template>
