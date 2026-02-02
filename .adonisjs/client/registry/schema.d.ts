/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractQuery, ExtractQueryForGet } from '@tuyau/core/types'
import type { InferInput } from '@vinejs/vine/types'

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
  'register.show': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>
    }
  }
  'register.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').registerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').registerValidator)>>
      response: Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>
    }
  }
  'login.show': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/session_controller').default['create']>>
    }
  }
  'login.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').loginValidator)>>
      response: Awaited<ReturnType<import('#controllers/session_controller').default['store']>>
    }
  }
  'logout': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>
    }
  }
  'sales.create': {
    methods: ["GET","HEAD"]
    pattern: '/sales/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/sales_controller').default['create']>>
    }
  }
  'sales.store': {
    methods: ["POST"]
    pattern: '/sales'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/sale').createSaleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/sale').createSaleValidator)>>
      response: Awaited<ReturnType<import('#controllers/sales_controller').default['store']>>
    }
  }
  'sales.checkProduct': {
    methods: ["GET","HEAD"]
    pattern: '/sales/check-product'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/sales_controller').default['checkProduct']>>
    }
  }
  'sales.show': {
    methods: ["GET","HEAD"]
    pattern: '/sales/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/sales_controller').default['show']>>
    }
  }
  'sales.index': {
    methods: ["GET","HEAD"]
    pattern: '/sales'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/sales_controller').default['index']>>
    }
  }
  'stock.index': {
    methods: ["GET","HEAD"]
    pattern: '/stock'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['index']>>
    }
  }
  'stock.books': {
    methods: ["GET","HEAD"]
    pattern: '/stock/books'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['indexBooks']>>
    }
  }
  'stock.products': {
    methods: ["GET","HEAD"]
    pattern: '/stock/products'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['indexOthers']>>
    }
  }
  'products.store': {
    methods: ["POST"]
    pattern: '/products'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product').createProductValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/product').createProductValidator)>>
      response: Awaited<ReturnType<import('#controllers/products_controller').default['store']>>
    }
  }
  'products.update': {
    methods: ["PATCH"]
    pattern: '/products/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product').updateProductValidator)>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<InferInput<(typeof import('#validators/product').updateProductValidator)>>
      response: Awaited<ReturnType<import('#controllers/products_controller').default['update']>>
    }
  }
  'products.adjustStock': {
    methods: ["POST"]
    pattern: '/products/:id/adjust'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/product').adjustStockValidator)>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<InferInput<(typeof import('#validators/product').adjustStockValidator)>>
      response: Awaited<ReturnType<import('#controllers/products_controller').default['adjustStock']>>
    }
  }
  'products.destroy': {
    methods: ["DELETE"]
    pattern: '/products/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/products_controller').default['destroy']>>
    }
  }
  'categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>
    }
  }
  'categories.store': {
    methods: ["POST"]
    pattern: '/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/categories_controller').default['store']>>
    }
  }
  'categories.update': {
    methods: ["PATCH"]
    pattern: '/categories/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/categories_controller').default['update']>>
    }
  }
  'categories.destroy': {
    methods: ["DELETE"]
    pattern: '/categories/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/categories_controller').default['destroy']>>
    }
  }
  'brands.index': {
    methods: ["GET","HEAD"]
    pattern: '/brands'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/brands_controller').default['index']>>
    }
  }
  'brands.store': {
    methods: ["POST"]
    pattern: '/brands'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/brands_controller').default['store']>>
    }
  }
  'brands.update': {
    methods: ["PATCH"]
    pattern: '/brands/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/brands_controller').default['update']>>
    }
  }
  'brands.destroy': {
    methods: ["DELETE"]
    pattern: '/brands/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/brands_controller').default['destroy']>>
    }
  }
  'topics.index': {
    methods: ["GET","HEAD"]
    pattern: '/topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/topics_controller').default['index']>>
    }
  }
  'topics.store': {
    methods: ["POST"]
    pattern: '/topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/topics_controller').default['store']>>
    }
  }
  'topics.update': {
    methods: ["PATCH"]
    pattern: '/topics/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/topics_controller').default['update']>>
    }
  }
  'topics.destroy': {
    methods: ["DELETE"]
    pattern: '/topics/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/topics_controller').default['destroy']>>
    }
  }
  'publishers.index': {
    methods: ["GET","HEAD"]
    pattern: '/publishers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/publishers_controller').default['index']>>
    }
  }
  'publishers.store': {
    methods: ["POST"]
    pattern: '/publishers'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/publishers_controller').default['store']>>
    }
  }
  'publishers.update': {
    methods: ["PATCH"]
    pattern: '/publishers/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/publishers_controller').default['update']>>
    }
  }
  'publishers.destroy': {
    methods: ["DELETE"]
    pattern: '/publishers/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/publishers_controller').default['destroy']>>
    }
  }
  'authors.index': {
    methods: ["GET","HEAD"]
    pattern: '/authors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/authors_controller').default['index']>>
    }
  }
  'authors.store': {
    methods: ["POST"]
    pattern: '/authors'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/authors_controller').default['store']>>
    }
  }
  'authors.update': {
    methods: ["PATCH"]
    pattern: '/authors/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/authors_controller').default['update']>>
    }
  }
  'authors.destroy': {
    methods: ["DELETE"]
    pattern: '/authors/:id'
    types: {
      body: {}
      paramsTuple: [string]
      params: { id: string }
      query: {}
      response: Awaited<ReturnType<import('#controllers/authors_controller').default['destroy']>>
    }
  }
  'reports.index': {
    methods: ["GET","HEAD"]
    pattern: '/reports'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/reports_controller').default['index']>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/users_controller').default['index']>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('@vinejs/vine').default)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('@vinejs/vine').default)>>
      response: Awaited<ReturnType<import('#controllers/users_controller').default['store']>>
    }
  }
  'users.update': {
    methods: ["PATCH"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('@vinejs/vine').default)>>
      paramsTuple: [string]
      params: { id: string }
      query: ExtractQuery<InferInput<(typeof import('@vinejs/vine').default)>>
      response: Awaited<ReturnType<import('#controllers/users_controller').default['update']>>
    }
  }
  'profile.edit': {
    methods: ["GET","HEAD"]
    pattern: '/settings/profile'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/settings/profiles_controller').default['edit']>>
    }
  }
  'profile.update': {
    methods: ["PATCH"]
    pattern: '/settings/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateProfileValidator)>>
      response: Awaited<ReturnType<import('#controllers/settings/profiles_controller').default['update']>>
    }
  }
  'password.edit': {
    methods: ["GET","HEAD"]
    pattern: '/settings/password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: Awaited<ReturnType<import('#controllers/settings/passwords_controller').default['edit']>>
    }
  }
  'password.update': {
    methods: ["PUT"]
    pattern: '/settings/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/auth').updatePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/auth').updatePasswordValidator)>>
      response: Awaited<ReturnType<import('#controllers/settings/passwords_controller').default['update']>>
    }
  }
  'appearance': {
    methods: ["GET","HEAD"]
    pattern: '/settings/appearance'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
    }
  }
}
