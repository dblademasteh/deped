<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <title inertia>{{ config('app.name', 'DepEd Records') }}</title>

        <!-- PWA Meta -->
        <meta name="theme-color" content="#f53003">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="DepEd Records">
        <meta name="description" content="Employee Management System for Department of Education">
        <meta name="mobile-web-app-capable" content="yes">

        <!-- PWA Manifest -->
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

        <!-- Favicon -->
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png">

        @fonts
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead

        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(reg => console.log('SW registered:', reg.scope))
                        .catch(err => console.log('SW registration failed:', err));
                });
            }
        </script>
    </head>
    <body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] antialiased">
        @inertia
    </body>
</html>
