/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'register.show': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['register.show']['types'],
  },
  'register.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['register.store']['types'],
  },
  'login.show': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.show']['types'],
  },
  'login.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['login.store']['types'],
  },
  'logout': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['logout']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'sales.create': {
    methods: ["GET","HEAD"],
    pattern: '/sales/create',
    tokens: [{"old":"/sales/create","type":0,"val":"sales","end":""},{"old":"/sales/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['sales.create']['types'],
  },
  'sales.store': {
    methods: ["POST"],
    pattern: '/sales',
    tokens: [{"old":"/sales","type":0,"val":"sales","end":""}],
    types: placeholder as Registry['sales.store']['types'],
  },
  'sales.checkProduct': {
    methods: ["GET","HEAD"],
    pattern: '/sales/check-product',
    tokens: [{"old":"/sales/check-product","type":0,"val":"sales","end":""},{"old":"/sales/check-product","type":0,"val":"check-product","end":""}],
    types: placeholder as Registry['sales.checkProduct']['types'],
  },
  'sales.show': {
    methods: ["GET","HEAD"],
    pattern: '/sales/:id',
    tokens: [{"old":"/sales/:id","type":0,"val":"sales","end":""},{"old":"/sales/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['sales.show']['types'],
  },
  'sales.index': {
    methods: ["GET","HEAD"],
    pattern: '/sales',
    tokens: [{"old":"/sales","type":0,"val":"sales","end":""}],
    types: placeholder as Registry['sales.index']['types'],
  },
  'stock.index': {
    methods: ["GET","HEAD"],
    pattern: '/stock',
    tokens: [{"old":"/stock","type":0,"val":"stock","end":""}],
    types: placeholder as Registry['stock.index']['types'],
  },
  'stock.books': {
    methods: ["GET","HEAD"],
    pattern: '/stock/books',
    tokens: [{"old":"/stock/books","type":0,"val":"stock","end":""},{"old":"/stock/books","type":0,"val":"books","end":""}],
    types: placeholder as Registry['stock.books']['types'],
  },
  'stock.products': {
    methods: ["GET","HEAD"],
    pattern: '/stock/products',
    tokens: [{"old":"/stock/products","type":0,"val":"stock","end":""},{"old":"/stock/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['stock.products']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/products',
    tokens: [{"old":"/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.update': {
    methods: ["PATCH"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.adjustStock': {
    methods: ["POST"],
    pattern: '/products/:id/adjust',
    tokens: [{"old":"/products/:id/adjust","type":0,"val":"products","end":""},{"old":"/products/:id/adjust","type":1,"val":"id","end":""},{"old":"/products/:id/adjust","type":0,"val":"adjust","end":""}],
    types: placeholder as Registry['products.adjustStock']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/products/:id',
    tokens: [{"old":"/products/:id","type":0,"val":"products","end":""},{"old":"/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.update': {
    methods: ["PATCH"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.destroy': {
    methods: ["DELETE"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.destroy']['types'],
  },
  'brands.index': {
    methods: ["GET","HEAD"],
    pattern: '/brands',
    tokens: [{"old":"/brands","type":0,"val":"brands","end":""}],
    types: placeholder as Registry['brands.index']['types'],
  },
  'brands.store': {
    methods: ["POST"],
    pattern: '/brands',
    tokens: [{"old":"/brands","type":0,"val":"brands","end":""}],
    types: placeholder as Registry['brands.store']['types'],
  },
  'brands.update': {
    methods: ["PATCH"],
    pattern: '/brands/:id',
    tokens: [{"old":"/brands/:id","type":0,"val":"brands","end":""},{"old":"/brands/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['brands.update']['types'],
  },
  'brands.destroy': {
    methods: ["DELETE"],
    pattern: '/brands/:id',
    tokens: [{"old":"/brands/:id","type":0,"val":"brands","end":""},{"old":"/brands/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['brands.destroy']['types'],
  },
  'topics.index': {
    methods: ["GET","HEAD"],
    pattern: '/topics',
    tokens: [{"old":"/topics","type":0,"val":"topics","end":""}],
    types: placeholder as Registry['topics.index']['types'],
  },
  'topics.store': {
    methods: ["POST"],
    pattern: '/topics',
    tokens: [{"old":"/topics","type":0,"val":"topics","end":""}],
    types: placeholder as Registry['topics.store']['types'],
  },
  'topics.update': {
    methods: ["PATCH"],
    pattern: '/topics/:id',
    tokens: [{"old":"/topics/:id","type":0,"val":"topics","end":""},{"old":"/topics/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['topics.update']['types'],
  },
  'topics.destroy': {
    methods: ["DELETE"],
    pattern: '/topics/:id',
    tokens: [{"old":"/topics/:id","type":0,"val":"topics","end":""},{"old":"/topics/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['topics.destroy']['types'],
  },
  'publishers.index': {
    methods: ["GET","HEAD"],
    pattern: '/publishers',
    tokens: [{"old":"/publishers","type":0,"val":"publishers","end":""}],
    types: placeholder as Registry['publishers.index']['types'],
  },
  'publishers.store': {
    methods: ["POST"],
    pattern: '/publishers',
    tokens: [{"old":"/publishers","type":0,"val":"publishers","end":""}],
    types: placeholder as Registry['publishers.store']['types'],
  },
  'publishers.update': {
    methods: ["PATCH"],
    pattern: '/publishers/:id',
    tokens: [{"old":"/publishers/:id","type":0,"val":"publishers","end":""},{"old":"/publishers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['publishers.update']['types'],
  },
  'publishers.destroy': {
    methods: ["DELETE"],
    pattern: '/publishers/:id',
    tokens: [{"old":"/publishers/:id","type":0,"val":"publishers","end":""},{"old":"/publishers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['publishers.destroy']['types'],
  },
  'authors.index': {
    methods: ["GET","HEAD"],
    pattern: '/authors',
    tokens: [{"old":"/authors","type":0,"val":"authors","end":""}],
    types: placeholder as Registry['authors.index']['types'],
  },
  'authors.store': {
    methods: ["POST"],
    pattern: '/authors',
    tokens: [{"old":"/authors","type":0,"val":"authors","end":""}],
    types: placeholder as Registry['authors.store']['types'],
  },
  'authors.update': {
    methods: ["PATCH"],
    pattern: '/authors/:id',
    tokens: [{"old":"/authors/:id","type":0,"val":"authors","end":""},{"old":"/authors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['authors.update']['types'],
  },
  'authors.destroy': {
    methods: ["DELETE"],
    pattern: '/authors/:id',
    tokens: [{"old":"/authors/:id","type":0,"val":"authors","end":""},{"old":"/authors/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['authors.destroy']['types'],
  },
  'reports.index': {
    methods: ["GET","HEAD"],
    pattern: '/reports',
    tokens: [{"old":"/reports","type":0,"val":"reports","end":""}],
    types: placeholder as Registry['reports.index']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.update': {
    methods: ["PATCH"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'profile.edit': {
    methods: ["GET","HEAD"],
    pattern: '/settings/profile',
    tokens: [{"old":"/settings/profile","type":0,"val":"settings","end":""},{"old":"/settings/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.edit']['types'],
  },
  'profile.update': {
    methods: ["PATCH"],
    pattern: '/settings/profile',
    tokens: [{"old":"/settings/profile","type":0,"val":"settings","end":""},{"old":"/settings/profile","type":0,"val":"profile","end":""}],
    types: placeholder as Registry['profile.update']['types'],
  },
  'password.edit': {
    methods: ["GET","HEAD"],
    pattern: '/settings/password',
    tokens: [{"old":"/settings/password","type":0,"val":"settings","end":""},{"old":"/settings/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['password.edit']['types'],
  },
  'password.update': {
    methods: ["PUT"],
    pattern: '/settings/password',
    tokens: [{"old":"/settings/password","type":0,"val":"settings","end":""},{"old":"/settings/password","type":0,"val":"password","end":""}],
    types: placeholder as Registry['password.update']['types'],
  },
  'appearance': {
    methods: ["GET","HEAD"],
    pattern: '/settings/appearance',
    tokens: [{"old":"/settings/appearance","type":0,"val":"settings","end":""},{"old":"/settings/appearance","type":0,"val":"appearance","end":""}],
    types: placeholder as Registry['appearance']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
