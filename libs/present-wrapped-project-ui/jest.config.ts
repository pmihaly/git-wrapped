/* eslint-disable */
export default {
  displayName: 'present-wrapped-project-ui',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    'react-markdown': '<rootDir>/../../node_modules/react-markdown/react-markdown.min.js',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/present-wrapped-project-ui',
}
