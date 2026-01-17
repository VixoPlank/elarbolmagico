import { createInertiaApp } from '@inertiajs/react'
import createServer from '@inertiajs/react/server'
import ReactDOMServer from 'react-dom/server'
import { client } from '~/client'
import { TuyauProvider } from '@adonisjs/inertia/react'

const appName = import.meta.env.VITE_APP_NAME || 'Kit de inicio de Inertia  '

createServer((page) =>
  createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
      const pages = import.meta.glob('./pages/**/*.tsx')
      return (await pages[`./pages/${name}.tsx`]()) as any
    },
    setup: ({ App, props }) => {
      return (
        <TuyauProvider client={client}>
          <App {...props} />
        </TuyauProvider>
      )
    },
  })
)
