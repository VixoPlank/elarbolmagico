import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'dashboard': ExtractProps<(typeof import('../../inertia/pages/dashboard.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'owner/authors/index': ExtractProps<(typeof import('../../inertia/pages/owner/authors/index.tsx'))['default']>
    'owner/brands/index': ExtractProps<(typeof import('../../inertia/pages/owner/brands/index.tsx'))['default']>
    'owner/categories/index': ExtractProps<(typeof import('../../inertia/pages/owner/categories/index.tsx'))['default']>
    'owner/dashboard': ExtractProps<(typeof import('../../inertia/pages/owner/dashboard.tsx'))['default']>
    'owner/publishers/index': ExtractProps<(typeof import('../../inertia/pages/owner/publishers/index.tsx'))['default']>
    'owner/reports/index': ExtractProps<(typeof import('../../inertia/pages/owner/reports/index.tsx'))['default']>
    'owner/sales/create': ExtractProps<(typeof import('../../inertia/pages/owner/sales/create.tsx'))['default']>
    'owner/sales/history': ExtractProps<(typeof import('../../inertia/pages/owner/sales/history.tsx'))['default']>
    'owner/stock/books/page': ExtractProps<(typeof import('../../inertia/pages/owner/stock/books/page.tsx'))['default']>
    'owner/stock/index': ExtractProps<(typeof import('../../inertia/pages/owner/stock/index.tsx'))['default']>
    'owner/stock/products/page': ExtractProps<(typeof import('../../inertia/pages/owner/stock/products/page.tsx'))['default']>
    'owner/topics/index': ExtractProps<(typeof import('../../inertia/pages/owner/topics/index.tsx'))['default']>
    'owner/users/index': ExtractProps<(typeof import('../../inertia/pages/owner/users/index.tsx'))['default']>
    'sales/create': ExtractProps<(typeof import('../../inertia/pages/sales/create.tsx'))['default']>
    'settings/appearance': ExtractProps<(typeof import('../../inertia/pages/settings/appearance.tsx'))['default']>
    'settings/password': ExtractProps<(typeof import('../../inertia/pages/settings/password.tsx'))['default']>
    'settings/profile': ExtractProps<(typeof import('../../inertia/pages/settings/profile.tsx'))['default']>
  }
}
