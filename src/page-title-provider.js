import Head from "next/head"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from "next/router"

const PageTitleContext = createContext()

/**
 * Checks if the given path is a base path.
 *
 * @param {string} path - The path to check.
 * @returns {boolean} True if the path is a base path, false otherwise.
 */
function isBasePath(path) { path == "/" || path == "/[locale]" }

/**
 * Provides the page title context to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @param {(title: string) => string} [props.formatTitle] - Optional function to format the title.
 * @param {string} [props.siteName=process.env.NEXT_PUBLIC_SITE_NAME] - The site name.
 * @returns {JSX.Element} The PageTitleProvider component.
 */
export function PageTitleProvider({ children, formatTitle, siteName }) {
    siteName = siteName || process.env.NEXT_PUBLIC_SITE_NAME
    const router = useRouter()
    const [pageTitle, setPageTitle] = useState(isBasePath(router.pathname) ? siteName : null)

    return (
        <PageTitleContext.Provider value={{ pageTitle, setPageTitle, formatTitle, siteName }}>
            <PageTitle />

            {children}
        </PageTitleContext.Provider>
    )
}

/**
 * @typedef {Object} PageTitleContextValue
 * @property {string} pageTitle - The current page title.
 * @property {(title: string) => void} setPageTitle - Function to set the page title.
 * @property {(title: string) => string} formatTitle - Function to format the title.
 * @property {string} siteName - The site name.
 */

/**
 * Custom hook to use the PageTitle context.
 *
 * @returns {PageTitleContextValue} The PageTitle context value.
 */
export const usePageTitle = () => {
    return useContext(PageTitleContext)
}

/**
 * Sets the page title based on the current route.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.title] - The title to set.
 * @returns {JSX.Element} The PageTitle component.
 */
export function PageTitle({ title }) {
    const router = useRouter()
    const { setPageTitle, formatTitle, siteName } = usePageTitle()

    if (title == undefined) {
        title = formatPathToTitle(router.pathname)

        if (formatTitle) {
            title = formatTitle(title)
        }
    }

    useEffect(() => {
        setPageTitle(isBasePath(router.pathname) ? siteName : title)
    }, [title])

    return (
        <Head>
            <title>
                {isBasePath(router.pathname) ? siteName : title ? `${title} | ${siteName}` : null}
            </title>
        </Head>
    )
}

/**
 * Formats a path to a title string.
 *
 * @param {string} path - The path to format.
 * @returns {string} The formatted title.
 */
function formatPathToTitle(path) {
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