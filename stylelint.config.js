export default {
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-order'],

  rules: {
    'order/properties-order': [
      [
        'z-index',
        'content',

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: ['position', 'top', 'right', 'bottom', 'left', 'inset'],
        },

        'transform',

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: [
            'display',
            'flex',
            'flex-direction',
            'flex-wrap',
            'flex-grow',
            'align-items',
            'align-content',
            'justify-content',
            'justify-items',
            'justify-self',
            'gap',
          ],
        },

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: [
            'min-width',
            'max-width',
            'width',
            'min-height',
            'max-height',
            'height',
            'margin',
            'margin-top',
            'margin-right',
            'margin-bottom',
            'margin-left',
            'padding',
            'padding-top',
            'padding-right',
            'padding-bottom',
            'padding-left',
          ],
        },
        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: ['border', 'border-radius', 'cursor'],
        },

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: [
            'text-align',
            'text-transform',
            'text-decoration',
            'white-space',
            'font',
            'font-family',
            'font-size',
            'font-weight',
            'font-style',
            'line-height',
            'letter-spacing',
          ],
        },

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: ['color', 'background', 'background-color'],
        },

        {
          emptyLineBefore: 'always',
          noEmptyLineBetween: true,
          properties: ['transition', 'animation'],
        },
      ],
      {
        unspecified: 'bottom',
      },
    ],
  },
};
