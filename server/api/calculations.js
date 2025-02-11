export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const {netValue, year, isGPSchecked} = body
  const currentYear = new Date().getFullYear()

  const obliczWspolczynnik = (netVal, year) => {
    const newCar = year === currentYear || year === currentYear - 1
  
    let rate
    if (netVal < 40000) rate = 8
    if (netVal >= 40000 && netVal < 100000) rate = 5
    if (netVal >= 100000 && netVal < 200000) rate = 4
    if (netVal >= 200000 && netVal <= 400000) rate = 2
  
    if (rate !== undefined && !newCar) rate += 1
    return rate ?? null
  }

  const wspolczynnink = obliczWspolczynnik(netValue, year)
  let result = (wspolczynnink/100) * netValue
  if (!isGPSchecked) {
    result *= 1.11
  }


  return { result }
})