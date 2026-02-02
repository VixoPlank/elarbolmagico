import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import { formatCurrencyCLP } from '@/lib/utils'
import { DateTime } from 'luxon'
import logo from '@/assets/logo.png'

// Register font
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
})

export const COMPANY_INFO = {
  name: 'LIBRERIA EL ÁRBOL MÁGICO',
  rut: '76.702.421-5',
  giro: 'Comercio al por menor',
  address: 'El Roble 858, local 8. Galería Don Ambrosio, Chillán',
  phone: '+56 9 8709 0290',
  email: 'elarbolmagicolibreria@gmail.com',
  logo: logo,
} as const

const styles = StyleSheet.create({
  page: {
    width: '58mm',
    padding: '3mm',
    fontFamily: 'Roboto',
    fontSize: 8,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 6,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 3,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  companyInfo: {
    fontSize: 6,
    textAlign: 'center',
    marginBottom: 1,
  },
  receiptTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 4,
    textTransform: 'uppercase',
  },
  receiptNumber: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  saleInfo: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  infoLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    width: '35%',
  },
  infoValue: {
    fontSize: 6,
    width: '65%',
    textAlign: 'right',
  },
  productsSection: {
    marginBottom: 6,
  },
  productsHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productItem: {
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCCCCC',
  },
  productName: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 6,
  },
  productPrice: {
    fontSize: 6,
    textAlign: 'right',
  },
  productSubtotal: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  totalSection: {
    marginTop: 6,
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 6,
    textAlign: 'center',
    marginBottom: 1,
  },
})

export interface SaleDetails {
  id: string
  receiptNumber: string
  createdAt: string
  seller: string
  total: number
  paymentMethod: string
  items: Array<{
    id: string
    quantity: number
    price: number
    productName: string
    subtotal: number
  }>
}

interface ReceiptPDFProps {
  sale: SaleDetails
}

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ sale }) => {
  const currentDate = new Date().toLocaleString('es-CL')

  const getPaymentLabel = (method: string) => {
    if (method === 'CASH') return 'Efectivo'
    if (method === 'CARD') return 'Tarjeta'
    return method
  }

  return (
    <Document>
      <Page size={[164, 800]} style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image src={COMPANY_INFO.logo} style={styles.logo} />
          <Text style={styles.companyName}>{COMPANY_INFO.name}</Text>
          <Text style={styles.companyInfo}>RUT: {COMPANY_INFO.rut}</Text>
          <Text style={styles.companyInfo}>{COMPANY_INFO.giro}</Text>
          <Text style={styles.companyInfo}>{COMPANY_INFO.address}</Text>
          <Text style={styles.companyInfo}>Tel: {COMPANY_INFO.phone}</Text>
          {COMPANY_INFO.email && <Text style={styles.companyInfo}>{COMPANY_INFO.email}</Text>}
        </View>

        {/* TITLE */}
        <Text style={styles.receiptTitle}>Boleta Electrónica</Text>
        <Text style={styles.receiptNumber}>N° {sale.receiptNumber}</Text>

        {/* SALE INFO */}
        <View style={styles.saleInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vendedor:</Text>
            <Text style={styles.infoValue}>{sale.seller}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {DateTime.fromISO(sale.createdAt).setLocale('es').toFormat('dd/MM/yyyy HH:mm')}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pago:</Text>
            <Text style={styles.infoValue}>{getPaymentLabel(sale.paymentMethod)}</Text>
          </View>
        </View>

        {/* PRODUCTS */}
        <View style={styles.productsSection}>
          <Text style={styles.productsHeader}>Productos ({sale.items.length})</Text>

          {sale.items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Text style={styles.productName}>{item.productName}</Text>

              <View style={styles.productDetails}>
                <Text style={styles.productQuantity}>
                  {item.quantity} x {formatCurrencyCLP(item.price)}
                </Text>
                <Text style={styles.productSubtotal}>
                  {formatCurrencyCLP(item.quantity * item.price)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* TOTAL */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL:</Text>
            <Text style={styles.totalAmount}>{formatCurrencyCLP(sale.total)}</Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>¡GRACIAS POR SU COMPRA!</Text>
          <Text style={styles.footerText}>{COMPANY_INFO.name}</Text>
          <Text style={styles.footerText}>Impreso: {currentDate}</Text>
        </View>
      </Page>
    </Document>
  )
}

export default ReceiptPDF
