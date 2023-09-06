import "./globals.css"
import React from "react"
import Head from "next/head"
import { Inter } from "next/font/google"
import "./globals.css"
import styles from "./page.module.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossOrigin=""
        />
      </Head>
      <body className={inter.className}>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
