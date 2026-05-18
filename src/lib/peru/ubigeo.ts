import ubigeoData from './ubigeo.json'

type ProvinceNode = {
  zoneCode: string
  districts: string[]
}

type UbigeoData = Record<string, Record<string, ProvinceNode>>

const ubigeo = ubigeoData as UbigeoData

export const CITY_SEPARATOR = ' - '

function normalizeZoneCode(zoneCode: string): string {
  const idx = zoneCode.indexOf('-')
  return idx === -1 ? zoneCode : zoneCode.slice(idx + 1)
}

export function getDepartments(): string[] {
  return Object.keys(ubigeo)
}

export function getProvinces(department: string): string[] {
  const node = ubigeo[department]
  return node ? Object.keys(node) : []
}

export function getDistricts(department: string, province: string): string[] {
  return ubigeo[department]?.[province]?.districts ?? []
}

export function getZoneCode(
  department: string,
  province: string,
): string | undefined {
  return ubigeo[department]?.[province]?.zoneCode
}

export function buildCity(province: string, district: string): string {
  return `${province}${CITY_SEPARATOR}${district}`
}

export type UbigeoSelection = {
  department: string
  province: string
  district: string
}

export function parseAddressToUbigeo(
  zoneCode?: string | null,
  city?: string | null,
): UbigeoSelection {
  const empty: UbigeoSelection = { department: '', province: '', district: '' }
  if (!zoneCode) return empty

  const code = normalizeZoneCode(zoneCode)
  let department = ''
  for (const [name, provinces] of Object.entries(ubigeo)) {
    for (const node of Object.values(provinces)) {
      if (node.zoneCode === code) {
        department = name
        break
      }
    }
    if (department) break
  }
  if (!department) return empty

  if (!city) return { department, province: '', district: '' }

  const idx = city.indexOf(CITY_SEPARATOR)
  if (idx === -1) return { department, province: '', district: '' }

  const province = city.slice(0, idx).trim()
  const district = city.slice(idx + CITY_SEPARATOR.length).trim()

  const districts = getDistricts(department, province)
  if (!districts.includes(district)) {
    return { department, province: '', district: '' }
  }

  return { department, province, district }
}
