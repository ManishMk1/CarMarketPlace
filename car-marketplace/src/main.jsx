import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import store from './store.js'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import Home from "./Home.jsx"
const router = createBrowserRouter([
  {
    path:'/',
    element:<Home />
  }
])
createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
)
