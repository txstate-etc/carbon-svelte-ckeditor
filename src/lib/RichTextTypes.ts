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
      'horizontalLine'
    ],
    shouldNotGroupWhenFull: true
  },
  htmlSupport: {},
  link: {
    options: {
      disableDropdown: true,
      disableBrowse: true
    }
  },
  ...listConfig
}

const fullConfig = {
  ...defaultConfig,
  heading: {
    options: [
      { title: 'Paragraph', model: 'paragraph', class: 'ck-heading_paragraph' },
      { title: 'Title', view: 'h2', model: 'heading2', class: 'ck-heading_heading2' },
      { title: 'Subtitle', view: 'h3', model: 'heading3', class: 'ck-heading_heading3' },
      { title: 'Subsubtitle', view: 'h4', model: 'heading4', class: 'ck-heading_heading4' },
      { title: 'Preformatted Text', view: 'pre', model: 'preformattedText', class: 'ck-heading-preformattedText' }
    ]
  },
  toolbar: {
    ...defaultConfig.toolbar,
    items: [...defaultConfig.toolbar.items, 'insertTable']
  },
  table: {
    contentToolbar: ['tableProperties', 'customTableColumn', 'customTableRow', 'mergeTableCells', 'tableCellProperties'],
    tableProperties: {
      tableHeaderColors: [
        { label: 'None', value: 'header-color-none' },
        { label: 'Charcoal', value: 'header-color-charcoal', default: true }
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
    },
    tableCellProperties: {
      disableBorder: true,
      disableBackground: true,
      disableDimensions: true
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
