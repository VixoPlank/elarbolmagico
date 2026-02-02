export const controllers = {
  Authors: () => import('#controllers/authors_controller'),
  Brands: () => import('#controllers/brands_controller'),
  Categories: () => import('#controllers/categories_controller'),
  Dashboard: () => import('#controllers/dashboard_controller'),
  NewAccount: () => import('#controllers/new_account_controller'),
  Products: () => import('#controllers/products_controller'),
  Publishers: () => import('#controllers/publishers_controller'),
  Reports: () => import('#controllers/reports_controller'),
  Sales: () => import('#controllers/sales_controller'),
  Session: () => import('#controllers/session_controller'),
  settings: {
    Passwords: () => import('#controllers/settings/passwords_controller'),
    Profiles: () => import('#controllers/settings/profiles_controller'),
  },
  Topics: () => import('#controllers/topics_controller'),
  Users: () => import('#controllers/users_controller'),
}
