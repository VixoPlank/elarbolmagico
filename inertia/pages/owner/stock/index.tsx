import { Head, Link } from '@inertiajs/react'
import { BookOpen, Puzzle } from 'lucide-react'
import OwnerLayout from '@/layouts/owner/owner-layout'
import { urlFor } from '@/client'

export default function StockIndex() {
  const breadcrumbs = [{ title: 'Inicio', href: urlFor('dashboard') }, { title: 'Stock' }]

  return (
    <OwnerLayout breadcrumbs={breadcrumbs}>
      <Head title="Control de Stock" />
      <div className="flex flex-col items-center justify-center p-4 lg:pt-20">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-8 dark:text-gray-100">
          Control de Stock Interno
        </h1>

        <div className="w-full max-w-4xl">
          <div className="flex flex-col md:flex-row gap-6 p-4 min-h-[200px]">
            <Link href={urlFor('stock.books')} className="flex-1 group">
              <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-md transition-all group-hover:scale-105 group-hover:border-blue-500">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 text-center">
                  Libros
                </h3>
              </div>
            </Link>

            <Link href={urlFor('stock.products')} className="flex-1 group">
              <div className="h-full flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-700 shadow-md transition-all group-hover:scale-105 group-hover:border-emerald-500">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <Puzzle className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 text-center">
                  Otros productos
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </OwnerLayout>
  )
}
