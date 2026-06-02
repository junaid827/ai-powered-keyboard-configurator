// Mistral uses { type: 'function', function: { name, description, parameters } } format
export const AI_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'apply_part',
      description: 'Apply a specific part to the current keyboard configuration. Call this when the user accepts a recommendation or asks you to apply/add/change a part. This will immediately update the 3D model.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['case', 'switches', 'keycaps', 'pcb', 'plate'],
            description: 'The category of part to change',
          },
          partId: {
            type: 'string',
            description: 'The exact ID of the part from the catalog (e.g. "cherry-mx-red", "gmk-dracula")',
          },
          reason: {
            type: 'string',
            description: 'Brief reason for this selection to show the user',
          },
        },
        required: ['category', 'partId', 'reason'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'highlight_part',
      description: 'Focus the 3D camera on a specific part of the keyboard and add a highlight effect. Use when explaining or drawing attention to a specific component.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['case', 'switches', 'keycaps', 'pcb', 'plate'],
            description: 'Which part to highlight and focus on',
          },
        },
        required: ['category'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'set_exploded_view',
      description: 'Toggle the keyboard between assembled view and exploded view (where all parts separate and float apart to show the anatomy).',
      parameters: {
        type: 'object',
        properties: {
          exploded: {
            type: 'boolean',
            description: 'true = show exploded view, false = assemble the keyboard',
          },
        },
        required: ['exploded'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_compatibility',
      description: 'Analyze the current build for compatibility issues and return a detailed report. Use when user asks about compatibility.',
      parameters: {
        type: 'object',
        properties: {
          focus: {
            type: 'string',
            description: 'Optional: specific compatibility concern to focus on',
          },
        },
      },
    },
  },
]
