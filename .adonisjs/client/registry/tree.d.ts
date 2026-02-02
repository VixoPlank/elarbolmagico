/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  register: {
    show: typeof routes['register.show']
    store: typeof routes['register.store']
  }
  login: {
    show: typeof routes['login.show']
    store: typeof routes['login.store']
  }
  logout: typeof routes['logout']
  dashboard: typeof routes['dashboard']
  sales: {
    create: typeof routes['sales.create']
    store: typeof routes['sales.store']
    checkProduct: typeof routes['sales.checkProduct']
    show: typeof routes['sales.show']
    index: typeof routes['sales.index']
  }
  stock: {
    index: typeof routes['stock.index']
    books: typeof routes['stock.books']
    products: typeof routes['stock.products']
  }
  products: {
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    adjustStock: typeof routes['products.adjustStock']
    destroy: typeof routes['products.destroy']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
  brands: {
    index: typeof routes['brands.index']
    store: typeof routes['brands.store']
    update: typeof routes['brands.update']
    destroy: typeof routes['brands.destroy']
  }
  topics: {
    index: typeof routes['topics.index']
    store: typeof routes['topics.store']
    update: typeof routes['topics.update']
    destroy: typeof routes['topics.destroy']
  }
  publishers: {
    index: typeof routes['publishers.index']
    store: typeof routes['publishers.store']
    update: typeof routes['publishers.update']
    destroy: typeof routes['publishers.destroy']
  }
  authors: {
    index: typeof routes['authors.index']
    store: typeof routes['authors.store']
    update: typeof routes['authors.update']
    destroy: typeof routes['authors.destroy']
  }
  reports: {
    index: typeof routes['reports.index']
  }
  users: {
    index: typeof routes['users.index']
    store: typeof routes['users.store']
    update: typeof routes['users.update']
  }
  profile: {
    edit: typeof routes['profile.edit']
    update: typeof routes['profile.update']
  }
  password: {
    edit: typeof routes['password.edit']
    update: typeof routes['password.update']
  }
  appearance: typeof routes['appearance']
}
