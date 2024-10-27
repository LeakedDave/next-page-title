# @daveyplate/next-page-title

## Installation

```bash
npm install @daveyplate/next-page-title
```

# Usage

First, you need to set up the `PageTitleProvider` in your custom `_app.js` file to provide the page title context to your application.

### Setting up the Provider

1. Open your `_app.js` file.
2. Import the `PageTitleProvider` component.
3. Wrap your application with the `PageTitleProvider`.
4. (Optional) siteName is optional and falls back to process.env.NEXT_PUBLIC_SITE_NAME if not provided.
5. (Optional) formatTitle prop allows you to change the title returned, works well for Translations.

```jsx
// pages/_app.js
import { PageTitleProvider } from '@daveyplate/next-page-title'

function MyApp({ Component, pageProps }) {
    return (
        <PageTitleProvider siteName="YourSiteName">
            <Component {...pageProps} />
        </PageTitleProvider>
    )
}

export default MyApp
```

### Using `<PageTitle>` on a Page

To set a custom page title on a specific page, use the `PageTitle` component.

1. Open the page where you want to set a custom title (e.g., `pages/about.js`).
2. Import the `PageTitle` component.
3. Use the `PageTitle` component and pass the desired title as a prop.

```jsx
// pages/about.js
import { PageTitle } from '@daveyplate/next-page-title'

export default function AboutPage() {
    return (
        <>
            <PageTitle title="About Us" />
            <h1>About Us</h1>
            <p>Welcome to the about page.</p>
        </>
    )
}
```

Now, when you navigate to the `/about` page, the title of the page will be set to "About Us | YourSiteName".