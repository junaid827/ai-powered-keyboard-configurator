export const COMPATIBILITY_RULES = [
  {
    id: 'keycap-case-layout',
    description: 'Keycaps must be compatible with the case layout',
    check: (config) => {
      if (!config.case || !config.keycaps) return { valid: true }
      const caseLayout = config.case.layout
      const keycapLayouts = config.keycaps.compatibleLayouts || []
      const valid = keycapLayouts.includes(caseLayout) || keycapLayouts.includes('universal')
      return {
        valid,
        error: valid ? null : `${config.keycaps.name} doesn't cover the ${caseLayout} layout`,
        affectedParts: ['keycaps', 'case'],
      }
    },
  },
  {
    id: 'topre-pcb-compat',
    description: 'Topre switches require a dedicated PCB',
    check: (config) => {
      if (!config.switches || !config.pcb) return { valid: true }
      const isTopre = config.switches.type === 'electrocapacitive'
      const hasStandardPcb = config.pcb.id !== 'pcb-topre'
      if (isTopre && hasStandardPcb) {
        return {
          valid: false,
          error: 'Topre switches require a Topre-compatible PCB (electrocapacitive)',
          warning: true,
          affectedParts: ['switches', 'pcb'],
        }
      }
      return { valid: true }
    },
  },
  {
    id: 'clicky-polycarbonate-case',
    description: 'Clicky switches in polycarbonate case are very loud',
    check: (config) => {
      if (!config.switches || !config.case) return { valid: true }
      const isClicky = config.switches.type === 'clicky'
      const isPoly = config.case.material === 'polycarbonate'
      if (isClicky && isPoly) {
        return {
          valid: true,
          warning: 'Clicky switches in a polycarbonate case will be very loud. Consider this for office use.',
          affectedParts: ['switches', 'case'],
        }
      }
      return { valid: true }
    },
  },
  {
    id: 'plate-pcb-hotswap-alignment',
    description: 'Hotswap PCB works best with compatible plate',
    check: (config) => {
      if (!config.pcb || !config.plate) return { valid: true }
      return { valid: true }
    },
  },
]

export function checkFullCompatibility(config) {
  const results = COMPATIBILITY_RULES.map(rule => rule.check(config))
  const errors = results.filter(r => !r.valid && !r.warning)
  const warnings = results.filter(r => r.warning && typeof r.warning === 'string')
  return {
    isCompatible: errors.length === 0,
    errors,
    warnings,
    results,
  }
}

export function getCompatibilityForPair(config, category1, category2) {
  return COMPATIBILITY_RULES
    .map(rule => rule.check(config))
    .filter(r => r.affectedParts?.includes(category1) && r.affectedParts?.includes(category2))
}
