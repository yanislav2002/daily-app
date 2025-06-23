import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import axios from 'axios'
import { ConfigProvider } from 'antd'


axios.defaults.baseURL = 'http://localhost:3000'

const theme = {
  token: {
    colorPrimary: '#33658a',
    colorInfo: '#33658a',
    borderRadius: 1,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
   components: {
    Menu: {
      itemBg: "rgb(51,101,138)",
      itemSelectedBg: "rgb(255,183,3)",
      itemColor: '#ffffff',
      itemHoverColor: '#ffffff',
      itemSelectedColor: '#ffffff'
    },
    Splitter: {
      splitBarDraggableSize: 30,
      splitBarSize: 1
    }
  }
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </Provider>
  )
}