<template>
  <div class="max-w-xl m-auto my-20 font-serif tracking-wide">
    <h1 class="font-bold text-2xl mb-6">Kalkulator OC/AC</h1>
    <p class="text-lg">Poniższy kalkulator służy do obliczenia rocznej składki ubezpieczenia OC/AC na podstawie wieku samochodu i jego wartości.</p>

      <!-- kalkulator -->
      <div class="my-10">
        <div class="mb-4">
            <Label for="rocznik">Rocznik</Label>
            <Input id="rocznik" type="text" />
          </div>
        <!-- ceny -->
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4">
            <Label for="cena-netto">Cena netto</Label>
            <Input id="cena-netto" type="text" />
          </div>
          <div class="mb-4">
            <Label for="cena-brutto">Cena brutto</Label>
            <Input id="cena-brutto" type="text" />
          </div>
        </div>
      </div>


  </div>
</template>


<script setup lang="ts">
import Label from '@/components/ui/Label.vue'
import Input from '@/components/ui/Input.vue'
</script>