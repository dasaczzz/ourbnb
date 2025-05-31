module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Asegúrate de que esta ruta sea correcta
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Asegúrate de que ts-jest esté configurado para transformar archivos TypeScript
  },
};