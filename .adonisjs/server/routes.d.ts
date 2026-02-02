import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'register.show': { paramsTuple?: []; params?: {} }
    'register.store': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'sales.create': { paramsTuple?: []; params?: {} }
    'sales.store': { paramsTuple?: []; params?: {} }
    'sales.checkProduct': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'stock.index': { paramsTuple?: []; params?: {} }
    'stock.books': { paramsTuple?: []; params?: {} }
    'stock.products': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.adjustStock': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.index': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'topics.index': { paramsTuple?: []; params?: {} }
    'topics.store': { paramsTuple?: []; params?: {} }
    'topics.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'topics.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'publishers.index': { paramsTuple?: []; params?: {} }
    'publishers.store': { paramsTuple?: []; params?: {} }
    'publishers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'publishers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'authors.index': { paramsTuple?: []; params?: {} }
    'authors.store': { paramsTuple?: []; params?: {} }
    'authors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'authors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'profile.update': { paramsTuple?: []; params?: {} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'password.update': { paramsTuple?: []; params?: {} }
    'appearance': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'register.show': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'sales.create': { paramsTuple?: []; params?: {} }
    'sales.checkProduct': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'stock.index': { paramsTuple?: []; params?: {} }
    'stock.books': { paramsTuple?: []; params?: {} }
    'stock.products': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'brands.index': { paramsTuple?: []; params?: {} }
    'topics.index': { paramsTuple?: []; params?: {} }
    'publishers.index': { paramsTuple?: []; params?: {} }
    'authors.index': { paramsTuple?: []; params?: {} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'appearance': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'register.show': { paramsTuple?: []; params?: {} }
    'login.show': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'sales.create': { paramsTuple?: []; params?: {} }
    'sales.checkProduct': { paramsTuple?: []; params?: {} }
    'sales.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'sales.index': { paramsTuple?: []; params?: {} }
    'stock.index': { paramsTuple?: []; params?: {} }
    'stock.books': { paramsTuple?: []; params?: {} }
    'stock.products': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'brands.index': { paramsTuple?: []; params?: {} }
    'topics.index': { paramsTuple?: []; params?: {} }
    'publishers.index': { paramsTuple?: []; params?: {} }
    'authors.index': { paramsTuple?: []; params?: {} }
    'reports.index': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'profile.edit': { paramsTuple?: []; params?: {} }
    'password.edit': { paramsTuple?: []; params?: {} }
    'appearance': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'register.store': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'sales.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.adjustStock': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'brands.store': { paramsTuple?: []; params?: {} }
    'topics.store': { paramsTuple?: []; params?: {} }
    'publishers.store': { paramsTuple?: []; params?: {} }
    'authors.store': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
  }
  PATCH: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'topics.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'publishers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'authors.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'profile.update': { paramsTuple?: []; params?: {} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'brands.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'topics.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'publishers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'authors.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'password.update': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}