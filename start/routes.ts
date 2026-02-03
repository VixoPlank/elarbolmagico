/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

const DashboardController = () => import('#controllers/dashboard_controller')
const ProductsController = () => import('#controllers/products_controller')
const SalesController = () => import('#controllers/sales_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const BrandsController = () => import('#controllers/brands_controller')
const TopicsController = () => import('#controllers/topics_controller')
const PublishersController = () => import('#controllers/publishers_controller')
const AuthorsController = () => import('#controllers/authors_controller')
const ReportsController = () => import('#controllers/reports_controller')
const UsersController = () => import('#controllers/users_controller')
const ProfilesController = () => import('#controllers/settings/profiles_controller')
const PasswordsController = () => import('#controllers/settings/passwords_controller')

router
  .get('/', async ({ auth, response }) => {
    if (auth.user) {
      return response.redirect().toRoute('dashboard')
    }
    return response.redirect().toRoute('login.show')
  })
  .as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']).as('register.show')
    router.post('signup', [controllers.NewAccount, 'store']).as('register.store')

    router.get('login', [controllers.Session, 'create']).as('login.show')
    router.post('login', [controllers.Session, 'store']).as('login.store')
  })
  .use(middleware.guest())

// Authenticated routes
router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']).as('logout')

    // Dashboard - Logic based on role
    router.get('dashboard', [DashboardController, 'index']).as('dashboard')

    // Sales (Shared)
    router.get('sales/create', [SalesController, 'create']).as('sales.create')
    router.post('sales', [SalesController, 'store']).as('sales.store')
    router.get('sales/check-product', [SalesController, 'checkProduct']).as('sales.checkProduct')
    router.get('sales/:id', [SalesController, 'show']).as('sales.show')
    router.get('sales', [SalesController, 'index']).as('sales.index')

    // Owner/Admin Restricted Routes (No 'owner/' prefix in URL)
    router
      .group(() => {
        // Stock management
        router.get('stock', [ProductsController, 'index']).as('stock.index')
        router.get('stock/books', [ProductsController, 'indexBooks']).as('stock.books')
        router.get('stock/products', [ProductsController, 'indexOthers']).as('stock.products')

        router.post('products', [ProductsController, 'store']).as('products.store')
        router.patch('products/:id', [ProductsController, 'update']).as('products.update')
        router
          .post('products/:id/adjust', [ProductsController, 'adjustStock'])
          .as('products.adjustStock')
        router.delete('products/:id', [ProductsController, 'destroy']).as('products.destroy')

        // Catalogs
        router.get('categories', [CategoriesController, 'index']).as('categories.index')
        router.post('categories', [CategoriesController, 'store']).as('categories.store')
        router.patch('categories/:id', [CategoriesController, 'update']).as('categories.update')
        router.delete('categories/:id', [CategoriesController, 'destroy']).as('categories.destroy')

        router.get('brands', [BrandsController, 'index']).as('brands.index')
        router.post('brands', [BrandsController, 'store']).as('brands.store')
        router.patch('brands/:id', [BrandsController, 'update']).as('brands.update')
        router.delete('brands/:id', [BrandsController, 'destroy']).as('brands.destroy')

        router.get('topics', [TopicsController, 'index']).as('topics.index')
        router.post('topics', [TopicsController, 'store']).as('topics.store')
        router.patch('topics/:id', [TopicsController, 'update']).as('topics.update')
        router.delete('topics/:id', [TopicsController, 'destroy']).as('topics.destroy')

        router.get('publishers', [PublishersController, 'index']).as('publishers.index')
        router.post('publishers', [PublishersController, 'store']).as('publishers.store')
        router.patch('publishers/:id', [PublishersController, 'update']).as('publishers.update')
        router.delete('publishers/:id', [PublishersController, 'destroy']).as('publishers.destroy')

        router.get('authors', [AuthorsController, 'index']).as('authors.index')
        router.post('authors', [AuthorsController, 'store']).as('authors.store')
        router.patch('authors/:id', [AuthorsController, 'update']).as('authors.update')
        router.delete('authors/:id', [AuthorsController, 'destroy']).as('authors.destroy')

        // Users & Reports
        router.get('reports', [ReportsController, 'index']).as('reports.index')

        router.get('users', [UsersController, 'index']).as('users.index')
        router.post('users', [UsersController, 'store']).as('users.store')
        router.patch('users/:id', [UsersController, 'update']).as('users.update')
      })
      .use(middleware.admin())

    // Settings
    router
      .group(() => {
        router.get('/', ({ response }) => response.redirect().toRoute('profile.edit'))
        router.get('profile', [ProfilesController, 'edit']).as('profile.edit')
        router.patch('profile', [ProfilesController, 'update']).as('profile.update')

        router.get('password', [PasswordsController, 'edit']).as('password.edit')
        router.put('password', [PasswordsController, 'update']).as('password.update')

        router
          .get('appearance', async ({ inertia }) => {
            return inertia.render('settings/appearance', {})
          })
          .as('appearance')
      })
      .prefix('settings')
  })
  .use(middleware.auth())

router.any('*', async ({ response }) => {
  return response.abort('Page not found', 404)
})
