import Head from "next/head"
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router"

interface PageTitleContextValue {
    pageTitle: string | undefined,
    setPageTitle: (title: string) => void,
    formatTitle?: (title: string) => string,
    siteName: string | undefined
}

const PageTitleContext = createContext<PageTitleContextValue | undefined>(undefined)

/**
 * Checks if the given path is a base path ("/" or "/[locale]")
 */
const isBasePath = (path: string) => path == "/" || path == "/[locale]"


interface PageTitleProviderProps {
    children: ReactNode
    formatTitle?: (title: string) => string
    siteName?: string
}

export function PageTitleProvider({ children, formatTitle, siteName = process.env.NEXT_PUBLIC_SITE_NAME }: PageTitleProviderProps) {
    const router = useRouter()
    const [pageTitle, setPageTitle] = useState(isBasePath(router.pathname) ? siteName : undefined)

    return (
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle, formatTitle, siteName }}>
            <PageTitle />

            {children}
        </PageTitleContext.Provider>
    )
}

export const usePageTitle = () => {
    const context = useContext(PageTitleContext)

    if (!context) {
        throw new Error("usePageTitle must be used within a PageTitleProvider")
    }

    return context
}

interface PageTitleProps {
    title?: string
}

export function PageTitle({ title }: PageTitleProps) {
    const router = useRouter()
    const { setPageTitle, formatTitle, siteName } = usePageTitle()

    if (title == undefined) {
        title = formatPathToTitle(router.pathname)

        if (formatTitle) {
            title = formatTitle(title)
        }
    }

    useEffect(() => {
        setPageTitle((isBasePath(router.pathname) ? siteName : title) || "")
    }, [title, setPageTitle, router.pathname, siteName])

    return (
        <Head>
            <title>
                {isBasePath(router.pathname) ? siteName : (title ? `${title} | ${siteName}` : null)}
            </title>
        </Head>
    )
}

/**
 * Formats a path to a title string.
 */
function formatPathToTitle(path: string) {
    const firstPart = path?.split('/') // Split the path by '/'
        .filter(Boolean) // Remove any empty strings
        .filter(segment => segment !== '[locale]') // Remove the '[locale]' segment if present
        .shift() // Take the first non-empty segment

    // Replace hyphens with spaces and capitalize each word
    return firstPart?.replace("_", "").split('-') // Split the part on hyphen
        .map(subPart => subPart.charAt(0).toUpperCase() + subPart.slice(1)) // Capitalize the first letter of each sub-part
        .join(' ') // Join the sub-parts with spaces
        || ""
}