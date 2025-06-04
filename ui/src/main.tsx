import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import axios from 'axios'


axios.defaults.baseURL = 'http://localhost:3000'

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  )
}
