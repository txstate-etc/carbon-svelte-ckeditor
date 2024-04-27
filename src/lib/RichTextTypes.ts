export type ConfigType = 'min' | 'default' | 'full'

const listConfig = {
  list: {
    properties: {
      styles: false,
      startIndex: true
    }
  }
}

export const minimalConfig = {
  toolbar: {
    items: [
      'bold',
      'italic',
      'removeFormat',
      'specialCharacters',
      '|',
      'link'
    ]
  },
  htmlSupport: {}
}

export const defaultConfig = {
  toolbar: {
    items: [
      'bold',
      'italic',
      'removeFormat',
      'specialCharacters',
      'heading',
      '|',
      'link',
      'alignment',
      '|',
      'numberedList',
      'bulletedList',
      'indent',
      'outdent',
      '|',
      'horizontalLine',
      'code',
      'blockQuote'
    ],
    shouldNotGroupWhenFull: true
  },
  htmlSupport: {},
  ...listConfig
}

const fullConfig = {
  ...defaultConfig,
  toolbar: {
    ...defaultConfig.toolbar,
    items: [...defaultConfig.toolbar.items, 'insertTable']
  },
  table: {
    contentToolbar: ['tableProperties', 'customTableColumn', 'customTableRow', 'mergeTableCells', 'tableCellProperties'],
    tableProperties: {
      tableHeaderColors: [
        { label: 'None', value: 'header-color-none' },
        { label: 'Default (Gold)', value: 'header-color-gold' },
        { label: 'Maroon', value: 'header-color-maroon' },
        { label: 'Charcoal', value: 'header-color-charcoal' },
        { label: 'Deep Blue', value: 'header-color-blue' },
        { label: 'River', value: 'header-color-river' },
        { label: 'Sandstone', value: 'header-color-sandstone' },
        { label: 'Old Gold', value: 'header-color-oldgold' }
      ],
      tableWidth: [
        { label: '100%', value: 'full-width' },
        { label: 'Auto', value: 'auto-width' }
      ],
      tableHeaders: [
        { label: 'None', value: 'none' },
        { label: 'First Row', value: 'row' },
        { label: 'First Column', value: 'column' },
        { label: 'Both', value: 'both' }
      ]
    }
  }
}

export function getConfig (configType: ConfigType) {
  return configType === 'min'
    ? minimalConfig
    : configType === 'full'
      ? fullConfig
      : defaultConfig
}

export interface ColorClasses {
  label: string
  value: string
  default?: boolean
}

interface Colors {
  label: string
  color: string
}
