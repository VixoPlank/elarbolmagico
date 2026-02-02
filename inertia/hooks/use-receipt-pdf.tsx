import { useState, useCallback } from 'react'
import { pdf } from '@react-pdf/renderer'
import ReceiptPDF, { SaleDetails } from '@/components/common/receipt-pdf'

interface UseReceiptPDFReturn {
  isGenerating: boolean
  printPDF: (sale: SaleDetails) => Promise<void>
}

export const useReceiptPDF = (): UseReceiptPDFReturn => {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = useCallback(async (sale: SaleDetails): Promise<Blob> => {
    setIsGenerating(true)
    try {
      const blob = await pdf(<ReceiptPDF sale={sale} />).toBlob()
      return blob
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const printPDF = useCallback(
    async (sale: SaleDetails) => {
      try {
        const blob = await generatePDF(sale)
        const url = URL.createObjectURL(blob)

        // Create hidden iframe for printing
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = url

        document.body.appendChild(iframe)

        iframe.onload = () => {
          try {
            // Wait a bit to ensure PDF loads
            setTimeout(() => {
              iframe.contentWindow?.print()
            }, 1000)
          } catch (printError) {
            console.error('Error al imprimir:', printError)
            // Fallback: open in new window
            window.open(url, '_blank')
          }
        }

        // Cleanup
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
          URL.revokeObjectURL(url)
        }, 30000)
      } catch (error) {
        console.error('Error printing PDF:', error)
        throw error
      }
    },
    [generatePDF]
  )

  return {
    isGenerating,
    printPDF,
  }
}
